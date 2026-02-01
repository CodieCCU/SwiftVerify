package utils

import (
	"testing"
)

func TestEncryptionService(t *testing.T) {
	// Use a test key (32 bytes hex encoded = 64 characters)
	testKey := "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
	
	service, err := NewEncryptionService(testKey)
	if err != nil {
		t.Fatalf("Failed to create encryption service: %v", err)
	}

	testCases := []struct {
		name      string
		plaintext string
	}{
		{"simple string", "hello world"},
		{"empty string", ""},
		{"license number", "DL123456789"},
		{"long string", "This is a very long string with lots of characters to test encryption"},
		{"special characters", "!@#$%^&*()_+-=[]{}|;:',.<>?/`~"},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Encrypt
			encrypted, err := service.Encrypt(tc.plaintext)
			if err != nil {
				t.Fatalf("Encryption failed: %v", err)
			}

			// Verify encrypted is different from plaintext
			if encrypted == tc.plaintext && tc.plaintext != "" {
				t.Error("Encrypted text should differ from plaintext")
			}

			// Decrypt
			decrypted, err := service.Decrypt(encrypted)
			if err != nil {
				t.Fatalf("Decryption failed: %v", err)
			}

			// Verify decrypted matches original
			if decrypted != tc.plaintext {
				t.Errorf("Decrypted text doesn't match. Got %q, want %q", decrypted, tc.plaintext)
			}
		})
	}
}

func TestGenerateRecordReferenceID(t *testing.T) {
	email := "test@example.com"
	licenseNumber := "DL123456789"

	// Generate multiple IDs
	id1 := GenerateRecordReferenceID(email, licenseNumber)
	id2 := GenerateRecordReferenceID(email, licenseNumber)

	// IDs should be different due to random component
	if id1 == id2 {
		t.Error("Generated IDs should be unique")
	}

	// IDs should be 64 characters (SHA-256 hash hex encoded)
	if len(id1) != 64 {
		t.Errorf("Generated ID length is %d, expected 64", len(id1))
	}
}

func TestHashSensitiveData(t *testing.T) {
	data := "sensitive-data-123"
	hash := HashSensitiveData(data)

	// Hash should be 16 characters (first 16 chars of SHA-256)
	if len(hash) != 16 {
		t.Errorf("Hash length is %d, expected 16", len(hash))
	}

	// Same input should produce same hash
	hash2 := HashSensitiveData(data)
	if hash != hash2 {
		t.Error("Same input should produce same hash")
	}

	// Different input should produce different hash
	hash3 := HashSensitiveData("different-data")
	if hash == hash3 {
		t.Error("Different input should produce different hash")
	}
}

func TestInvalidEncryptionKey(t *testing.T) {
	// Test with invalid key length
	_, err := NewEncryptionService("short")
	if err == nil {
		t.Error("Expected error for invalid key length")
	}

	// Test with invalid hex
	_, err = NewEncryptionService("gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg")
	if err == nil {
		t.Error("Expected error for invalid hex string")
	}
}
