package handlers

import (
	"encoding/json"
	"net/http"
	"time"
)

// LandlordAgreementRequest represents the landlord agreement acceptance request
type LandlordAgreementRequest struct {
	LandlordName               string            `json:"landlordName"`
	LandlordEmail              string            `json:"landlordEmail"`
	PropertyManagementCompany  string            `json:"propertyManagementCompany"`
	Acknowledgments            map[string]bool   `json:"acknowledgments"`
	LegalAcknowledgment        bool              `json:"legalAcknowledgment"`
	Signature                  string            `json:"signature"`
	Timestamp                  string            `json:"timestamp"`
}

// LandlordAgreementResponse represents the response after accepting the agreement
type LandlordAgreementResponse struct {
	Success       bool      `json:"success"`
	Message       string    `json:"message"`
	AgreementID   int       `json:"agreementId,omitempty"`
	AcceptedAt    time.Time `json:"acceptedAt,omitempty"`
}

// AcceptLandlordAgreement handles POST /api/landlord/agreement/accept
// Records landlord acceptance of NO CREDIT CHECK agreement
func AcceptLandlordAgreement(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req LandlordAgreementRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate all required acknowledgments are true
	requiredAcks := []string{
		"readAndUnderstand",
		"noCreditCheckSystem",
		"withoutCreditEvaluation",
		"willNotConductCreditChecks",
		"beforeAndAfter",
		"accountTermination",
		"rentalDecisionCriteria",
		"fairHousingCompliance",
	}

	for _, ack := range requiredAcks {
		if !req.Acknowledgments[ack] {
			http.Error(w, "All acknowledgments must be accepted", http.StatusBadRequest)
			return
		}
	}

	if !req.LegalAcknowledgment {
		http.Error(w, "Legal acknowledgment is required", http.StatusBadRequest)
		return
	}

	if req.Signature == "" {
		http.Error(w, "Signature is required", http.StatusBadRequest)
		return
	}

	// In a real implementation, this would:
	// 1. Insert into landlord_agreements table
	// 2. Log to compliance_audit_log
	// 3. Capture IP address from request
	// 4. Return agreement ID

	// For now, return success response
	response := LandlordAgreementResponse{
		Success:     true,
		Message:     "Agreement accepted successfully",
		AgreementID: 1, // Would be from database
		AcceptedAt:  time.Now(),
	}

	// Log compliance event
	LogComplianceEvent("landlord_agreement_accepted", req.LandlordEmail, "INFO", 
		map[string]interface{}{
			"landlord_name": req.LandlordName,
			"signature": req.Signature,
		})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// GetLandlordAgreementStatus handles GET /api/landlord/agreement/status
// Verifies that landlord has signed the agreement before allowing screening
func GetLandlordAgreementStatus(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// In a real implementation, this would:
	// 1. Get landlord ID from session/token
	// 2. Query landlord_agreements table
	// 3. Return agreement status and details

	// For now, return mock response
	response := map[string]interface{}{
		"hasSigned":       true,
		"agreementVersion": "1.0",
		"signedAt":        time.Now().Add(-24 * time.Hour),
		"canAccessPlatform": true,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// LogComplianceEvent logs events to the compliance audit trail
func LogComplianceEvent(eventType, landlordEmail, severity string, data map[string]interface{}) {
	// In a real implementation, this would:
	// 1. Insert into compliance_audit_log table
	// 2. Include IP address, user agent, timestamp
	// 3. Alert on CRITICAL severity events
	
	// For now, just log to console
	println("COMPLIANCE EVENT:", eventType, "|", landlordEmail, "|", severity)
}
