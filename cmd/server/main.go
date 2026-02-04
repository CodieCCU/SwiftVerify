package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
	"golang.org/x/crypto/bcrypt"
)

var (
	db       *sql.DB
	jwtKey   = []byte("your-secret-key-change-in-production")
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
)

// JWT Claims structure
type Claims struct {
	UserID   int    `json:"user_id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

// User models
type User struct {
	ID           int       `json:"id"`
	Username     string    `json:"username"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	Role         string    `json:"role"`
	FirstName    string    `json:"first_name,omitempty"`
	LastName     string    `json:"last_name,omitempty"`
	Phone        string    `json:"phone,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
}

type RegisterRequest struct {
	Username  string `json:"username"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	Role      string `json:"role"`
	FirstName string `json:"first_name,omitempty"`
	LastName  string `json:"last_name,omitempty"`
	Phone     string `json:"phone,omitempty"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

// Application models
type Application struct {
	ID               int       `json:"id"`
	TenantID         *int      `json:"tenant_id"`
	LandlordID       *int      `json:"landlord_id"`
	Email            string    `json:"email"`
	DriversLicense   string    `json:"drivers_license"`
	Status           string    `json:"status"`
	CurrentStage     int       `json:"current_stage"`
	TotalStages      int       `json:"total_stages"`
	AutomatedDecision *string  `json:"automated_decision"`
	FinalDecision    *string   `json:"final_decision"`
	FlagsCount       int       `json:"flags_count"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
	CompletedAt      *time.Time `json:"completed_at"`
}

type CreateApplicationRequest struct {
	Email          string `json:"email"`
	DriversLicense string `json:"drivers_license"`
	LandlordID     *int   `json:"landlord_id,omitempty"`
}

// Screening Policy models
type ScreeningPolicy struct {
	ID                          int       `json:"id"`
	LandlordID                  int       `json:"landlord_id"`
	PolicyName                  string    `json:"policy_name"`
	AutoDenyViolentCrimes       bool      `json:"auto_deny_violent_crimes"`
	AutoDenyPropertyCrimes      bool      `json:"auto_deny_property_crimes"`
	AutoDenyDrugCrimes          bool      `json:"auto_deny_drug_crimes"`
	CrimeLookbackYears          int       `json:"crime_lookback_years"`
	MinimumCreditScore          int       `json:"minimum_credit_score"`
	MinimumIncomeMultiplier     float64   `json:"minimum_income_multiplier"`
	RequireEmploymentVerification bool    `json:"require_employment_verification"`
	RequireLandlordReviewForFlags bool    `json:"require_landlord_review_for_flags"`
	Active                      bool      `json:"active"`
	CreatedAt                   time.Time `json:"created_at"`
}

type BackgroundCheck struct {
	ID                    int             `json:"id"`
	ApplicationID         int             `json:"application_id"`
	CriminalRecordFound   bool            `json:"criminal_record_found"`
	CriminalRecordDetails json.RawMessage `json:"criminal_record_details,omitempty"`
	CreditScore           *int            `json:"credit_score"`
	CreditReportSummary   json.RawMessage `json:"credit_report_summary,omitempty"`
	EvictionHistoryFound  bool            `json:"eviction_history_found"`
	EvictionDetails       json.RawMessage `json:"eviction_details,omitempty"`
	CheckStatus           string          `json:"check_status"`
	FlagsRaised           int             `json:"flags_raised"`
	CompletedAt           *time.Time      `json:"completed_at"`
	CreatedAt             time.Time       `json:"created_at"`
}

type EmploymentVerification struct {
	ID                 int        `json:"id"`
	ApplicationID      int        `json:"application_id"`
	EmployerName       *string    `json:"employer_name"`
	EmploymentStatus   *string    `json:"employment_status"`
	JobTitle           *string    `json:"job_title"`
	MonthlyIncome      *float64   `json:"monthly_income"`
	EmploymentStartDate *time.Time `json:"employment_start_date"`
	VerificationSource string     `json:"verification_source"`
	VerificationStatus string     `json:"verification_status"`
	VerifiedAt         *time.Time `json:"verified_at"`
	CreatedAt          time.Time  `json:"created_at"`
}

