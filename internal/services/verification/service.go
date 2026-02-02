package verification

import (
	"context"
	"time"

	"github.com/CodieCCU/SwiftVerify/internal/models"
)

// Provider is the interface for verification providers (e.g., Equifax)
type Provider interface {
	// Verify submits a verification request to the provider
	Verify(ctx context.Context, email, licenseNumber string) (*VerificationResult, error)

	// GetStatus retrieves the status of a verification request
	GetStatus(ctx context.Context, requestID string) (*VerificationResult, error)

	// Name returns the name of the provider
	Name() string
}

// VerificationResult represents the result from a verification provider
type VerificationResult struct {
	RequestID      string
	Status         string
	Approved       bool
	ResponseData   models.JSONB
	ProviderStatus string
	Error          error
	Timestamp      time.Time
}

// Service handles verification business logic
type Service struct {
	provider Provider
	repo     Repository
}

// NewService creates a new verification service
func NewService(provider Provider, repo Repository) *Service {
	return &Service{
		provider: provider,
		repo:     repo,
	}
}

// SubmitVerification submits a new verification request
func (s *Service) SubmitVerification(ctx context.Context, email, licenseNumber, inputMethod string) (*models.VerificationRequest, error) {
	// Create verification request in database
	req := &models.VerificationRequest{
		Email:         email,
		LicenseNumber: licenseNumber,
		InputMethod:   inputMethod,
		Status:        models.StatusPending,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	if err := s.repo.CreateRequest(ctx, req); err != nil {
		return nil, err
	}

	// Start verification in background (in production, this would be async)
	go s.processVerification(context.Background(), req.ID, email, licenseNumber)

	return req, nil
}

// GetVerificationStatus retrieves the status of a verification request
func (s *Service) GetVerificationStatus(ctx context.Context, id string) (*models.VerificationRequest, *models.VerificationResult, error) {
	req, err := s.repo.GetRequest(ctx, id)
	if err != nil {
		return nil, nil, err
	}

	result, err := s.repo.GetResult(ctx, id)
	if err != nil && err.Error() != "verification result not found" {
		return req, nil, err
	}

	return req, result, nil
}

// RetryVerification retries a failed verification
func (s *Service) RetryVerification(ctx context.Context, id string) error {
	req, err := s.repo.GetRequest(ctx, id)
	if err != nil {
		return err
	}

	// Update status to pending
	req.Status = models.StatusPending
	req.UpdatedAt = time.Now()
	
	if err := s.repo.UpdateRequest(ctx, req); err != nil {
		return err
	}

	// Start verification in background
	go s.processVerification(context.Background(), req.ID, req.Email, req.LicenseNumber)

	return nil
}

// processVerification processes a verification request
func (s *Service) processVerification(ctx context.Context, requestID, email, licenseNumber string) {
	// Update status to processing
	req, err := s.repo.GetRequest(ctx, requestID)
	if err != nil {
		return
	}

	req.Status = models.StatusProcessing
	req.UpdatedAt = time.Now()
	_ = s.repo.UpdateRequest(ctx, req)

	// Call provider
	result, err := s.provider.Verify(ctx, email, licenseNumber)
	if err != nil {
		// Log error
		errorLog := &models.VerificationErrorLog{
			VerificationRequestID: requestID,
			ErrorType:             "PROVIDER_ERROR",
			ErrorMessage:          err.Error(),
			Retryable:             true,
			CreatedAt:             time.Now(),
		}
		_ = s.repo.CreateErrorLog(ctx, errorLog)

		// Update request status to failed
		req.Status = models.StatusFailed
		req.UpdatedAt = time.Now()
		_ = s.repo.UpdateRequest(ctx, req)
		return
	}

	// Save result
	dbResult := &models.VerificationResult{
		VerificationRequestID: requestID,
		Approved:              result.Approved,
		ResponseData:          result.ResponseData,
		ProviderStatus:        result.ProviderStatus,
		CreatedAt:             time.Now(),
		UpdatedAt:             time.Now(),
	}
	_ = s.repo.CreateResult(ctx, dbResult)

	// Update request status
	req.Status = models.StatusCompleted
	req.UpdatedAt = time.Now()
	_ = s.repo.UpdateRequest(ctx, req)
}
