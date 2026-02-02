package verification

import (
	"context"
	"math/rand"
	"time"

	"github.com/CodieCCU/SwiftVerify/internal/logger"
	"github.com/CodieCCU/SwiftVerify/internal/models"
	"github.com/google/uuid"
)

// MockProvider is a mock implementation of the Provider interface for testing
type MockProvider struct {
	approvalRate float64 // probability of approval (0.0 to 1.0)
}

// NewMockProvider creates a new mock provider
func NewMockProvider(approvalRate float64) *MockProvider {
	return &MockProvider{
		approvalRate: approvalRate,
	}
}

// Verify simulates a verification request
func (m *MockProvider) Verify(ctx context.Context, email, licenseNumber string) (*VerificationResult, error) {
	logger.WithFields(map[string]interface{}{
		"email":          email,
		"license_number": "***",
		"provider":       "mock",
	}).Info("Mock verification request started")

	// Simulate processing delay
	time.Sleep(2 * time.Second)

	// Randomly approve or deny based on approval rate
	approved := rand.Float64() < m.approvalRate

	responseData := models.JSONB{
		"provider":        "mock",
		"request_id":      uuid.New().String(),
		"timestamp":       time.Now().Format(time.RFC3339),
		"verification_id": uuid.New().String(),
	}

	if approved {
		responseData["status"] = "approved"
		responseData["message"] = "Verification successful"
	} else {
		responseData["status"] = "denied"
		responseData["message"] = "Verification failed - unable to confirm identity"
	}

	result := &VerificationResult{
		RequestID:      uuid.New().String(),
		Status:         "completed",
		Approved:       approved,
		ResponseData:   responseData,
		ProviderStatus: "success",
		Timestamp:      time.Now(),
	}

	logger.WithFields(map[string]interface{}{
		"email":    email,
		"approved": approved,
		"provider": "mock",
	}).Info("Mock verification completed")

	return result, nil
}

// GetStatus retrieves the status of a verification request (mock implementation)
func (m *MockProvider) GetStatus(ctx context.Context, requestID string) (*VerificationResult, error) {
	logger.WithFields(map[string]interface{}{
		"request_id": requestID,
		"provider":   "mock",
	}).Info("Mock status check")

	// In a real implementation, this would query the provider's API
	// For mock, we just return a completed status
	return &VerificationResult{
		RequestID:      requestID,
		Status:         "completed",
		Approved:       rand.Float64() < m.approvalRate,
		ResponseData:   models.JSONB{"status": "completed"},
		ProviderStatus: "success",
		Timestamp:      time.Now(),
	}, nil
}

// Name returns the name of the provider
func (m *MockProvider) Name() string {
	return "Mock Verification Provider"
}