type LandlordReview struct {
	ID                int       `json:"id"`
	ApplicationID     int       `json:"application_id"`
	LandlordID        int       `json:"landlord_id"`
	ReviewType        string    `json:"review_type"`
	Decision          string    `json:"decision"`
	Reasoning         *string   `json:"reasoning"`
	OverrideAutomated bool      `json:"override_automated"`
	ReviewedAt        time.Time `json:"reviewed_at"`
	CreatedAt         time.Time `json:"created_at"`
}

type LandlordReviewRequest struct {
	Decision  string `json:"decision"`
	Reasoning string `json:"reasoning"`
}

type Appeal struct {
	ID                  int             `json:"id"`
	ApplicationID       int             `json:"application_id"`
	TenantID            int             `json:"tenant_id"`
	AppealReason        string          `json:"appeal_reason"`
	SupportingDocuments json.RawMessage `json:"supporting_documents,omitempty"`
	Status              string          `json:"status"`
	LandlordResponse    *string         `json:"landlord_response"`
	RespondedAt         *time.Time      `json:"responded_at"`
	CreatedAt           time.Time       `json:"created_at"`
}

func main() {
	// Initialize database connection
	initDB()
	defer db.Close()

	// Initialize random seed
	rand.Seed(time.Now().UnixNano())

	// Create router
	r := mux.NewRouter()

	// Public routes
	r.HandleFunc("/api/auth/register", registerHandler).Methods("POST", "OPTIONS")
	r.HandleFunc("/api/auth/login", loginHandler).Methods("POST", "OPTIONS")
	r.HandleFunc("/api/applications", createApplicationHandler).Methods("POST", "OPTIONS")

	// Protected routes (require authentication)
	api := r.PathPrefix("/api").Subrouter()
	api.Use(authMiddleware)

	// Application endpoints
	api.HandleFunc("/applications/{id}", getApplicationHandler).Methods("GET", "OPTIONS")
	api.HandleFunc("/applications/{id}/status", updateApplicationStatusHandler).Methods("POST", "OPTIONS")

	// Verification endpoints
	api.HandleFunc("/verification/equifax", equifaxVerificationHandler).Methods("POST", "OPTIONS")
	api.HandleFunc("/verification/background-check", backgroundCheckHandler).Methods("POST", "OPTIONS")

	// Landlord endpoints
	api.HandleFunc("/landlord/policies", createScreeningPolicyHandler).Methods("POST", "OPTIONS")
	api.HandleFunc("/landlord/policies", getScreeningPoliciesHandler).Methods("GET", "OPTIONS")
	api.HandleFunc("/landlord/applications", getLandlordApplicationsHandler).Methods("GET", "OPTIONS")
	api.HandleFunc("/landlord/applications/{id}/review", landlordReviewHandler).Methods("POST", "OPTIONS")
	api.HandleFunc("/landlord/applications/{id}/override", landlordOverrideHandler).Methods("POST", "OPTIONS")
	api.HandleFunc("/landlord/analytics", landlordAnalyticsHandler).Methods("GET", "OPTIONS")

	// Appeal endpoints
	api.HandleFunc("/applications/{id}/appeal", createAppealHandler).Methods("POST", "OPTIONS")
	api.HandleFunc("/applications/{id}/appeals", getAppealsHandler).Methods("GET", "OPTIONS")

	// WebSocket endpoint (legacy)
	r.HandleFunc("/ws", handleWebSocket)

	// Health check
	r.HandleFunc("/health", healthCheckHandler).Methods("GET")

	// Setup CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	// Start server
	port := getEnv("PORT", "8080")
	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}

func initDB() {
	var err error
	connStr := getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost/swiftverify?sslmode=disable")
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	if err = db.Ping(); err != nil {
		log.Printf("Warning: Database connection failed: %v", err)
		log.Println("Continuing without database connection (using mock data)")
		db = nil
	} else {
		log.Println("Database connection established")
	}
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

// Middleware for authentication
func authMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "OPTIONS" {
			next.ServeHTTP(w, r)
			return
		}

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Missing authorization header", http.StatusUnauthorized)
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		claims := &Claims{}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Add claims to request context (simplified version)
		r.Header.Set("X-User-ID", strconv.Itoa(claims.UserID))
		r.Header.Set("X-User-Role", claims.Role)

		next.ServeHTTP(w, r)
	})
}

