package main

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/rs/cors"
	"golang.org/x/crypto/bcrypt"
)

var (
	jwtSecret = []byte(getEnvOrDefault("JWT_SECRET", "swiftverify-secret-key-change-in-production"))
	upgrader  = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true // In production, implement proper origin checking
		},
	}
)

type Claims struct {
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type MFARequest struct {
	Code string `json:"code"`
}

type LoginResponse struct {
	Token        string `json:"token"`
	MFARequired  bool   `json:"mfaRequired,omitempty"`
	MFASessionID string `json:"mfaSessionId,omitempty"`
}

type VerificationRequest struct {
	Email          string `json:"email"`
	LicenseNumber  string `json:"licenseNumber"`
	InputMethod    string `json:"inputMethod"`
	IncomeProof    string `json:"incomeProof,omitempty"`
	StaffAssisted  bool   `json:"staffAssisted"`
	LowDepositMode bool   `json:"lowDepositMode"`
}

type AuditLog struct {
	Timestamp   time.Time `json:"timestamp"`
	Action      string    `json:"action"`
	User        string    `json:"user"`
	IPAddress   string    `json:"ipAddress"`
	Details     string    `json:"details"`
	DeviceInfo  string    `json:"deviceInfo"`
}

// In-memory storage (in production, use a real database)
var auditLogs []AuditLog
var mfaSessions = make(map[string]string) // sessionID -> username

func main() {
	router := mux.NewRouter()

	// API routes
	api := router.PathPrefix("/api").Subrouter()
	
	// Authentication endpoints
	api.HandleFunc("/login", handleLogin).Methods("POST", "OPTIONS")
	api.HandleFunc("/mfa/verify", handleMFAVerify).Methods("POST", "OPTIONS")
	api.HandleFunc("/logout", authMiddleware(handleLogout)).Methods("POST", "OPTIONS")
	
	// Verification endpoints
	api.HandleFunc("/verify", authMiddleware(handleVerification)).Methods("POST", "OPTIONS")
	api.HandleFunc("/upload", authMiddleware(handleFileUpload)).Methods("POST", "OPTIONS")
	
	// Audit and logging endpoints (admin only)
	api.HandleFunc("/audit/logs", authMiddleware(handleGetAuditLogs)).Methods("GET", "OPTIONS")
	
	// WebSocket endpoint
	api.HandleFunc("/ws", handleWebSocket).Methods("GET")
	
	// Health check
	api.HandleFunc("/health", handleHealth).Methods("GET")

	// CORS middleware
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://localhost:3000", "*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	handler := c.Handler(router)
	
	// Determine if we should use HTTPS
	useHTTPS := getEnvOrDefault("USE_HTTPS", "false") == "true"
	port := getEnvOrDefault("PORT", "8080")
	
	log.Printf("Starting SwiftVerify server on port %s (HTTPS: %v)", port, useHTTPS)
	
	if useHTTPS {
		certFile := getEnvOrDefault("TLS_CERT", "server.crt")
		keyFile := getEnvOrDefault("TLS_KEY", "server.key")
		log.Printf("Using TLS with cert: %s, key: %s", certFile, keyFile)
		log.Fatal(http.ListenAndServeTLS(":"+port, certFile, keyFile, handler))
	} else {
		log.Printf("WARNING: Running without TLS. Set USE_HTTPS=true for production.")
		log.Fatal(http.ListenAndServe(":"+port, handler))
	}
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// Log login attempt
	logAudit("LOGIN_ATTEMPT", req.Username, r.RemoteAddr, fmt.Sprintf("User: %s", req.Username), r.UserAgent())

	// Simple authentication (in production, check against database with hashed passwords)
	if req.Username != "" && req.Password != "" {
		// Simulate MFA requirement for enhanced security
		mfaRequired := true // In production, check user settings
		
		if mfaRequired {
			// Generate MFA session
			sessionID := generateRandomString(32)
			mfaSessions[sessionID] = req.Username
			
			// In production, send actual MFA code via SMS/email
			log.Printf("MFA code for %s: 123456 (demo)", req.Username)
			
			logAudit("MFA_INITIATED", req.Username, r.RemoteAddr, "MFA session created", r.UserAgent())
			
			json.NewEncoder(w).Encode(LoginResponse{
				MFARequired:  true,
				MFASessionID: sessionID,
			})
			return
		}
		
		// Generate JWT token
		token, err := generateToken(req.Username, "user")
		if err != nil {
			http.Error(w, "Token generation failed", http.StatusInternalServerError)
			return
		}
		
		logAudit("LOGIN_SUCCESS", req.Username, r.RemoteAddr, "Login successful", r.UserAgent())
		
		json.NewEncoder(w).Encode(LoginResponse{
			Token:       token,
			MFARequired: false,
		})
		return
	}
	
	logAudit("LOGIN_FAILED", req.Username, r.RemoteAddr, "Invalid credentials", r.UserAgent())
	http.Error(w, "Invalid credentials", http.StatusUnauthorized)
}

func handleMFAVerify(w http.ResponseWriter, r *http.Request) {
	sessionID := r.Header.Get("X-MFA-Session")
	if sessionID == "" {
		http.Error(w, "Missing MFA session", http.StatusBadRequest)
		return
	}
	
	username, exists := mfaSessions[sessionID]
	if !exists {
		http.Error(w, "Invalid MFA session", http.StatusUnauthorized)
		return
	}
	
	var req MFARequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	
	// In production, verify actual MFA code
	// For demo purposes, accept "123456"
	if req.Code == "123456" {
		// Generate JWT token
		token, err := generateToken(username, "user")
		if err != nil {
			http.Error(w, "Token generation failed", http.StatusInternalServerError)
			return
		}
		
		// Clean up MFA session
		delete(mfaSessions, sessionID)
		
		logAudit("MFA_SUCCESS", username, r.RemoteAddr, "MFA verification successful", r.UserAgent())
		
		json.NewEncoder(w).Encode(LoginResponse{
			Token:       token,
			MFARequired: false,
		})
		return
	}
	
	logAudit("MFA_FAILED", username, r.RemoteAddr, "MFA verification failed", r.UserAgent())
	http.Error(w, "Invalid MFA code", http.StatusUnauthorized)
}

func handleLogout(w http.ResponseWriter, r *http.Request) {
	username := r.Header.Get("X-Username")
	logAudit("LOGOUT", username, r.RemoteAddr, "User logged out", r.UserAgent())
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Logged out successfully"})
}

func handleVerification(w http.ResponseWriter, r *http.Request) {
	username := r.Header.Get("X-Username")
	
	var req VerificationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	
	details := fmt.Sprintf("Email: %s, Method: %s, StaffAssisted: %v, LowDeposit: %v", 
		req.Email, req.InputMethod, req.StaffAssisted, req.LowDepositMode)
	logAudit("VERIFICATION_REQUEST", username, r.RemoteAddr, details, r.UserAgent())
	
	// Simulate verification processing
	// In production, integrate with actual verification services
	
	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "processing",
		"message": "Verification request submitted successfully",
	})
}

