package email

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"sync"
	"time"
)

// UnsubscribeToken represents an unsubscribe token
type UnsubscribeToken struct {
	Email     string
	Token     string
	ExpiresAt time.Time
}

// UnsubscribeRecord represents a database record of an unsubscribe
type UnsubscribeRecord struct {
	ID                 string
	Email              string
	Token              string
	UnsubscribedAt     time.Time
	IPAddress          string
	UserAgent          string
	Reason             string
	AdminRemoved       bool
	AdminUserID        *int
	RemovalNotes       string
	CreatedAt          time.Time
}

const (
	// TokenExpirationDays is the number of days before a token expires
	TokenExpirationDays = 90
)

var (
	secretKey   string
	secretKeyMu sync.RWMutex
)

// SetSecretKey sets the secret key for HMAC token generation (thread-safe)
func SetSecretKey(key string) error {
	if key == "" {
		return fmt.Errorf("secret key cannot be empty")
	}
	
	secretKeyMu.Lock()
	defer secretKeyMu.Unlock()
	secretKey = key
	return nil
}

// getSecretKey safely retrieves the secret key
func getSecretKey() (string, error) {
	secretKeyMu.RLock()
	defer secretKeyMu.RUnlock()
	
	if secretKey == "" {
		return "", fmt.Errorf("secret key not set - call SetSecretKey() before generating tokens")
	}
	
	return secretKey, nil
}

// GenerateUnsubscribeToken generates a unique HMAC-SHA256 token for an email
func GenerateUnsubscribeToken(email string) (*UnsubscribeToken, error) {
	// Get secret key safely
	key, err := getSecretKey()
	if err != nil {
		return nil, err
	}
	
	// Generate random bytes for additional entropy
	randomBytes := make([]byte, 16)
	if _, err := rand.Read(randomBytes); err != nil {
		return nil, fmt.Errorf("failed to generate random bytes: %w", err)
	}

	// Create HMAC hash
	h := hmac.New(sha256.New, []byte(key))
	h.Write([]byte(email))
	h.Write(randomBytes)
	h.Write([]byte(time.Now().UTC().String()))
	
	tokenHash := h.Sum(nil)
	token := base64.URLEncoding.EncodeToString(tokenHash)

	return &UnsubscribeToken{
		Email:     email,
		Token:     token,
		ExpiresAt: time.Now().UTC().Add(TokenExpirationDays * 24 * time.Hour),
	}, nil
}

// VerifyUnsubscribeToken verifies a token's validity
// Note: In production, this would check the database to verify the token exists
func VerifyUnsubscribeToken(token string) bool {
	// Basic validation - check if token is properly encoded
	if token == "" {
		return false
	}
	
	_, err := base64.URLEncoding.DecodeString(token)
	return err == nil
}

// GenerateEmailHash creates a hash of the email for verification
func GenerateEmailHash(email string) string {
	h := sha256.New()
	h.Write([]byte(email))
	return hex.EncodeToString(h.Sum(nil))
}

// IsUnsubscribed checks if an email is in the unsubscribe list
// This is a placeholder - in production, this would query the database
func IsUnsubscribed(email string) bool {
	// TODO: Implement database query
	// SELECT EXISTS(SELECT 1 FROM unsubscribes WHERE email = $1 AND admin_removed = FALSE)
	return false
}

// ProcessUnsubscribe handles an unsubscribe request
// This is a placeholder - in production, this would insert into the database
func ProcessUnsubscribe(email, token, ipAddress, userAgent, reason string) error {
	// TODO: Implement database insertion
	// INSERT INTO unsubscribes (email, token, ip_address, user_agent, reason)
	// VALUES ($1, $2, $3, $4, $5)
	
	// Log the audit event
	if err := LogAuditEvent("email_unsubscribe", email, ipAddress, userAgent, map[string]interface{}{
		"token":  token,
		"reason": reason,
	}); err != nil {
		return fmt.Errorf("failed to log audit event: %w", err)
	}
	
	return nil
}
