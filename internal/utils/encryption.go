package utils

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"io"
)

// EncryptionService handles encryption and decryption of sensitive data
type EncryptionService struct {
	masterKey []byte
}

// NewEncryptionService creates a new encryption service
func NewEncryptionService(masterKeyHex string) (*EncryptionService, error) {
	key, err := hex.DecodeString(masterKeyHex)
	if err != nil {
		return nil, err
	}
	
	if len(key) != 32 {
		return nil, errors.New("master key must be 32 bytes (256 bits)")
	}
	
	return &EncryptionService{masterKey: key}, nil
}

// Encrypt encrypts plaintext using AES-GCM
func (e *EncryptionService) Encrypt(plaintext string) (string, error) {
	block, err := aes.NewCipher(e.masterKey)
	if err != nil {
		return "", err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonce := make([]byte, gcm.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	ciphertext := gcm.Seal(nonce, nonce, []byte(plaintext), nil)
	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

// Decrypt decrypts ciphertext using AES-GCM
func (e *EncryptionService) Decrypt(ciphertext string) (string, error) {
	data, err := base64.StdEncoding.DecodeString(ciphertext)
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(e.masterKey)
	if err != nil {
		return "", err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonceSize := gcm.NonceSize()
	if len(data) < nonceSize {
		return "", errors.New("ciphertext too short")
	}

	nonce, encryptedData := data[:nonceSize], data[nonceSize:]
	plaintext, err := gcm.Open(nil, nonce, encryptedData, nil)
	if err != nil {
		return "", err
	}

	return string(plaintext), nil
}

// GenerateRecordReferenceID generates a hashed/obfuscated identifier for a record
func GenerateRecordReferenceID(email string, licenseNumber string) string {
	// Combine email and license number with a timestamp for uniqueness
	data := email + "|" + licenseNumber + "|" + randomString(16)
	hash := sha256.Sum256([]byte(data))
	return hex.EncodeToString(hash[:])
}

// randomString generates a random string of specified length
func randomString(length int) string {
	b := make([]byte, length)
	if _, err := rand.Read(b); err != nil {
		return ""
	}
	return hex.EncodeToString(b)
}

// HashSensitiveData creates a one-way hash of sensitive data for logging
func HashSensitiveData(data string) string {
	hash := sha256.Sum256([]byte(data))
	return hex.EncodeToString(hash[:])[:16] // Return first 16 chars for brevity
}
