package models

import (
	"database/sql/driver"
	"encoding/json"
	"time"
)

// VerificationStatus represents the status of a verification
type VerificationStatus string

const (
	StatusPending    VerificationStatus = "pending"
	StatusProcessing VerificationStatus = "processing"
	StatusCompleted  VerificationStatus = "completed"
	StatusFailed     VerificationStatus = "failed"
)

// VerificationRequest represents a verification request stored in the database
type VerificationRequest struct {
	ID            string             `json:"id"`
	Email         string             `json:"email"`
	LicenseNumber string             `json:"license_number"` // Encrypted in production
	InputMethod   string             `json:"input_method"`
	Status        VerificationStatus `json:"status"`
	CreatedAt     time.Time          `json:"created_at"`
	UpdatedAt     time.Time          `json:"updated_at"`
}

// VerificationResult represents the result of a verification
type VerificationResult struct {
	ID                    string    `json:"id"`
	VerificationRequestID string    `json:"verification_request_id"`
	Approved              bool      `json:"approved"`
	ResponseData          JSONB     `json:"response_data"`
	ProviderStatus        string    `json:"provider_status"`
	CreatedAt             time.Time `json:"created_at"`
	UpdatedAt             time.Time `json:"updated_at"`
}

// VerificationErrorLog represents an error log for a failed verification
type VerificationErrorLog struct {
	ID                    string    `json:"id"`
	VerificationRequestID string    `json:"verification_request_id"`
	ErrorType             string    `json:"error_type"`
	ErrorMessage          string    `json:"error_message"`
	ErrorDetails          JSONB     `json:"error_details"`
	Retryable             bool      `json:"retryable"`
	CreatedAt             time.Time `json:"created_at"`
}

// JSONB represents a JSONB field for PostgreSQL
type JSONB map[string]interface{}

// Value implements the driver.Valuer interface for JSONB
func (j JSONB) Value() (driver.Value, error) {
	if j == nil {
		return nil, nil
	}
	return json.Marshal(j)
}

// Scan implements the sql.Scanner interface for JSONB
func (j *JSONB) Scan(value interface{}) error {
	if value == nil {
		*j = nil
		return nil
	}

	bytes, ok := value.([]byte)
	if !ok {
		return nil
	}

	var result map[string]interface{}
	if err := json.Unmarshal(bytes, &result); err != nil {
		return err
	}

	*j = result
	return nil
}
