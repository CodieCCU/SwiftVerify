package utils

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"io"
	"os"
)

// getEncryptionKey retrieves the encryption key from environment variable
// In production, this should be a 32-byte key stored securely
func getEncryptionKey() []byte {
	key := os.Getenv("ENCRYPTION_KEY")
	if key == "" {
		// For demo purposes, use a default key
		// In production, this should fail if no key is set
		key = "demo-encryption-key-32-bytes!!"
	}
	// Ensure key is exactly 32 bytes for AES-256
	keyBytes := []byte(key)
	if len(keyBytes) < 32 {
		// Pad with zeros if too short
		padding := make([]byte, 32-len(keyBytes))
		keyBytes = append(keyBytes, padding...)
	}
	return keyBytes[:32]
}

// EncryptData encrypts plaintext using AES-256-GCM
func EncryptData(plaintext string) (string, error) {
	if plaintext == "" {
		return "", nil
	}

	key := getEncryptionKey()
	block, err := aes.NewCipher(key)
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

// DecryptData decrypts ciphertext using AES-256-GCM
func DecryptData(ciphertext string) (string, error) {
	if ciphertext == "" {
		return "", nil
	}

	key := getEncryptionKey()
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	data, err := base64.StdEncoding.DecodeString(ciphertext)
	if err != nil {
		return "", err
	}

	nonceSize := gcm.NonceSize()
	if len(data) < nonceSize {
		return "", errors.New("ciphertext too short")
	}

	nonce, cipherData := data[:nonceSize], data[nonceSize:]
	plaintext, err := gcm.Open(nil, nonce, cipherData, nil)
	if err != nil {
		return "", err
	}

	return string(plaintext), nil
}
