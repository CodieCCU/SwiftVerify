package logger

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"time"

	"github.com/CodieCCU/SwiftVerify/pkg/models"
)

// ExportToCSV exports audit logs to CSV format for analysis
func ExportToCSV(logs []models.AuditLog, outputPath string) error {
	file, err := os.Create(outputPath)
	if err != nil {
		return fmt.Errorf("failed to create CSV file: %w", err)
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	// Write header
	header := []string{
		"ID",
		"Log ID",
		"Timestamp (ISO 8601)",
		"Category",
		"Action",
		"Severity",
		"User ID",
		"Session ID",
		"IP Address",
		"Source",
		"Error Details",
		"Hash",
		"Previous Hash",
	}
	if err := writer.Write(header); err != nil {
		return fmt.Errorf("failed to write CSV header: %w", err)
	}

	// Write log entries
	for _, log := range logs {
		userID := ""
		if log.UserID != nil {
			userID = fmt.Sprintf("%d", *log.UserID)
		}

		record := []string{
			fmt.Sprintf("%d", log.ID),
			log.LogID,
			log.Timestamp.Format(time.RFC3339),
			string(log.Category),
			log.Action,
			string(log.Severity),
			userID,
			log.SessionID,
			log.IPAddress,
			string(log.Source),
			log.ErrorDetails,
			log.Hash,
			log.PreviousHash,
		}

		if err := writer.Write(record); err != nil {
			return fmt.Errorf("failed to write CSV record: %w", err)
		}
	}

	return nil
}

// ExportToJSONL exports audit logs to JSONL format
func ExportToJSONL(logs []models.AuditLog, outputPath string) error {
	file, err := os.Create(outputPath)
	if err != nil {
		return fmt.Errorf("failed to create JSONL file: %w", err)
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	for _, log := range logs {
		if err := encoder.Encode(log); err != nil {
			return fmt.Errorf("failed to encode log entry: %w", err)
		}
	}

	return nil
}

// ReadLogsFromFile reads audit logs from a JSONL file
func ReadLogsFromFile(filePath string) ([]models.AuditLog, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to open log file: %w", err)
	}
	defer file.Close()

	var logs []models.AuditLog
	decoder := json.NewDecoder(file)

	for {
		var log models.AuditLog
		if err := decoder.Decode(&log); err == io.EOF {
			break
		} else if err != nil {
			return nil, fmt.Errorf("failed to decode log entry: %w", err)
		}
		logs = append(logs, log)
	}

	return logs, nil
}

// VerifyLogIntegrity verifies the hash chain of log entries
func VerifyLogIntegrity(logs []models.AuditLog) (bool, error) {
	if len(logs) == 0 {
		return true, nil
	}

	logger, err := NewLogger("/tmp/verify")
	if err != nil {
		return false, err
	}
	defer logger.Close()

	previousHash := ""
	for i, log := range logs {
		// Verify previous hash matches
		if log.PreviousHash != previousHash {
			return false, fmt.Errorf("hash chain broken at index %d: expected previous hash %s, got %s",
				i, previousHash, log.PreviousHash)
		}

		// Recalculate and verify hash
		calculatedHash, err := logger.calculateHash(log)
		if err != nil {
			return false, fmt.Errorf("failed to calculate hash at index %d: %w", i, err)
		}

		if calculatedHash != log.Hash {
			return false, fmt.Errorf("hash mismatch at index %d: expected %s, got %s",
				i, log.Hash, calculatedHash)
		}

		previousHash = log.Hash
	}

	return true, nil
}

// FilterLogs filters logs by category, severity, and time range
func FilterLogs(logs []models.AuditLog, category models.LogCategory, severity models.LogSeverity, startTime, endTime time.Time) []models.AuditLog {
	var filtered []models.AuditLog

	for _, log := range logs {
		// Check category
		if category != "" && log.Category != category {
			continue
		}

		// Check severity
		if severity != "" && log.Severity != severity {
			continue
		}

		// Check time range
		if !startTime.IsZero() && log.Timestamp.Before(startTime) {
			continue
		}
		if !endTime.IsZero() && log.Timestamp.After(endTime) {
			continue
		}

		filtered = append(filtered, log)
	}

	return filtered
}
