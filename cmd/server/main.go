package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/CodieCCU/SwiftVerify/cmd/server/services"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var equifaxService *services.EquifaxService

// VerificationRequest represents a verification request from the client
type VerificationRequest struct {
	Email         string `json:"email"`
	LicenseNumber string `json:"license_number"`
	RetryCount    int    `json:"retry_count"`
}

// VerificationResponse represents the response to send to the client
type VerificationResponse struct {
	Status              string                 `json:"status"`
	DataFreeze          bool                   `json:"data_freeze"`
	ErrorType           string                 `json:"error_type,omitempty"`
	ErrorMessage        string                 `json:"error_message,omitempty"`
	RetryAllowed        bool                   `json:"retry_allowed"`
	FreezeInstructions  map[string]interface{} `json:"freeze_instructions,omitempty"`
	VerificationDetails map[string]interface{} `json:"verification_details,omitempty"`
}

func main() {
	// Initialize Equifax service
	equifaxService = services.NewEquifaxService("", "")

	// Enable CORS
	http.HandleFunc("/ws", handleWebSocket)
	http.HandleFunc("/api/verify", corsMiddleware(handleVerification))
	http.HandleFunc("/api/freeze-instructions", corsMiddleware(handleFreezeInstructions))

	log.Println("Server starting on :8080...")
	http.ListenAndServe(":8080", nil)
}

// corsMiddleware adds CORS headers to allow frontend access
func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

// handleVerification processes tenant verification requests
func handleVerification(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req VerificationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Log the verification attempt
	log.Printf("Verification attempt for email: %s, retry: %d", req.Email, req.RetryCount)

	// Call Equifax service
	equifaxResp, err := equifaxService.VerifyTenant(req.Email, req.LicenseNumber)

	response := VerificationResponse{
		Status:              equifaxResp.Status,
		DataFreeze:          equifaxResp.DataFreeze,
		ErrorType:           equifaxResp.ErrorType,
		ErrorMessage:        equifaxResp.ErrorMessage,
		RetryAllowed:        true, // Always allow retries
		VerificationDetails: equifaxResp.RawData,
	}

	// If data freeze detected, include instructions
	if equifaxResp.DataFreeze {
		response.FreezeInstructions = equifaxService.GetDataFreezeInstructions()
	}

	// Log the result for analytics
	logVerificationAttempt(req, equifaxResp, err)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// handleFreezeInstructions returns detailed instructions for data freeze removal
func handleFreezeInstructions(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	instructions := equifaxService.GetDataFreezeInstructions()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(instructions)
}

// logVerificationAttempt logs verification attempts for analytics
func logVerificationAttempt(req VerificationRequest, resp *services.EquifaxResponse, err error) {
	logEntry := map[string]interface{}{
		"timestamp":      time.Now().Format(time.RFC3339),
		"email":          req.Email,
		"retry_count":    req.RetryCount,
		"status":         resp.Status,
		"data_freeze":    resp.DataFreeze,
		"error_type":     resp.ErrorType,
		"error_occurred": err != nil,
	}

	logJSON, _ := json.Marshal(logEntry)
	log.Printf("VERIFICATION_LOG: %s", string(logJSON))
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
		// Handle incoming message
		if err := conn.WriteMessage(messageType, msg); err != nil {
			break
		}
	}
}