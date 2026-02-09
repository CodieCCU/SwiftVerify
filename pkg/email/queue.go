package email

import (
	"fmt"
	"time"
)

// EmailQueueItem represents an email in the queue
type EmailQueueItem struct {
	ID              string
	EmailType       string
	RecipientEmail  string
	ApplicationID   *int
	Template        *EmailTemplate
	Status          string // pending, sent, failed, skipped
	SkippedReason   string
	RetryCount      int
	MaxRetries      int
	CreatedAt       time.Time
	SentAt          *time.Time
	AWSMessageID    string
}

// EmailQueue manages email sending with unsubscribe checks
type EmailQueue struct {
	maxRetries int
}

// NewEmailQueue creates a new email queue
func NewEmailQueue() *EmailQueue {
	return &EmailQueue{
		maxRetries: 3,
	}
}

// EnqueueEmail adds an email to the queue
func (q *EmailQueue) EnqueueEmail(emailType, recipientEmail string, template *EmailTemplate, applicationID *int) (*EmailQueueItem, error) {
	// Check if recipient is unsubscribed BEFORE queuing
	if IsUnsubscribed(recipientEmail) {
		// Log the attempted send to unsubscribed user
		LogAuditEvent("email_attempted_to_unsubscribed", recipientEmail, "", "", map[string]interface{}{
			"email_type":     emailType,
			"application_id": applicationID,
			"status":         "skipped",
		})
		
		return &EmailQueueItem{
			EmailType:      emailType,
			RecipientEmail: recipientEmail,
			Status:         "skipped",
			SkippedReason:  "User has unsubscribed",
			CreatedAt:      time.Now().UTC(),
		}, nil
	}
	
	item := &EmailQueueItem{
		EmailType:      emailType,
		RecipientEmail: recipientEmail,
		ApplicationID:  applicationID,
		Template:       template,
		Status:         "pending",
		RetryCount:     0,
		MaxRetries:     q.maxRetries,
		CreatedAt:      time.Now().UTC(),
	}
	
	// TODO: Insert into email_logs table with status='pending'
	// INSERT INTO email_logs (email_type, recipient_email, application_id, status)
	// VALUES ($1, $2, $3, 'pending')
	
	return item, nil
}

// SendEmail sends an email (mock implementation)
func (q *EmailQueue) SendEmail(item *EmailQueueItem) error {
	// Double-check unsubscribe status before sending
	if IsUnsubscribed(item.RecipientEmail) {
		item.Status = "skipped"
		item.SkippedReason = "User unsubscribed before send"
		
		LogAuditEvent("email_skipped_unsubscribed", item.RecipientEmail, "", "", map[string]interface{}{
			"email_type":     item.EmailType,
			"application_id": item.ApplicationID,
		})
		
		// TODO: Update email_logs status to 'skipped'
		return nil
	}
	
	// TODO: Implement actual AWS SES sending
	// This would use AWS SDK to send via SES
	// For now, we'll simulate success
	
	now := time.Now().UTC()
	item.SentAt = &now
	item.Status = "sent"
	item.AWSMessageID = fmt.Sprintf("mock-msg-%d", now.Unix())
	
	// Log successful send
	LogEmailEvent("email_sent", item.RecipientEmail, item.EmailType, map[string]interface{}{
		"application_id":  item.ApplicationID,
		"aws_message_id":  item.AWSMessageID,
		"sent_at":         now,
	})
	
	// TODO: Update email_logs with status='sent', aws_message_id, sent_at
	
	fmt.Printf("[EMAIL QUEUE] Sent %s email to %s (Message ID: %s)\n", 
		item.EmailType, item.RecipientEmail, item.AWSMessageID)
	
	return nil
}

// RetryFailedEmail retries a failed email send
func (q *EmailQueue) RetryFailedEmail(item *EmailQueueItem) error {
	if item.RetryCount >= item.MaxRetries {
		item.Status = "failed"
		
		LogEmailEvent("email_failed_max_retries", item.RecipientEmail, item.EmailType, map[string]interface{}{
			"application_id": item.ApplicationID,
			"retry_count":    item.RetryCount,
		})
		
		// TODO: Update email_logs with status='failed'
		return fmt.Errorf("max retries exceeded for email to %s", item.RecipientEmail)
	}
	
	item.RetryCount++
	
	// TODO: Update email_logs retry_count
	
	return q.SendEmail(item)
}

// GetEmailStatus retrieves the status of an email
func (q *EmailQueue) GetEmailStatus(emailID string) (*EmailQueueItem, error) {
	// TODO: Query email_logs table
	// SELECT * FROM email_logs WHERE id = $1
	
	return nil, fmt.Errorf("not implemented")
}