// Handler: Register
func registerHandler(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate role
	if req.Role != "tenant" && req.Role != "landlord" && req.Role != "admin" {
		http.Error(w, "Invalid role. Must be 'tenant', 'landlord', or 'admin'", http.StatusBadRequest)
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}

	// Create user (mock if no DB)
	user := User{
		ID:           int(time.Now().Unix()),
		Username:     req.Username,
		Email:        req.Email,
		PasswordHash: string(hashedPassword),
		Role:         req.Role,
		FirstName:    req.FirstName,
		LastName:     req.LastName,
		Phone:        req.Phone,
		CreatedAt:    time.Now(),
	}

	if db != nil {
		err = db.QueryRow(`
			INSERT INTO users (username, email, password_hash, role, first_name, last_name, phone)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
			RETURNING id, created_at
		`, req.Username, req.Email, string(hashedPassword), req.Role, req.FirstName, req.LastName, req.Phone).
			Scan(&user.ID, &user.CreatedAt)

		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to create user: %v", err), http.StatusInternalServerError)
			return
		}

		// Create landlord profile if role is landlord
		if req.Role == "landlord" {
			_, err = db.Exec(`
				INSERT INTO landlord_profiles (user_id)
				VALUES ($1)
			`, user.ID)
			if err != nil {
				log.Printf("Warning: Failed to create landlord profile: %v", err)
			}
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// Handler: Login
func loginHandler(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var user User

	if db != nil {
		err := db.QueryRow(`
			SELECT id, username, email, password_hash, role, first_name, last_name, phone, created_at
			FROM users WHERE username = $1
		`, req.Username).Scan(&user.ID, &user.Username, &user.Email, &user.PasswordHash,
			&user.Role, &user.FirstName, &user.LastName, &user.Phone, &user.CreatedAt)

		if err != nil {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}

		// Check password
		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}
	} else {
		// Mock authentication for demo
		if req.Username == "tenant@test.com" && req.Password == "password" {
			user = User{
				ID:        1,
				Username:  "tenant@test.com",
				Email:     "tenant@test.com",
				Role:      "tenant",
				CreatedAt: time.Now(),
			}
		} else if req.Username == "landlord@test.com" && req.Password == "password" {
			user = User{
				ID:        2,
				Username:  "landlord@test.com",
				Email:     "landlord@test.com",
				Role:      "landlord",
				CreatedAt: time.Now(),
			}
		} else {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}
	}

	// Generate JWT token
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		UserID:   user.ID,
		Username: user.Username,
		Role:     user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(LoginResponse{
		Token: tokenString,
		User:  user,
	})
}

// Handler: Create Application
func createApplicationHandler(w http.ResponseWriter, r *http.Request) {
	var req CreateApplicationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	app := Application{
		ID:             int(time.Now().Unix()),
		Email:          req.Email,
		DriversLicense: req.DriversLicense,
		LandlordID:     req.LandlordID,
		Status:         "IDENTITY_VERIFICATION",
		CurrentStage:   1,
		TotalStages:    5,
		FlagsCount:     0,
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
	}

	if db != nil {
		err := db.QueryRow(`
			INSERT INTO applications (tenant_id, landlord_id, email, drivers_license, status, current_stage, total_stages)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
			RETURNING id, created_at, updated_at
		`, nil, req.LandlordID, req.Email, req.DriversLicense, app.Status, app.CurrentStage, app.TotalStages).
			Scan(&app.ID, &app.CreatedAt, &app.UpdatedAt)

		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to create application: %v", err), http.StatusInternalServerError)
			return
		}

		// Start identity verification
		_, err = db.Exec(`
			INSERT INTO identity_verifications (application_id, verification_status)
			VALUES ($1, 'PENDING')
		`, app.ID)
		if err != nil {
			log.Printf("Warning: Failed to create identity verification: %v", err)
		}

		// Log audit trail
		logAuditTrail(app.ID, 0, "APPLICATION_CREATED", map[string]interface{}{
			"email":           req.Email,
			"drivers_license": maskString(req.DriversLicense),
		})
	}

	// Simulate identity verification processing
	go processIdentityVerification(app.ID, req.Email, req.DriversLicense)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(app)
}

