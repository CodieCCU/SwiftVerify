package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"time"
)

// EquifaxResponse represents the response from Equifax Work Number API
type EquifaxResponse struct {
	Status       string                 `json:"status"`        // "approved", "denied", "data_freeze", "error"
	DataFreeze   bool                   `json:"data_freeze"`   // true if data freeze is detected
	ErrorType    string                 `json:"error_type"`    // e.g., "data_freeze", "server_timeout"
	ErrorMessage string                 `json:"error_message"` // Detailed error message
	RawData      map[string]interface{} `json:"raw_data"`      // Full API response
}

// EquifaxService handles interactions with Equifax Work Number API
type EquifaxService struct {
	apiKey    string
	apiURL    string
	timeout   time.Duration
}

// NewEquifaxService creates a new Equifax service instance
func NewEquifaxService(apiKey, apiURL string) *EquifaxService {
	return &EquifaxService{
		apiKey:    apiKey,
		apiURL:    apiURL,
		timeout:   30 * time.Second,
	}
}

// VerifyTenant verifies a tenant's information through Equifax Work Number
func (s *EquifaxService) VerifyTenant(email, licenseNumber string) (*EquifaxResponse, error) {
	// In production, this would make an actual API call to Equifax
	// For now, we'll simulate the response with mock data
	
	// Simulate API processing delay
	time.Sleep(2 * time.Second)
	
	// Simulate different scenarios based on email/license patterns for testing
	response := &EquifaxResponse{
		RawData: make(map[string]interface{}),
	}
	
	// Check for data freeze scenario (simulate with specific email pattern)
	if containsDataFreezePattern(email) {
		response.Status = "data_freeze"
		response.DataFreeze = true
		response.ErrorType = "data_freeze"
		response.ErrorMessage = "A Data Freeze has been detected on your Equifax Work Number record. Please contact Equifax to remove the freeze."
		response.RawData["freeze_date"] = time.Now().Format(time.RFC3339)
		response.RawData["contact_info"] = getEquifaxContactInfo()
		return response, nil
	}
	
	// Check for other error scenarios
	if containsErrorPattern(email) {
		response.Status = "error"
		response.DataFreeze = false
		response.ErrorType = "server_timeout"
		response.ErrorMessage = "The verification service encountered a timeout. Please try again."
		return response, errors.New("server timeout")
	}
	
	// Normal verification flow (70% approval rate for demo)
	if shouldApprove(email, licenseNumber) {
		response.Status = "approved"
		response.DataFreeze = false
		response.RawData["verified_at"] = time.Now().Format(time.RFC3339)
		response.RawData["verification_id"] = generateVerificationID()
		return response, nil
	}
	
	// Denied
	response.Status = "denied"
	response.DataFreeze = false
	response.ErrorMessage = "Unable to verify the provided information. Please check your details and try again."
	return response, nil
}

// GetDataFreezeInstructions returns detailed instructions for removing a data freeze
func (s *EquifaxService) GetDataFreezeInstructions() map[string]interface{} {
	return map[string]interface{}{
		"title": "How to Remove Your Data Freeze",
		"steps": []string{
			"Contact Equifax's Work Number customer service",
			"Verify your identity with the representative",
			"Request the removal of the Data Freeze on your employment records",
			"Wait 24-48 hours for the freeze to be fully removed",
			"Return to SwiftVerify and retry your verification",
		},
		"contact": getEquifaxContactInfo(),
		"estimated_time": "24-48 hours",
	}
}

// Helper functions

func getEquifaxContactInfo() map[string]interface{} {
	return map[string]interface{}{
		"phone":        "1-800-367-2884",
		"hours":        "Monday-Friday, 8AM-8PM EST",
		"website":      "https://www.theworknumber.com/freeze",
		"support_email": "support@theworknumber.com",
		"form_link":    "https://www.theworknumber.com/freeze/remove-request",
	}
}

func containsDataFreezePattern(email string) bool {
	// Simulate data freeze for emails containing "freeze" for testing
	return len(email) > 0 && (email[0] == 'f' || email[0] == 'F')
}

func containsErrorPattern(email string) bool {
	// Simulate errors for emails containing "error" for testing
	return len(email) > 0 && (email[0] == 'e' || email[0] == 'E')
}

func shouldApprove(email, licenseNumber string) bool {
	// Simple hash-based approval simulation (deterministic for testing)
	sum := 0
	for _, c := range email + licenseNumber {
		sum += int(c)
	}
	return sum%10 >= 3 // 70% approval rate
}

func generateVerificationID() string {
	return fmt.Sprintf("VRF-%d", time.Now().Unix())
}

// ToJSON converts the response to JSON
func (r *EquifaxResponse) ToJSON() ([]byte, error) {
	return json.Marshal(r)
}
