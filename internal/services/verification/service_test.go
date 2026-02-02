package verification

import (
	"context"
	"testing"

	"github.com/CodieCCU/SwiftVerify/internal/models"
)

// TestMockProvider tests the mock provider implementation
func TestMockProvider(t *testing.T) {
	provider := NewMockProvider(1.0) // 100% approval rate

	ctx := context.Background()
	result, err := provider.Verify(ctx, "test@example.com", "DL123456")

	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	if result == nil {
		t.Fatal("Expected result, got nil")
	}

	if !result.Approved {
		t.Error("Expected approval with 100% approval rate")
	}

	if result.Status != "completed" {
		t.Errorf("Expected status 'completed', got '%s'", result.Status)
	}

	if provider.Name() != "Mock Verification Provider" {
		t.Errorf("Expected provider name 'Mock Verification Provider', got '%s'", provider.Name())
	}
}

// TestMockProviderDenial tests the mock provider with 0% approval rate
func TestMockProviderDenial(t *testing.T) {
	provider := NewMockProvider(0.0) // 0% approval rate

	ctx := context.Background()
	result, err := provider.Verify(ctx, "test@example.com", "DL123456")

	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	if result == nil {
		t.Fatal("Expected result, got nil")
	}

	if result.Approved {
		t.Error("Expected denial with 0% approval rate")
	}
}

// TestMockProviderGetStatus tests the GetStatus method
func TestMockProviderGetStatus(t *testing.T) {
	provider := NewMockProvider(0.7)

	ctx := context.Background()
	result, err := provider.GetStatus(ctx, "test-request-id")

	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	if result == nil {
		t.Fatal("Expected result, got nil")
	}

	if result.Status != "completed" {
		t.Errorf("Expected status 'completed', got '%s'", result.Status)
	}
}

// MockRepository is a mock implementation of Repository for testing
type MockRepository struct {
	requests map[string]*models.VerificationRequest
	results  map[string]*models.VerificationResult
	errors   map[string]*models.VerificationErrorLog
}

func NewMockRepository() *MockRepository {
	return &MockRepository{
		requests: make(map[string]*models.VerificationRequest),
		results:  make(map[string]*models.VerificationResult),
		errors:   make(map[string]*models.VerificationErrorLog),
	}
}

func (m *MockRepository) CreateRequest(ctx context.Context, req *models.VerificationRequest) error {
	if req.ID == "" {
		req.ID = "test-id"
	}
	m.requests[req.ID] = req
	return nil
}

func (m *MockRepository) GetRequest(ctx context.Context, id string) (*models.VerificationRequest, error) {
	req, exists := m.requests[id]
	if !exists {
		return nil, nil
	}
	return req, nil
}

func (m *MockRepository) UpdateRequest(ctx context.Context, req *models.VerificationRequest) error {
	m.requests[req.ID] = req
	return nil
}

func (m *MockRepository) CreateResult(ctx context.Context, result *models.VerificationResult) error {
	if result.ID == "" {
		result.ID = "test-result-id"
	}
	m.results[result.VerificationRequestID] = result
	return nil
}

func (m *MockRepository) GetResult(ctx context.Context, requestID string) (*models.VerificationResult, error) {
	result, exists := m.results[requestID]
	if !exists {
		return nil, nil
	}
	return result, nil
}

func (m *MockRepository) CreateErrorLog(ctx context.Context, log *models.VerificationErrorLog) error {
	if log.ID == "" {
		log.ID = "test-error-id"
	}
	m.errors[log.VerificationRequestID] = log
	return nil
}

// TestServiceSubmitVerification tests the service submit verification flow
func TestServiceSubmitVerification(t *testing.T) {
	provider := NewMockProvider(1.0)
	repo := NewMockRepository()
	service := NewService(provider, repo)

	ctx := context.Background()
	req, err := service.SubmitVerification(ctx, "test@example.com", "DL123456", "manual")

	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	if req == nil {
		t.Fatal("Expected request, got nil")
	}

	if req.Email != "test@example.com" {
		t.Errorf("Expected email 'test@example.com', got '%s'", req.Email)
	}

	if req.Status != models.StatusPending {
		t.Errorf("Expected status 'pending', got '%s'", req.Status)
	}
}