// Handler: Get Application
func getApplicationHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	appID := vars["id"]

	var app Application
	
	if db != nil {
		err := db.QueryRow(`
			SELECT id, tenant_id, landlord_id, email, drivers_license, status, current_stage, 
			       total_stages, automated_decision, final_decision, flags_count, 
			       created_at, updated_at, completed_at
			FROM applications WHERE id = $1
		`, appID).Scan(&app.ID, &app.TenantID, &app.LandlordID, &app.Email, &app.DriversLicense,
			&app.Status, &app.CurrentStage, &app.TotalStages, &app.AutomatedDecision,
			&app.FinalDecision, &app.FlagsCount, &app.CreatedAt, &app.UpdatedAt, &app.CompletedAt)

		if err != nil {
			http.Error(w, "Application not found", http.StatusNotFound)
			return
		}
	} else {
		// Mock data
		id, _ := strconv.Atoi(appID)
		app = Application{
			ID:           id,
			Email:        "test@example.com",
			DriversLicense: "ABC123456",
			Status:       "APPROVED",
			CurrentStage: 5,
			TotalStages:  5,
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(app)
}

// Handler: Equifax Employment Verification
func equifaxVerificationHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ApplicationID int `json:"application_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Simulate Equifax Work Number verification
	verification := EmploymentVerification{
		ID:                 int(time.Now().Unix()),
		ApplicationID:      req.ApplicationID,
		VerificationSource: "Equifax Work Number",
		VerificationStatus: "VERIFIED",
		CreatedAt:          time.Now(),
	}

	// Mock employment data
	employerName := "Acme Corporation"
	employmentStatus := "ACTIVE"
	jobTitle := "Software Engineer"
	monthlyIncome := 5000.00
	startDate := time.Now().AddDate(-2, 0, 0)
	now := time.Now()

	verification.EmployerName = &employerName
	verification.EmploymentStatus = &employmentStatus
	verification.JobTitle = &jobTitle
	verification.MonthlyIncome = &monthlyIncome
	verification.EmploymentStartDate = &startDate
	verification.VerifiedAt = &now

	if db != nil {
		err := db.QueryRow(`
			INSERT INTO employment_verifications 
			(application_id, employer_name, employment_status, job_title, monthly_income, 
			 employment_start_date, verification_source, verification_status, verified_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
			RETURNING id, created_at
		`, req.ApplicationID, employerName, employmentStatus, jobTitle, monthlyIncome,
			startDate, "Equifax Work Number", "VERIFIED", now).
			Scan(&verification.ID, &verification.CreatedAt)

		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to save verification: %v", err), http.StatusInternalServerError)
			return
		}

		// Update application stage
		_, err = db.Exec(`
			UPDATE applications 
			SET status = 'BACKGROUND_CHECK', current_stage = 3, updated_at = NOW()
			WHERE id = $1
		`, req.ApplicationID)
		if err != nil {
			log.Printf("Warning: Failed to update application status: %v", err)
		}

		logAuditTrail(req.ApplicationID, 0, "EMPLOYMENT_VERIFIED", map[string]interface{}{
			"employer":       employerName,
			"monthly_income": monthlyIncome,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(verification)
}

// Handler: Background Check
func backgroundCheckHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ApplicationID int `json:"application_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Simulate background check with random results
	hasCriminalRecord := rand.Float64() < 0.15 // 15% chance of criminal record
	creditScore := 600 + rand.Intn(200)        // Credit score between 600-800
	hasEviction := rand.Float64() < 0.05       // 5% chance of eviction

	flagsRaised := 0
	if hasCriminalRecord {
		flagsRaised++
	}
	if creditScore < 620 {
		flagsRaised++
	}
	if hasEviction {
		flagsRaised++
	}

	now := time.Now()
	bgCheck := BackgroundCheck{
		ID:                   int(time.Now().Unix()),
		ApplicationID:        req.ApplicationID,
		CriminalRecordFound:  hasCriminalRecord,
		CreditScore:          &creditScore,
		EvictionHistoryFound: hasEviction,
		CheckStatus:          "COMPLETED",
		FlagsRaised:          flagsRaised,
		CompletedAt:          &now,
		CreatedAt:            time.Now(),
	}

	// Generate criminal record details if found
	if hasCriminalRecord {
		crimeTypes := []string{"PROPERTY", "DRUG", "VIOLENT", "MISDEMEANOR"}
		criminalDetails := map[string]interface{}{
			"offenses": []map[string]interface{}{
				{
					"type":        crimeTypes[rand.Intn(len(crimeTypes))],
					"description": "Sample offense description",
					"date":        time.Now().AddDate(-rand.Intn(10), 0, 0).Format("2006-01-02"),
					"disposition": "Convicted",
				},
			},
		}
		detailsJSON, _ := json.Marshal(criminalDetails)
		bgCheck.CriminalRecordDetails = detailsJSON
	}

	if db != nil {
		var criminalDetailsJSON interface{}
		if hasCriminalRecord {
			criminalDetailsJSON = bgCheck.CriminalRecordDetails
		}

		err := db.QueryRow(`
			INSERT INTO background_checks 
			(application_id, criminal_record_found, criminal_record_details, credit_score, 
			 eviction_history_found, check_status, flags_raised, completed_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
			RETURNING id, created_at
		`, req.ApplicationID, hasCriminalRecord, criminalDetailsJSON, creditScore,
			hasEviction, "COMPLETED", flagsRaised, now).
			Scan(&bgCheck.ID, &bgCheck.CreatedAt)

		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to save background check: %v", err), http.StatusInternalServerError)
			return
		}

		// Determine next status based on flags
		newStatus := "PENDING_LANDLORD_REVIEW"
		automatedDecision := "FLAGGED"
		
		if flagsRaised == 0 {
			automatedDecision = "APPROVED"
		}

		// Update application
		_, err = db.Exec(`
			UPDATE applications 
			SET status = $1, current_stage = 4, flags_count = $2, 
			    automated_decision = $3, updated_at = NOW()
			WHERE id = $4
		`, newStatus, flagsRaised, automatedDecision, req.ApplicationID)
		if err != nil {
			log.Printf("Warning: Failed to update application: %v", err)
		}

		logAuditTrail(req.ApplicationID, 0, "BACKGROUND_CHECK_COMPLETED", map[string]interface{}{
			"criminal_record": hasCriminalRecord,
			"credit_score":    creditScore,
			"flags_raised":    flagsRaised,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(bgCheck)
}

// Handler: Create Screening Policy
func createScreeningPolicyHandler(w http.ResponseWriter, r *http.Request) {
	userID, _ := strconv.Atoi(r.Header.Get("X-User-ID"))
	userRole := r.Header.Get("X-User-Role")

	if userRole != "landlord" && userRole != "admin" {
		http.Error(w, "Only landlords can create screening policies", http.StatusForbidden)
		return
	}

	var policy ScreeningPolicy
	if err := json.NewDecoder(r.Body).Decode(&policy); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	policy.LandlordID = userID
	policy.CreatedAt = time.Now()

	if db != nil {
		err := db.QueryRow(`
			INSERT INTO screening_policies 
			(landlord_id, policy_name, auto_deny_violent_crimes, auto_deny_property_crimes,
			 auto_deny_drug_crimes, crime_lookback_years, minimum_credit_score,
			 minimum_income_multiplier, require_employment_verification, 
			 require_landlord_review_for_flags, active)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
			RETURNING id, created_at
		`, userID, policy.PolicyName, policy.AutoDenyViolentCrimes, policy.AutoDenyPropertyCrimes,
			policy.AutoDenyDrugCrimes, policy.CrimeLookbackYears, policy.MinimumCreditScore,
			policy.MinimumIncomeMultiplier, policy.RequireEmploymentVerification,
			policy.RequireLandlordReviewForFlags, policy.Active).
			Scan(&policy.ID, &policy.CreatedAt)

		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to create policy: %v", err), http.StatusInternalServerError)
			return
		}
	} else {
		policy.ID = int(time.Now().Unix())
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(policy)
}

// Handler: Get Screening Policies
func getScreeningPoliciesHandler(w http.ResponseWriter, r *http.Request) {
	userID, _ := strconv.Atoi(r.Header.Get("X-User-ID"))

	policies := []ScreeningPolicy{}

	if db != nil {
		rows, err := db.Query(`
			SELECT id, landlord_id, policy_name, auto_deny_violent_crimes, auto_deny_property_crimes,
			       auto_deny_drug_crimes, crime_lookback_years, minimum_credit_score,
			       minimum_income_multiplier, require_employment_verification,
			       require_landlord_review_for_flags, active, created_at
			FROM screening_policies
			WHERE landlord_id = $1
			ORDER BY created_at DESC
		`, userID)
		if err != nil {
			http.Error(w, "Failed to fetch policies", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		for rows.Next() {
			var p ScreeningPolicy
			err := rows.Scan(&p.ID, &p.LandlordID, &p.PolicyName, &p.AutoDenyViolentCrimes,
				&p.AutoDenyPropertyCrimes, &p.AutoDenyDrugCrimes, &p.CrimeLookbackYears,
				&p.MinimumCreditScore, &p.MinimumIncomeMultiplier, &p.RequireEmploymentVerification,
				&p.RequireLandlordReviewForFlags, &p.Active, &p.CreatedAt)
			if err != nil {
				continue
			}
			policies = append(policies, p)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(policies)
}

// Handler: Get Landlord Applications
func getLandlordApplicationsHandler(w http.ResponseWriter, r *http.Request) {
	userID, _ := strconv.Atoi(r.Header.Get("X-User-ID"))

	applications := []Application{}

	if db != nil {
		rows, err := db.Query(`
			SELECT id, tenant_id, landlord_id, email, drivers_license, status, current_stage,
			       total_stages, automated_decision, final_decision, flags_count,
			       created_at, updated_at, completed_at
			FROM applications
			WHERE landlord_id = $1 OR landlord_id IS NULL
			ORDER BY created_at DESC
		`, userID)
		if err != nil {
			http.Error(w, "Failed to fetch applications", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		for rows.Next() {
			var app Application
			err := rows.Scan(&app.ID, &app.TenantID, &app.LandlordID, &app.Email,
				&app.DriversLicense, &app.Status, &app.CurrentStage, &app.TotalStages,
				&app.AutomatedDecision, &app.FinalDecision, &app.FlagsCount,
				&app.CreatedAt, &app.UpdatedAt, &app.CompletedAt)
			if err != nil {
				continue
			}
			applications = append(applications, app)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(applications)
}

// Handler: Landlord Review
func landlordReviewHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	appID := vars["id"]
	userID, _ := strconv.Atoi(r.Header.Get("X-User-ID"))

	var req LandlordReviewRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	review := LandlordReview{
		ID:            int(time.Now().Unix()),
		LandlordID:    userID,
		ReviewType:    "INITIAL",
		Decision:      req.Decision,
		Reasoning:     &req.Reasoning,
		ReviewedAt:    time.Now(),
		CreatedAt:     time.Now(),
	}

	appIDInt, _ := strconv.Atoi(appID)
	review.ApplicationID = appIDInt

	if db != nil {
		err := db.QueryRow(`
			INSERT INTO landlord_reviews 
			(application_id, landlord_id, review_type, decision, reasoning, reviewed_at)
			VALUES ($1, $2, $3, $4, $5, $6)
			RETURNING id, created_at
		`, appIDInt, userID, "INITIAL", req.Decision, req.Reasoning, time.Now()).
			Scan(&review.ID, &review.CreatedAt)

		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to save review: %v", err), http.StatusInternalServerError)
			return
		}

		// Update application status
		newStatus := "APPROVED"
		if req.Decision == "DENIED" {
			newStatus = "DENIED"
		}

		now := time.Now()
		_, err = db.Exec(`
			UPDATE applications 
			SET status = $1, final_decision = $2, current_stage = 5, 
			    completed_at = $3, updated_at = NOW()
			WHERE id = $4
		`, newStatus, req.Decision, now, appIDInt)
		if err != nil {
			log.Printf("Warning: Failed to update application: %v", err)
		}

		logAuditTrail(appIDInt, userID, "LANDLORD_REVIEW_COMPLETED", map[string]interface{}{
			"decision":  req.Decision,
			"reasoning": req.Reasoning,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(review)
}

// Handler: Landlord Override
func landlordOverrideHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	appID := vars["id"]
	userID, _ := strconv.Atoi(r.Header.Get("X-User-ID"))

	var req LandlordReviewRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	review := LandlordReview{
		ID:                int(time.Now().Unix()),
		LandlordID:        userID,
		ReviewType:        "OVERRIDE",
		Decision:          req.Decision,
		Reasoning:         &req.Reasoning,
		OverrideAutomated: true,
		ReviewedAt:        time.Now(),
		CreatedAt:         time.Now(),
	}

	appIDInt, _ := strconv.Atoi(appID)
	review.ApplicationID = appIDInt

	if db != nil {
		err := db.QueryRow(`
			INSERT INTO landlord_reviews 
			(application_id, landlord_id, review_type, decision, reasoning, 
			 override_automated, reviewed_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
			RETURNING id, created_at
		`, appIDInt, userID, "OVERRIDE", req.Decision, req.Reasoning, true, time.Now()).
			Scan(&review.ID, &review.CreatedAt)

		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to save override: %v", err), http.StatusInternalServerError)
			return
		}

		// Update application with override
		newStatus := "APPROVED"
		if req.Decision == "DENIED" {
			newStatus = "DENIED"
		}

		now := time.Now()
		_, err = db.Exec(`
			UPDATE applications 
			SET status = $1, final_decision = $2, completed_at = $3, updated_at = NOW()
			WHERE id = $4
		`, newStatus, req.Decision, now, appIDInt)
		if err != nil {
			log.Printf("Warning: Failed to update application: %v", err)
		}

		logAuditTrail(appIDInt, userID, "LANDLORD_OVERRIDE", map[string]interface{}{
			"decision":  req.Decision,
			"reasoning": req.Reasoning,
			"override":  true,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(review)
}

// Handler: Create Appeal
func createAppealHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	appID := vars["id"]
	userID, _ := strconv.Atoi(r.Header.Get("X-User-ID"))

	var req struct {
		AppealReason string `json:"appeal_reason"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	appIDInt, _ := strconv.Atoi(appID)
	appeal := Appeal{
		ID:            int(time.Now().Unix()),
		ApplicationID: appIDInt,
		TenantID:      userID,
		AppealReason:  req.AppealReason,
		Status:        "PENDING",
		CreatedAt:     time.Now(),
	}

	if db != nil {
		err := db.QueryRow(`
			INSERT INTO appeals (application_id, tenant_id, appeal_reason, status)
			VALUES ($1, $2, $3, $4)
			RETURNING id, created_at
		`, appIDInt, userID, req.AppealReason, "PENDING").
			Scan(&appeal.ID, &appeal.CreatedAt)

		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to create appeal: %v", err), http.StatusInternalServerError)
			return
		}

		// Update application status
		_, err = db.Exec(`
			UPDATE applications 
			SET status = 'APPEALED', updated_at = NOW()
			WHERE id = $1
		`, appIDInt)
		if err != nil {
			log.Printf("Warning: Failed to update application: %v", err)
		}

		logAuditTrail(appIDInt, userID, "APPEAL_SUBMITTED", map[string]interface{}{
			"appeal_reason": req.AppealReason,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(appeal)
}

// Handler: Get Appeals
func getAppealsHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	appID := vars["id"]

	appeals := []Appeal{}

	if db != nil {
		rows, err := db.Query(`
			SELECT id, application_id, tenant_id, appeal_reason, supporting_documents,
			       status, landlord_response, responded_at, created_at
			FROM appeals
			WHERE application_id = $1
			ORDER BY created_at DESC
		`, appID)
		if err != nil {
			http.Error(w, "Failed to fetch appeals", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		for rows.Next() {
			var a Appeal
			err := rows.Scan(&a.ID, &a.ApplicationID, &a.TenantID, &a.AppealReason,
				&a.SupportingDocuments, &a.Status, &a.LandlordResponse,
				&a.RespondedAt, &a.CreatedAt)
			if err != nil {
				continue
			}
			appeals = append(appeals, a)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(appeals)
}

// Handler: Landlord Analytics
func landlordAnalyticsHandler(w http.ResponseWriter, r *http.Request) {
	userID, _ := strconv.Atoi(r.Header.Get("X-User-ID"))

	var totalApps, approvedCount, deniedCount, pendingCount, flaggedCount int

	if db != nil {
		db.QueryRow(`
			SELECT COUNT(*) FROM applications WHERE landlord_id = $1
		`, userID).Scan(&totalApps)

		db.QueryRow(`
			SELECT COUNT(*) FROM applications WHERE landlord_id = $1 AND status = 'APPROVED'
		`, userID).Scan(&approvedCount)

		db.QueryRow(`
			SELECT COUNT(*) FROM applications WHERE landlord_id = $1 AND status = 'DENIED'
		`, userID).Scan(&deniedCount)

		db.QueryRow(`
			SELECT COUNT(*) FROM applications 
			WHERE landlord_id = $1 AND status IN ('PENDING', 'PENDING_LANDLORD_REVIEW')
		`, userID).Scan(&pendingCount)

		db.QueryRow(`
			SELECT COUNT(*) FROM applications WHERE landlord_id = $1 AND flags_count > 0
		`, userID).Scan(&flaggedCount)
	}

	analytics := map[string]interface{}{
		"total_applications":    totalApps,
		"approved_count":        approvedCount,
		"denied_count":          deniedCount,
		"pending_count":         pendingCount,
		"flagged_count":         flaggedCount,
		"average_approval_time": "2.5 days",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(analytics)
}

// Handler: Update Application Status
func updateApplicationStatusHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	appID := vars["id"]

	var req struct {
		Status string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if db != nil {
		_, err := db.Exec(`
			UPDATE applications SET status = $1, updated_at = NOW() WHERE id = $2
		`, req.Status, appID)
		if err != nil {
			http.Error(w, "Failed to update application", http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Application status updated",
	})
}

// Handler: Health Check
func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	status := map[string]interface{}{
		"status": "healthy",
		"time":   time.Now(),
	}

	if db != nil {
		if err := db.Ping(); err != nil {
			status["database"] = "disconnected"
		} else {
			status["database"] = "connected"
		}
	} else {
		status["database"] = "not configured"
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(status)
}

// Legacy WebSocket handler
func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "Could not upgrade connection", http.StatusBadRequest)
		return
	}
	defer conn.Close()

	for {
		messageType, msg, err := conn.ReadMessage()
		if err != nil {
			break
		}
		if err := conn.WriteMessage(messageType, msg); err != nil {
			break
		}
	}
}

// Helper: Process Identity Verification (async simulation)
func processIdentityVerification(appID int, email, license string) {
	time.Sleep(2 * time.Second) // Simulate processing delay

	// Random verification result (80% success rate)
	success := rand.Float64() < 0.8

	if db != nil {
		status := "PASSED"
		if !success {
			status = "FAILED"
		}

		now := time.Now()
		_, err := db.Exec(`
			UPDATE identity_verifications 
			SET email_verified = $1, license_verified = $2, 
			    verification_status = $3, verified_at = $4
			WHERE application_id = $5
		`, success, success, status, now, appID)
		if err != nil {
			log.Printf("Error updating identity verification: %v", err)
			return
		}

		if success {
			// Move to next stage
			_, err = db.Exec(`
				UPDATE applications 
				SET status = 'EMPLOYMENT_VERIFICATION', current_stage = 2, updated_at = NOW()
				WHERE id = $1
			`, appID)
			if err != nil {
				log.Printf("Error updating application: %v", err)
			}

			logAuditTrail(appID, 0, "IDENTITY_VERIFIED", map[string]interface{}{
				"email_verified":   success,
				"license_verified": success,
			})
		} else {
			_, err = db.Exec(`
				UPDATE applications 
				SET status = 'DENIED', final_decision = 'DENIED', updated_at = NOW()
				WHERE id = $1
			`, appID)
			if err != nil {
				log.Printf("Error updating application: %v", err)
			}

			logAuditTrail(appID, 0, "IDENTITY_VERIFICATION_FAILED", map[string]interface{}{
				"reason": "Failed to verify identity",
			})
		}
	}
}

// Helper: Log Audit Trail
func logAuditTrail(appID, userID int, action string, details map[string]interface{}) {
	if db == nil {
		return
	}

	detailsJSON, err := json.Marshal(details)
	if err != nil {
		log.Printf("Error marshaling audit details: %v", err)
		return
	}

	var performedBy interface{} = nil
	if userID > 0 {
		performedBy = userID
	}

	_, err = db.Exec(`
		INSERT INTO application_audit_log (application_id, action, performed_by, details)
		VALUES ($1, $2, $3, $4)
	`, appID, action, performedBy, detailsJSON)
	if err != nil {
		log.Printf("Error logging audit trail: %v", err)
	}
}

// Helper: Mask sensitive strings
func maskString(s string) string {
	if len(s) <= 4 {
		return "****"
	}
	return s[:4] + "****"
}