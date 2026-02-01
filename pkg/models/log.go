package models

import (
	"time"
)

// LogCategory represents different types of log entries
type LogCategory string

const (
	CategoryAuthentication      LogCategory = "Authentication"
	CategoryDriversLicenseCheck LogCategory = "DriversLicenseCheck"
	CategoryAPICall             LogCategory = "APICall"
	CategoryDatabaseAction      LogCategory = "DatabaseAction"
	CategoryServerEvent         LogCategory = "ServerEvent"
	CategoryUserAction          LogCategory = "UserAction"
	CategorySystemEvent         LogCategory = "SystemEvent"
)

// LogSeverity represents the severity level of a log entry
type LogSeverity string

const (
	SeverityDebug    LogSeverity = "DEBUG"
	SeverityInfo     LogSeverity = "INFO"
	SeverityWarn     LogSeverity = "WARN"
	SeverityError    LogSeverity = "ERROR"
	SeverityCritical LogSeverity = "CRITICAL"
)

// LogSource indicates where the log originated from
type LogSource string

const (
	SourceFrontend LogSource = "frontend"
	SourceBackend  LogSource = "backend"
	SourceSystem   LogSource = "system"
)

// AuditLog represents an immutable log entry
type AuditLog struct {
	ID           int64                  `json:"id"`
	LogID        string                 `json:"log_id"`
	Timestamp    time.Time              `json:"timestamp"`
	Category     LogCategory            `json:"category"`
	Action       string                 `json:"action"`
	Severity     LogSeverity            `json:"severity"`
	UserID       *int                   `json:"user_id,omitempty"`
	SessionID    string                 `json:"session_id,omitempty"`
	IPAddress    string                 `json:"ip_address,omitempty"`
	UserAgent    string                 `json:"user_agent,omitempty"`
	Source       LogSource              `json:"source"`
	Metadata     map[string]interface{} `json:"metadata,omitempty"`
	RequestData  map[string]interface{} `json:"request_data,omitempty"`
	ResponseData map[string]interface{} `json:"response_data,omitempty"`
	ErrorDetails string                 `json:"error_details,omitempty"`
	Hash         string                 `json:"hash"`
	PreviousHash string                 `json:"previous_hash,omitempty"`
	CreatedAt    time.Time              `json:"created_at"`
}

// LogEntry is used for creating new log entries
type LogEntry struct {
	Category     LogCategory            `json:"category"`
	Action       string                 `json:"action"`
	Severity     LogSeverity            `json:"severity"`
	UserID       *int                   `json:"user_id,omitempty"`
	SessionID    string                 `json:"session_id,omitempty"`
	IPAddress    string                 `json:"ip_address,omitempty"`
	UserAgent    string                 `json:"user_agent,omitempty"`
	Source       LogSource              `json:"source"`
	Metadata     map[string]interface{} `json:"metadata,omitempty"`
	RequestData  map[string]interface{} `json:"request_data,omitempty"`
	ResponseData map[string]interface{} `json:"response_data,omitempty"`
	ErrorDetails string                 `json:"error_details,omitempty"`
}

// AlertConfiguration represents an alert rule
type AlertConfiguration struct {
	ID                  int         `json:"id"`
	Name                string      `json:"name"`
	Category            LogCategory `json:"category,omitempty"`
	Severity            LogSeverity `json:"severity,omitempty"`
	Pattern             string      `json:"pattern,omitempty"`
	NotificationEmail   string      `json:"notification_email,omitempty"`
	NotificationWebhook string      `json:"notification_webhook,omitempty"`
	IsActive            bool        `json:"is_active"`
	CreatedAt           time.Time   `json:"created_at"`
	UpdatedAt           time.Time   `json:"updated_at"`
}
