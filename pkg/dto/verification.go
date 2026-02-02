package dto

import "time"

// VerificationRequest represents a request to verify a driver's license
type VerificationRequest struct {
	Email         string `json:"email"`
	LicenseNumber string `json:"license_number"`
	InputMethod   string `json:"input_method"` // "manual" or "scan"
}

// VerificationResponse represents the response from a verification request
type VerificationResponse struct {
	ID        string    `json:"id"`
	Status    string    `json:"status"` // "pending", "processing", "completed", "failed"
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// VerificationStatusResponse represents the detailed status of a verification
type VerificationStatusResponse struct {
	ID        string                 `json:"id"`
	Status    string                 `json:"status"`
	Email     string                 `json:"email"`
	Approved  bool                   `json:"approved"`
	Result    map[string]interface{} `json:"result,omitempty"`
	Error     *ErrorDetail           `json:"error,omitempty"`
	CreatedAt time.Time              `json:"created_at"`
	UpdatedAt time.Time              `json:"updated_at"`
}

// ErrorResponse represents a standardized error response
type ErrorResponse struct {
	Error     ErrorDetail `json:"error"`
	RequestID string      `json:"request_id,omitempty"`
	Timestamp time.Time   `json:"timestamp"`
}

// ErrorDetail represents detailed error information
type ErrorDetail struct {
	Type    string                 `json:"type"`
	Message string                 `json:"message"`
	Details map[string]interface{} `json:"details,omitempty"`
}

// RetryRequest represents a request to retry a verification
type RetryRequest struct {
	Reason string `json:"reason,omitempty"`
}

// RetryResponse represents the response from a retry request
type RetryResponse struct {
	ID      string `json:"id"`
	Status  string `json:"status"`
	Message string `json:"message"`
}

// HealthCheckResponse represents the health check response
type HealthCheckResponse struct {
	Status    string    `json:"status"`
	Timestamp time.Time `json:"timestamp"`
	Version   string    `json:"version"`
}
