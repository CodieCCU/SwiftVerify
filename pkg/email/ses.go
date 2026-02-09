package email

import (
	"fmt"
	"os"
)

// SESConfig holds AWS SES configuration
type SESConfig struct {
	AWSRegion          string
	AWSAccessKeyID     string
	AWSSecretAccessKey string
	FromEmail          string
	FromName           string
	ConfigSet          string
}

// SESService represents the AWS SES email service
type SESService struct {
	config *SESConfig
	queue  *EmailQueue
}

// NewSESService creates a new SES service instance
func NewSESService() *SESService {
	config := &SESConfig{
		AWSRegion:          getEnv("AWS_SES_REGION", "us-west-2"),
		AWSAccessKeyID:     getEnv("AWS_ACCESS_KEY_ID", ""),
		AWSSecretAccessKey: getEnv("AWS_SECRET_ACCESS_KEY", ""),
		FromEmail:          getEnv("AWS_SES_FROM_EMAIL", "noreply@swift-verify.org"),
		FromName:           getEnv("AWS_SES_FROM_NAME", "SwiftVerify"),
		ConfigSet:          getEnv("AWS_SES_CONFIG_SET", "swiftverify-emails"),
	}
	
	// Initialize unsubscribe secret key from environment
	unsubscribeSecret := getEnv("UNSUBSCRIBE_SECRET_KEY", "")
	if unsubscribeSecret != "" {
		if err := SetSecretKey(unsubscribeSecret); err != nil {
			fmt.Printf("Warning: Failed to set unsubscribe secret key: %v\n", err)
		}
	} else {
		fmt.Println("Warning: UNSUBSCRIBE_SECRET_KEY not set - unsubscribe token generation will fail")
	}
	
	return &SESService{
		config: config,
		queue:  NewEmailQueue(),
	}
}

// SendDenialEmail sends a denial email with unsubscribe
func (s *SESService) SendDenialEmail(recipientEmail, reason string, applicationID *int) error {
	// Generate unsubscribe token
	token, err := GenerateUnsubscribeToken(recipientEmail)
	if err != nil {
		return fmt.Errorf("failed to generate unsubscribe token: %w", err)
	}
	
	// Build email template
	template := BuildDenialEmail(recipientEmail, reason, token.Token)
	
	// Enqueue email (will check unsubscribe status)
	item, err := s.queue.EnqueueEmail("denial", recipientEmail, template, applicationID)
	if err != nil {
		return fmt.Errorf("failed to enqueue email: %w", err)
	}
	
	// If skipped due to unsubscribe, return without error
	if item.Status == "skipped" {
		return nil
	}
	
	// Send the email
	return s.queue.SendEmail(item)
}

// SendApprovalEmail sends an approval email with unsubscribe
func (s *SESService) SendApprovalEmail(recipientEmail string, applicationID *int) error {
	token, err := GenerateUnsubscribeToken(recipientEmail)
	if err != nil {
		return fmt.Errorf("failed to generate unsubscribe token: %w", err)
	}
	
	template := BuildApprovalEmail(recipientEmail, token.Token)
	
	item, err := s.queue.EnqueueEmail("approval", recipientEmail, template, applicationID)
	if err != nil {
		return fmt.Errorf("failed to enqueue email: %w", err)
	}
	
	if item.Status == "skipped" {
		return nil
	}
	
	return s.queue.SendEmail(item)
}

// SendWaiverEmail sends a waiver email with unsubscribe
func (s *SESService) SendWaiverEmail(recipientEmail string, waiverAmount float64, applicationID *int) error {
	token, err := GenerateUnsubscribeToken(recipientEmail)
	if err != nil {
		return fmt.Errorf("failed to generate unsubscribe token: %w", err)
	}
	
	template := BuildWaiverEmail(recipientEmail, waiverAmount, token.Token)
	
	item, err := s.queue.EnqueueEmail("waiver", recipientEmail, template, applicationID)
	if err != nil {
		return fmt.Errorf("failed to enqueue email: %w", err)
	}
	
	if item.Status == "skipped" {
		return nil
	}
	
	return s.queue.SendEmail(item)
}

// SendGapPayEmail sends a gap pay email with unsubscribe
func (s *SESService) SendGapPayEmail(recipientEmail string, gapAmount float64, applicationID *int) error {
	token, err := GenerateUnsubscribeToken(recipientEmail)
	if err != nil {
		return fmt.Errorf("failed to generate unsubscribe token: %w", err)
	}
	
	template := BuildGapPayEmail(recipientEmail, gapAmount, token.Token)
	
	item, err := s.queue.EnqueueEmail("gappay", recipientEmail, template, applicationID)
	if err != nil {
		return fmt.Errorf("failed to enqueue email: %w", err)
	}
	
	if item.Status == "skipped" {
		return nil
	}
	
	return s.queue.SendEmail(item)
}

// SendLandlordAlert sends an alert email to landlord with unsubscribe
func (s *SESService) SendLandlordAlert(recipientEmail, alertType, alertMessage string) error {
	token, err := GenerateUnsubscribeToken(recipientEmail)
	if err != nil {
		return fmt.Errorf("failed to generate unsubscribe token: %w", err)
	}
	
	template := BuildLandlordAlertEmail(recipientEmail, alertType, alertMessage, token.Token)
	
	item, err := s.queue.EnqueueEmail("landlord_alert", recipientEmail, template, nil)
	if err != nil {
		return fmt.Errorf("failed to enqueue email: %w", err)
	}
	
	if item.Status == "skipped" {
		return nil
	}
	
	return s.queue.SendEmail(item)
}

// getEnv retrieves environment variable with default fallback
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
