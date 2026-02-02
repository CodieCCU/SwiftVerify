package middleware

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/CodieCCU/SwiftVerify/internal/errors"
	"github.com/CodieCCU/SwiftVerify/pkg/dto"
)

// ValidateVerificationRequest validates the verification request
func ValidateVerificationRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			next.ServeHTTP(w, r)
			return
		}

		var req dto.VerificationRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			sendErrorResponse(w, errors.NewValidationError("Invalid request body", nil), r)
			return
		}

		// Validate email
		if !isValidEmail(req.Email) {
			sendErrorResponse(w, errors.NewValidationError("Invalid email address", map[string]interface{}{
				"field": "email",
			}), r)
			return
		}

		// Validate license number (only for manual input)
		if req.InputMethod == "manual" && strings.TrimSpace(req.LicenseNumber) == "" {
			sendErrorResponse(w, errors.NewValidationError("License number is required", map[string]interface{}{
				"field": "license_number",
			}), r)
			return
		}

		// Validate input method
		if req.InputMethod != "manual" && req.InputMethod != "scan" {
			sendErrorResponse(w, errors.NewValidationError("Invalid input method", map[string]interface{}{
				"field":          "input_method",
				"allowed_values": []string{"manual", "scan"},
			}), r)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// isValidEmail checks if an email address is valid
func isValidEmail(email string) bool {
	email = strings.TrimSpace(email)
	if email == "" {
		return false
	}

	// Basic email validation
	atIndex := -1
	for i, c := range email {
		if c == '@' {
			if atIndex != -1 {
				return false // Multiple @ symbols
			}
			atIndex = i
		}
	}

	if atIndex <= 0 || atIndex >= len(email)-1 {
		return false
	}

	// Check for domain
	domain := email[atIndex+1:]
	dotIndex := -1
	for i, c := range domain {
		if c == '.' {
			dotIndex = i
			break
		}
	}

	return dotIndex > 0 && dotIndex < len(domain)-1
}

// sendErrorResponse sends a standardized error response
func sendErrorResponse(w http.ResponseWriter, appErr *errors.AppError, r *http.Request) {
	requestID := r.Context().Value(RequestIDKey)
	
	response := dto.ErrorResponse{
		Error: dto.ErrorDetail{
			Type:    string(appErr.Type),
			Message: appErr.Message,
			Details: appErr.Details,
		},
		Timestamp: time.Now(),
	}

	if requestID != nil {
		response.RequestID = requestID.(string)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(appErr.StatusCode)
	json.NewEncoder(w).Encode(response)
}
