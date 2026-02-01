package services

import (
	"fmt"
	"log"

	"github.com/CodieCCU/SwiftVerify/internal/database"
)

// NotificationService handles sending deletion notifications
type NotificationService struct {
	db *database.DB
}

// NewNotificationService creates a new notification service
func NewNotificationService(db *database.DB) *NotificationService {
	return &NotificationService{db: db}
}

// SendDeletionEmail sends an email notification about data deletion
// In production, this would integrate with an email service like SendGrid, AWS SES, etc.
func (ns *NotificationService) SendDeletionEmail(email, recordRefID string) error {
	// Simulate email sending
	// In production, implement actual email sending logic
	log.Printf("Sending deletion notification to %s for record %s", email, recordRefID)
	
	emailBody := fmt.Sprintf(`
Dear User,

This is to confirm that your Driver's License data has been successfully deleted from our system 
as part of our 30-day data retention policy.

Record Reference ID: %s
Deletion Date: %s

Your data has been permanently removed from our active database in compliance with FCRA and GDPR regulations.

If you have any questions or concerns, please contact our support team at support@swiftverify.com.

Thank you for using SwiftVerify.

Best regards,
SwiftVerify Team
	`, recordRefID[:16]+"...", "today")
	
	// Log the email content (in production, send via email service)
	log.Printf("Email body: %s", emailBody)
	
	return nil
}

// ProcessPendingNotifications processes all pending deletion notifications
func (ns *NotificationService) ProcessPendingNotifications() (int, int, error) {
	notifications, err := ns.db.GetPendingNotifications(100)
	if err != nil {
		return 0, 0, fmt.Errorf("failed to get pending notifications: %w", err)
	}
	
	sent := 0
	failed := 0
	
	for _, notification := range notifications {
		err := ns.SendDeletionEmail(notification.Email, notification.RecordReferenceID)
		if err != nil {
			failed++
			errorMsg := err.Error()
			ns.db.UpdateNotificationStatus(notification.ID, "FAILED", &errorMsg)
			
			// Log the failure
			ns.db.LogAuditEntry(
				notification.RecordReferenceID,
				"NOTIFICATION_FAILED",
				map[string]interface{}{
					"email": notification.Email,
					"error": err.Error(),
					"retry_count": notification.RetryCount + 1,
				},
				nil,
				nil,
			)
		} else {
			sent++
			ns.db.UpdateNotificationStatus(notification.ID, "SENT", nil)
			
			// Log successful notification
			ns.db.LogAuditEntry(
				notification.RecordReferenceID,
				"NOTIFICATION_SENT",
				map[string]interface{}{
					"email": notification.Email,
					"notification_id": notification.ID,
				},
				nil,
				nil,
			)
		}
	}
	
	log.Printf("Processed %d notifications: %d sent, %d failed", len(notifications), sent, failed)
	return sent, failed, nil
}
