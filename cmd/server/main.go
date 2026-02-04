package main

import (
	"fmt"
	"net/http"
	"github.com/gorilla/websocket"
	"github.com/CodieCCU/SwiftVerify/cmd/server/handlers"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func main() {
	// WebSocket endpoint for real-time verification
	http.HandleFunc("/ws", handleWebSocket)
	
	// ========================================
	// NO CREDIT CHECK API ENDPOINTS
	// ========================================
	
	// Landlord Agreement Endpoints
	http.HandleFunc("/api/landlord/agreement/accept", handlers.AcceptLandlordAgreement)
	http.HandleFunc("/api/landlord/agreement/status", handlers.GetLandlordAgreementStatus)
	
	// Tenant Application Endpoints (NO CREDIT CHECK)
	http.HandleFunc("/api/applications", handleApplications)
	http.HandleFunc("/api/applications/decision", handlers.MakeDecision)
	
	// Verification Endpoints (NO CREDIT CHECK)
	http.HandleFunc("/api/verification/identity", handlers.VerifyIdentity)
	http.HandleFunc("/api/verification/employment", handlers.VerifyEmployment)
	http.HandleFunc("/api/verification/background-check", handlers.RequestBackgroundCheck)
	
	// ========================================
	// PROHIBITED ENDPOINTS (Will never exist)
	// ========================================
	// /api/verification/credit-check - PROHIBITED
	// /api/landlord/credit-policies - PROHIBITED
	// Any endpoint containing "credit" - PROHIBITED
	
	fmt.Println("SwiftVerify NO CREDIT CHECK Server")
	fmt.Println("===================================")
	fmt.Println("Starting server on :8080")
	fmt.Println("API Endpoints:")
	fmt.Println("  POST /api/landlord/agreement/accept")
	fmt.Println("  GET  /api/landlord/agreement/status")
	fmt.Println("  POST /api/applications")
	fmt.Println("  GET  /api/applications")
	fmt.Println("  POST /api/applications/decision")
	fmt.Println("  POST /api/verification/identity")
	fmt.Println("  POST /api/verification/employment")
	fmt.Println("  POST /api/verification/background-check")
	fmt.Println("")
	fmt.Println("⚠️  NO CREDIT CHECK - Credit endpoints are PROHIBITED")
	
	http.ListenAndServe(":8080", nil)
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

// handleApplications routes to appropriate handler based on method
func handleApplications(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		handlers.CreateTenantApplication(w, r)
	case http.MethodGet:
		handlers.GetApplications(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}