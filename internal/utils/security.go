package utils

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
)

// GenerateSecureToken generates a cryptographically secure random token
func GenerateSecureToken() (string, error) {
	// Generate UUID for uniqueness
	id := uuid.New()
	
	// Add random bytes for additional entropy
	randomBytes := make([]byte, 32)
	if _, err := rand.Read(randomBytes); err != nil {
		return "", err
	}
	
	// Combine UUID and random bytes
	token := fmt.Sprintf("%s-%s", id.String(), hex.EncodeToString(randomBytes))
	return token, nil
}

// MaskEmail masks an email address for privacy
// Example: "john.doe@example.com" -> "j***@example.com"
func MaskEmail(email string) string {
	if email == "" {
		return ""
	}
	
	parts := strings.Split(email, "@")
	if len(parts) != 2 {
		return "***"
	}
	
	localPart := parts[0]
	domain := parts[1]
	
	if len(localPart) == 0 {
		return "***@" + domain
	}
	
	if len(localPart) == 1 {
		return localPart[0:1] + "***@" + domain
	}
	
	return localPart[0:1] + "***@" + domain
}

// IsTokenExpired checks if a token has expired
func IsTokenExpired(expiresAt time.Time) bool {
	return time.Now().After(expiresAt)
}

// GetDefaultTokenExpiration returns the default expiration duration (7 days)
func GetDefaultTokenExpiration() time.Time {
	return time.Now().Add(7 * 24 * time.Hour)
}
