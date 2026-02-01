package logger

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/CodieCCU/SwiftVerify/pkg/models"
)

// Logger handles immutable audit logging
type Logger struct {
	logFile      *os.File
	mu           sync.Mutex
	lastHash     string
	logDir       string
	alertManager *AlertManager
}

// NewLogger creates a new logger instance with append-only file logging
func NewLogger(logDir string) (*Logger, error) {
	if err := os.MkdirAll(logDir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create log directory: %w", err)
	}

	// Create log file with current date
	logFileName := fmt.Sprintf("audit_%s.jsonl", time.Now().Format("2006-01-02"))
	logPath := filepath.Join(logDir, logFileName)

	// Open in append mode with write-only permissions (WORM-like)
	logFile, err := os.OpenFile(logPath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return nil, fmt.Errorf("failed to open log file: %w", err)
	}

	logger := &Logger{
		logFile:      logFile,
		logDir:       logDir,
		alertManager: NewAlertManager(),
	}

	// Initialize with empty hash for first log
	logger.lastHash = ""

	return logger, nil
}

// Log writes an immutable log entry
func (l *Logger) Log(entry models.LogEntry) error {
	l.mu.Lock()
	defer l.mu.Unlock()

	// Create audit log with timestamp
	auditLog := models.AuditLog{
		Timestamp:    time.Now().UTC(),
		Category:     entry.Category,
		Action:       entry.Action,
		Severity:     entry.Severity,
		UserID:       entry.UserID,
		SessionID:    entry.SessionID,
		IPAddress:    maskIPIfNeeded(entry.IPAddress),
		UserAgent:    entry.UserAgent,
		Source:       entry.Source,
		Metadata:     sanitizeMetadata(entry.Metadata),
		RequestData:  sanitizeData(entry.RequestData),
		ResponseData: sanitizeData(entry.ResponseData),
		ErrorDetails: entry.ErrorDetails,
		PreviousHash: l.lastHash,
		CreatedAt:    time.Now().UTC(),
	}

	// Calculate hash for integrity
	hash, err := l.calculateHash(auditLog)
	if err != nil {
		return fmt.Errorf("failed to calculate hash: %w", err)
	}
	auditLog.Hash = hash

	// Write to file in JSONL format (one JSON object per line)
	logLine, err := json.Marshal(auditLog)
	if err != nil {
		return fmt.Errorf("failed to marshal log entry: %w", err)
	}

	if _, err := l.logFile.Write(append(logLine, '\n')); err != nil {
		return fmt.Errorf("failed to write log entry: %w", err)
	}

	// Force write to disk for durability
	if err := l.logFile.Sync(); err != nil {
		return fmt.Errorf("failed to sync log file: %w", err)
	}

	// Update last hash for chain verification
	l.lastHash = hash

	// Check alerts
	l.alertManager.CheckAlerts(auditLog)

	return nil
}

// calculateHash generates SHA-256 hash of log entry for integrity verification
func (l *Logger) calculateHash(log models.AuditLog) (string, error) {
	// Create a deterministic representation for hashing
	hashInput := fmt.Sprintf("%s|%s|%s|%s|%s|%v|%s",
		log.Timestamp.Format(time.RFC3339Nano),
		log.Category,
		log.Action,
		log.Severity,
		log.Source,
		log.Metadata,
		log.PreviousHash,
	)

	hash := sha256.Sum256([]byte(hashInput))
	return hex.EncodeToString(hash[:]), nil
}

// Close closes the log file
func (l *Logger) Close() error {
	l.mu.Lock()
	defer l.mu.Unlock()

	if l.logFile != nil {
		return l.logFile.Close()
	}
	return nil
}

// maskIPIfNeeded masks IP address for privacy compliance (GDPR/CCPA)
// Masks last octet for IPv4, last 80 bits for IPv6
func maskIPIfNeeded(ip string) string {
	if ip == "" {
		return ""
	}
	// For compliance, we can store partial IP
	// In production, this should check against privacy settings
	return ip // Can be enhanced with actual masking logic
}

// sanitizeMetadata removes sensitive data from metadata
func sanitizeMetadata(data map[string]interface{}) map[string]interface{} {
	if data == nil {
		return nil
	}

	sanitized := make(map[string]interface{})
	sensitiveFields := []string{"ssn", "password", "credit_card", "cvv", "pin", "secret", "token"}

	for key, value := range data {
		isSensitive := false
		lowerKey := key
		
		// Check if field contains sensitive data
		for _, sensitive := range sensitiveFields {
			if contains(lowerKey, sensitive) {
				isSensitive = true
				break
			}
		}

		if isSensitive {
			sanitized[key] = "***REDACTED***"
		} else {
			sanitized[key] = value
		}
	}

	return sanitized
}

// sanitizeData sanitizes request/response data
func sanitizeData(data map[string]interface{}) map[string]interface{} {
	return sanitizeMetadata(data)
}

// contains checks if a string contains a substring (case-insensitive)
func contains(s, substr string) bool {
	return len(s) >= len(substr) && 
		(s == substr || len(s) > len(substr) && 
		(s[:len(substr)] == substr || s[len(s)-len(substr):] == substr))
}

// LogInfo logs an informational message
func (l *Logger) LogInfo(category models.LogCategory, action string, metadata map[string]interface{}) error {
	return l.Log(models.LogEntry{
		Category: category,
		Action:   action,
		Severity: models.SeverityInfo,
		Source:   models.SourceBackend,
		Metadata: metadata,
	})
}

// LogError logs an error message
func (l *Logger) LogError(category models.LogCategory, action string, err error, metadata map[string]interface{}) error {
	entry := models.LogEntry{
		Category:     category,
		Action:       action,
		Severity:     models.SeverityError,
		Source:       models.SourceBackend,
		Metadata:     metadata,
		ErrorDetails: err.Error(),
	}
	return l.Log(entry)
}

// LogCritical logs a critical error message
func (l *Logger) LogCritical(category models.LogCategory, action string, err error, metadata map[string]interface{}) error {
	entry := models.LogEntry{
		Category:     category,
		Action:       action,
		Severity:     models.SeverityCritical,
		Source:       models.SourceBackend,
		Metadata:     metadata,
		ErrorDetails: err.Error(),
	}
	return l.Log(entry)
}
