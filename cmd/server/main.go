package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/rs/cors"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type LicenseVerificationRequest struct {
	LicenseNumber string `json:"licenseNumber"`
	Method        string `json:"method"`
}

type VerificationResponse struct {
	Approved                  bool    `json:"approved"`
	LicenseNumber             string  `json:"licenseNumber"`
	PropertyName              string  `json:"propertyName"`
	UnitNumber                string  `json:"unitNumber"`
	TenantIncome              float64 `json:"tenantIncome"`
	ApartmentCost             float64 `json:"apartmentCost"`
	GapWaiverNeeded           bool    `json:"gapWaiverNeeded"`
	AdditionalFundingProvided bool    `json:"additionalFundingProvided"`
	FundingAmount             float64 `json:"fundingAmount"`
	Message                   string  `json:"message"`
}

func main() {
	r := mux.NewRouter()

	// API routes
	r.HandleFunc("/api/verify-license", handleVerifyLicense).Methods("POST")
	r.HandleFunc("/ws", handleWebSocket)

	// CORS middleware
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	log.Println("Server starting on :8080")
	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatal(err)
	}
}

func handleVerifyLicense(w http.ResponseWriter, r *http.Request) {
	var licenseNumber string
	var method string

	contentType := r.Header.Get("Content-Type")

	if contentType == "application/json" {
		// Manual entry - JSON payload
		var req LicenseVerificationRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
			return
		}
		licenseNumber = req.LicenseNumber
		method = req.Method
	} else {
		// File upload - multipart form
		if err := r.ParseMultipartForm(10 << 20); err != nil { // 10MB max
			http.Error(w, `{"error": "Failed to parse form"}`, http.StatusBadRequest)
			return
		}

		file, header, err := r.FormFile("license")
		if err != nil {
			http.Error(w, `{"error": "No file uploaded"}`, http.StatusBadRequest)
			return
		}
		defer file.Close()

		// Read file (in real implementation, would use OCR/ML for scanning)
		_, err = io.ReadAll(file)
		if err != nil {
			http.Error(w, `{"error": "Failed to read file"}`, http.StatusInternalServerError)
			return
		}

		log.Printf("Received license scan: %s", header.Filename)
		
		// Mock: Extract license number from filename or use random
		licenseNumber = fmt.Sprintf("DL-%d", rand.Intn(1000000))
		method = r.FormValue("method")
	}

	// Validate license number
	if licenseNumber == "" {
		http.Error(w, `{"error": "License number is required"}`, http.StatusBadRequest)
		return
	}

	// Mock verification logic
	response := performVerification(licenseNumber, method)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func performVerification(licenseNumber string, method string) VerificationResponse {
	// Mock property data
	properties := []string{"Boise Heights Apartments", "River View Residences", "Downtown Lofts", "Garden Court Estates"}
	property := properties[rand.Intn(len(properties))]
	
	// Generate mock financial data
	tenantIncome := float64(2500 + rand.Intn(5000))
	apartmentCost := float64(800 + rand.Intn(1200))
	
	// Calculate if income meets typical 3x rent requirement
	incomeToRentRatio := tenantIncome / apartmentCost
	approved := incomeToRentRatio >= 2.5 // Slightly lower than typical 3x for SwiftVerify assistance
	
	// Determine if gap waiver or additional funding is needed
	gapWaiver := false
	additionalFunding := false
	fundingAmount := 0.0
	
	if incomeToRentRatio < 3.0 && incomeToRentRatio >= 2.5 {
		gapWaiver = true
	} else if incomeToRentRatio < 2.5 && incomeToRentRatio >= 2.0 {
		gapWaiver = true
		additionalFunding = true
		fundingAmount = (apartmentCost * 3.0) - tenantIncome
	}

	message := ""
	if approved {
		if gapWaiver {
			message = "Your application has been approved with SwiftVerify assistance to cover the income gap."
		} else {
			message = "Congratulations! Your application has been approved."
		}
	} else {
		message = "Unfortunately, your application does not meet the minimum requirements at this time."
	}

	return VerificationResponse{
		Approved:                  approved,
		LicenseNumber:             licenseNumber,
		PropertyName:              property,
		UnitNumber:                fmt.Sprintf("%d%c", 100+rand.Intn(400), 'A'+rune(rand.Intn(4))),
		TenantIncome:              tenantIncome,
		ApartmentCost:             apartmentCost,
		GapWaiverNeeded:           gapWaiver,
		AdditionalFundingProvided: additionalFunding,
		FundingAmount:             fundingAmount,
		Message:                   message,
	}
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