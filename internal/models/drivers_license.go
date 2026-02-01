package models

import (
	"time"
)

// DriversLicense represents a driver's license record with lifecycle management
type DriversLicense struct {
	ID                   int       `json:"id"`
	RecordReferenceID    string    `json:"record_reference_id"`
	UserID               *int      `json:"user_id,omitempty"`
	Email                string    `json:"email"`
	LicenseNumberEncrypted string  `json:"-"` // Not exposed in JSON
	LicenseDataEncrypted *string   `json:"-"` // Not exposed in JSON
	CreatedAt            time.Time `json:"created_at"`
	ExpirationDate       time.Time `json:"expiration_date"`
	DeletedAt            *time.Time `json:"deleted_at,omitempty"`
	EncryptionKeyID      *string   `json:"-"` // Not exposed in JSON
}

// AuditLog represents an immutable audit log entry
type AuditLog struct {
	ID                  int       `json:"id"`
	RecordReferenceID   string    `json:"record_reference_id"`
	Action              string    `json:"action"` // CREATED, TAGGED, DELETED, NOTIFICATION_SENT
	Timestamp           time.Time `json:"timestamp"`
	Details             *string   `json:"details,omitempty"` // JSON string
	UserAgent           *string   `json:"user_agent,omitempty"`
	IPAddress           *string   `json:"ip_address,omitempty"`
}

// DeletionNotification represents a notification sent after deletion
type DeletionNotification struct {
	ID                  int       `json:"id"`
	RecordReferenceID   string    `json:"record_reference_id"`
	Email               string    `json:"email"`
	NotificationSentAt  time.Time `json:"notification_sent_at"`
	NotificationStatus  string    `json:"notification_status"` // PENDING, SENT, FAILED
	RetryCount          int       `json:"retry_count"`
	ErrorMessage        *string   `json:"error_message,omitempty"`
}

// DeletionJobLog represents a deletion job execution log
type DeletionJobLog struct {
	ID                 int       `json:"id"`
	JobExecutionTime   time.Time `json:"job_execution_time"`
	RecordsDeleted     int       `json:"records_deleted"`
	RecordsFailed      int       `json:"records_failed"`
	ExecutionStatus    string    `json:"execution_status"` // COMPLETED, FAILED, PARTIAL
	ErrorDetails       *string   `json:"error_details,omitempty"`
}

// DriversLicenseRequest represents the API request for creating a driver's license record
type DriversLicenseRequest struct {
	Email          string `json:"email" validate:"required,email"`
	LicenseNumber  string `json:"license_number" validate:"required"`
	LicenseData    string `json:"license_data,omitempty"`
	UserID         *int   `json:"user_id,omitempty"`
}

// DriversLicenseResponse represents the API response
type DriversLicenseResponse struct {
	RecordReferenceID string    `json:"record_reference_id"`
	Email             string    `json:"email"`
	CreatedAt         time.Time `json:"created_at"`
	ExpirationDate    time.Time `json:"expiration_date"`
	Message           string    `json:"message"`
}

// DeletionReport represents a summary report of deletions
type DeletionReport struct {
	Date               string `json:"date"`
	TotalDeletions     int    `json:"total_deletions"`
	SuccessfulDeletions int   `json:"successful_deletions"`
	FailedDeletions    int    `json:"failed_deletions"`
	NotificationsSent  int    `json:"notifications_sent"`
	NotificationsFailed int   `json:"notifications_failed"`
}
