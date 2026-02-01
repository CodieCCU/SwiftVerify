package database

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	_ "github.com/lib/pq"
	"github.com/CodieCCU/SwiftVerify/internal/models"
)

// DB wraps the database connection
type DB struct {
	*sql.DB
}

// NewDB creates a new database connection
func NewDB(connectionString string) (*DB, error) {
	db, err := sql.Open("postgres", connectionString)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	return &DB{db}, nil
}

// CreateDriversLicense inserts a new driver's license record
func (db *DB) CreateDriversLicense(dl *models.DriversLicense) error {
	query := `
		INSERT INTO drivers_licenses (
			record_reference_id, user_id, email, 
			license_number_encrypted, license_data_encrypted, 
			encryption_key_id, created_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, expiration_date
	`
	
	return db.QueryRow(
		query,
		dl.RecordReferenceID,
		dl.UserID,
		dl.Email,
		dl.LicenseNumberEncrypted,
		dl.LicenseDataEncrypted,
		dl.EncryptionKeyID,
		dl.CreatedAt,
	).Scan(&dl.ID, &dl.ExpirationDate)
}

// CreateAuditLog inserts an immutable audit log entry
func (db *DB) CreateAuditLog(log *models.AuditLog) error {
	query := `
		INSERT INTO audit_logs (
			record_reference_id, action, timestamp, 
			details, user_agent, ip_address
		) VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id
	`
	
	return db.QueryRow(
		query,
		log.RecordReferenceID,
		log.Action,
		log.Timestamp,
		log.Details,
		log.UserAgent,
		log.IPAddress,
	).Scan(&log.ID)
}

// GetAuditLogs retrieves audit logs with optional filters
func (db *DB) GetAuditLogs(recordRefID *string, limit int, offset int) ([]models.AuditLog, error) {
	query := `
		SELECT id, record_reference_id, action, timestamp, 
		       details, user_agent, ip_address
		FROM audit_logs
		WHERE ($1::VARCHAR IS NULL OR record_reference_id = $1)
		ORDER BY timestamp DESC
		LIMIT $2 OFFSET $3
	`
	
	rows, err := db.Query(query, recordRefID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var logs []models.AuditLog
	for rows.Next() {
		var log models.AuditLog
		err := rows.Scan(
			&log.ID,
			&log.RecordReferenceID,
			&log.Action,
			&log.Timestamp,
			&log.Details,
			&log.UserAgent,
			&log.IPAddress,
		)
		if err != nil {
			return nil, err
		}
		logs = append(logs, log)
	}
	
	return logs, rows.Err()
}

// CreateDeletionNotification creates a notification record
func (db *DB) CreateDeletionNotification(notification *models.DeletionNotification) error {
	query := `
		INSERT INTO deletion_notifications (
			record_reference_id, email, notification_status
		) VALUES ($1, $2, $3)
		RETURNING id, notification_sent_at
	`
	
	return db.QueryRow(
		query,
		notification.RecordReferenceID,
		notification.Email,
		notification.NotificationStatus,
	).Scan(&notification.ID, &notification.NotificationSentAt)
}

// UpdateNotificationStatus updates the status of a notification
func (db *DB) UpdateNotificationStatus(id int, status string, errorMsg *string) error {
	query := `
		UPDATE deletion_notifications
		SET notification_status = $1,
		    error_message = $2,
		    retry_count = retry_count + 1
		WHERE id = $3
	`
	
	_, err := db.Exec(query, status, errorMsg, id)
	return err
}

// GetPendingNotifications retrieves pending deletion notifications
func (db *DB) GetPendingNotifications(limit int) ([]models.DeletionNotification, error) {
	query := `
		SELECT id, record_reference_id, email, notification_sent_at,
		       notification_status, retry_count, error_message
		FROM deletion_notifications
		WHERE notification_status = 'PENDING'
		AND retry_count < 3
		ORDER BY notification_sent_at ASC
		LIMIT $1
	`
	
	rows, err := db.Query(query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var notifications []models.DeletionNotification
	for rows.Next() {
		var n models.DeletionNotification
		err := rows.Scan(
			&n.ID,
			&n.RecordReferenceID,
			&n.Email,
			&n.NotificationSentAt,
			&n.NotificationStatus,
			&n.RetryCount,
			&n.ErrorMessage,
		)
		if err != nil {
			return nil, err
		}
		notifications = append(notifications, n)
	}
	
	return notifications, rows.Err()
}

// GetDeletionReport generates a deletion report for a given date
func (db *DB) GetDeletionReport(date time.Time) (*models.DeletionReport, error) {
	startOfDay := time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0, date.Location())
	endOfDay := startOfDay.Add(24 * time.Hour)
	
	query := `
		SELECT 
			COALESCE(SUM(records_deleted), 0) as total_deleted,
			COALESCE(SUM(records_failed), 0) as total_failed
		FROM deletion_job_logs
		WHERE job_execution_time >= $1 AND job_execution_time < $2
	`
	
	var totalDeleted, totalFailed int
	err := db.QueryRow(query, startOfDay, endOfDay).Scan(&totalDeleted, &totalFailed)
	if err != nil {
		return nil, err
	}
	
	// Get notification stats
	notifQuery := `
		SELECT 
			COUNT(*) FILTER (WHERE notification_status = 'SENT') as sent,
			COUNT(*) FILTER (WHERE notification_status = 'FAILED') as failed
		FROM deletion_notifications
		WHERE notification_sent_at >= $1 AND notification_sent_at < $2
	`
	
	var notifSent, notifFailed int
	err = db.QueryRow(notifQuery, startOfDay, endOfDay).Scan(&notifSent, &notifFailed)
	if err != nil {
		return nil, err
	}
	
	report := &models.DeletionReport{
		Date:                date.Format("2006-01-02"),
		TotalDeletions:      totalDeleted + totalFailed,
		SuccessfulDeletions: totalDeleted,
		FailedDeletions:     totalFailed,
		NotificationsSent:   notifSent,
		NotificationsFailed: notifFailed,
	}
	
	return report, nil
}

// GetDeletionJobLogs retrieves recent deletion job logs
func (db *DB) GetDeletionJobLogs(limit int) ([]models.DeletionJobLog, error) {
	query := `
		SELECT id, job_execution_time, records_deleted, records_failed,
		       execution_status, error_details
		FROM deletion_job_logs
		ORDER BY job_execution_time DESC
		LIMIT $1
	`
	
	rows, err := db.Query(query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var logs []models.DeletionJobLog
	for rows.Next() {
		var log models.DeletionJobLog
		err := rows.Scan(
			&log.ID,
			&log.JobExecutionTime,
			&log.RecordsDeleted,
			&log.RecordsFailed,
			&log.ExecutionStatus,
			&log.ErrorDetails,
		)
		if err != nil {
			return nil, err
		}
		logs = append(logs, log)
	}
	
	return logs, rows.Err()
}

// LogAuditEntry is a helper to create audit log with JSON details
func (db *DB) LogAuditEntry(recordRefID, action string, details interface{}, userAgent, ipAddr *string) error {
	var detailsJSON *string
	if details != nil {
		jsonBytes, err := json.Marshal(details)
		if err != nil {
			return fmt.Errorf("failed to marshal details: %w", err)
		}
		detailsStr := string(jsonBytes)
		detailsJSON = &detailsStr
	}
	
	log := &models.AuditLog{
		RecordReferenceID: recordRefID,
		Action:            action,
		Timestamp:         time.Now(),
		Details:           detailsJSON,
		UserAgent:         userAgent,
		IPAddress:         ipAddr,
	}
	
	return db.CreateAuditLog(log)
}