func handleFileUpload(w http.ResponseWriter, r *http.Request) {
	username := r.Header.Get("X-Username")
	
	// Parse multipart form (max 10MB)
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, "File too large", http.StatusBadRequest)
		return
	}
	
	file, header, err := r.FormFile("document")
	if err != nil {
		http.Error(w, "No file uploaded", http.StatusBadRequest)
		return
	}
	defer file.Close()
	
	// In production, validate file type, scan for malware, and store securely
	logAudit("FILE_UPLOAD", username, r.RemoteAddr, 
		fmt.Sprintf("File: %s, Size: %d", header.Filename, header.Size), r.UserAgent())
	
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":   "success",
		"filename": header.Filename,
		"message":  "File uploaded successfully",
	})
}

func handleGetAuditLogs(w http.ResponseWriter, r *http.Request) {
	// In production, implement proper authorization for admin users
	role := r.Header.Get("X-Role")
	if role != "admin" {
		// For demo, allow all authenticated users
		// http.Error(w, "Unauthorized", http.StatusForbidden)
		// return
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(auditLogs)
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":    "healthy",
		"timestamp": time.Now().Format(time.RFC3339),
		"version":   "1.0.0",
	})
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "Could not upgrade connection", http.StatusBadRequest)
		return
	}
	defer conn.Close()

	// Handle WebSocket communication
	for {
		messageType, msg, err := conn.ReadMessage()
		if err != nil {
			break
		}
		// Echo message back (in production, implement actual logic)
		if err := conn.WriteMessage(messageType, msg); err != nil {
			break
		}
	}
}

// Middleware for JWT authentication
func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Missing authorization header", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "Invalid authorization header", http.StatusUnauthorized)
			return
		}

		tokenString := parts[1]
		claims := &Claims{}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Store username and role in headers for handlers to use
		// In production, use context.Context with proper key/value pairs
		r.Header.Set("X-Username", claims.Username)
		r.Header.Set("X-Role", claims.Role)
		
		next(w, r)
	}
}

func generateToken(username, role string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Username: username,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func logAudit(action, user, ipAddress, details, deviceInfo string) {
	log := AuditLog{
		Timestamp:  time.Now(),
		Action:     action,
		User:       user,
		IPAddress:  ipAddress,
		Details:    details,
		DeviceInfo: deviceInfo,
	}
	auditLogs = append(auditLogs, log)
	
	// In production, persist to database
	fmt.Printf("[AUDIT] %s | %s | %s | %s\n", log.Timestamp.Format(time.RFC3339), action, user, details)
}

func generateRandomString(length int) string {
	b := make([]byte, length)
	rand.Read(b)
	return base64.URLEncoding.EncodeToString(b)[:length]
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func checkPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}