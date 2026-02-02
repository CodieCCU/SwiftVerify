package verification

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/CodieCCU/SwiftVerify/internal/models"
	"github.com/google/uuid"
)

// Repository defines the interface for verification data access
type Repository interface {
	CreateRequest(ctx context.Context, req *models.VerificationRequest) error
	GetRequest(ctx context.Context, id string) (*models.VerificationRequest, error)
	UpdateRequest(ctx context.Context, req *models.VerificationRequest) error
	CreateResult(ctx context.Context, result *models.VerificationResult) error
	GetResult(ctx context.Context, requestID string) (*models.VerificationResult, error)
	CreateErrorLog(ctx context.Context, log *models.VerificationErrorLog) error
}

// PostgresRepository implements Repository for PostgreSQL
type PostgresRepository struct {
	db *sql.DB
}

// NewPostgresRepository creates a new PostgreSQL repository
func NewPostgresRepository(db *sql.DB) *PostgresRepository {
	return &PostgresRepository{db: db}
}

// CreateRequest creates a new verification request
func (r *PostgresRepository) CreateRequest(ctx context.Context, req *models.VerificationRequest) error {
	req.ID = uuid.New().String()

	query := `
		INSERT INTO verification_requests (id, email, license_number, input_method, status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`

	_, err := r.db.ExecContext(ctx, query,
		req.ID, req.Email, req.LicenseNumber, req.InputMethod, req.Status, req.CreatedAt, req.UpdatedAt)
	
	return err
}

// GetRequest retrieves a verification request by ID
func (r *PostgresRepository) GetRequest(ctx context.Context, id string) (*models.VerificationRequest, error) {
	query := `
		SELECT id, email, license_number, input_method, status, created_at, updated_at
		FROM verification_requests
		WHERE id = $1
	`

	req := &models.VerificationRequest{}
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&req.ID, &req.Email, &req.LicenseNumber, &req.InputMethod, &req.Status, &req.CreatedAt, &req.UpdatedAt)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("verification request not found")
	}

	return req, err
}

// UpdateRequest updates a verification request
func (r *PostgresRepository) UpdateRequest(ctx context.Context, req *models.VerificationRequest) error {
	query := `
		UPDATE verification_requests
		SET status = $1, updated_at = $2
		WHERE id = $3
	`

	_, err := r.db.ExecContext(ctx, query, req.Status, req.UpdatedAt, req.ID)
	return err
}

// CreateResult creates a verification result
func (r *PostgresRepository) CreateResult(ctx context.Context, result *models.VerificationResult) error {
	result.ID = uuid.New().String()

	query := `
		INSERT INTO verification_results (id, verification_request_id, approved, response_data, provider_status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`

	_, err := r.db.ExecContext(ctx, query,
		result.ID, result.VerificationRequestID, result.Approved, result.ResponseData, result.ProviderStatus, result.CreatedAt, result.UpdatedAt)

	return err
}

// GetResult retrieves a verification result by request ID
func (r *PostgresRepository) GetResult(ctx context.Context, requestID string) (*models.VerificationResult, error) {
	query := `
		SELECT id, verification_request_id, approved, response_data, provider_status, created_at, updated_at
		FROM verification_results
		WHERE verification_request_id = $1
	`

	result := &models.VerificationResult{}
	err := r.db.QueryRowContext(ctx, query, requestID).Scan(
		&result.ID, &result.VerificationRequestID, &result.Approved, &result.ResponseData, &result.ProviderStatus, &result.CreatedAt, &result.UpdatedAt)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("verification result not found")
	}

	return result, err
}

// CreateErrorLog creates an error log entry
func (r *PostgresRepository) CreateErrorLog(ctx context.Context, log *models.VerificationErrorLog) error {
	log.ID = uuid.New().String()

	query := `
		INSERT INTO verification_error_logs (id, verification_request_id, error_type, error_message, error_details, retryable, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`

	_, err := r.db.ExecContext(ctx, query,
		log.ID, log.VerificationRequestID, log.ErrorType, log.ErrorMessage, log.ErrorDetails, log.Retryable, log.CreatedAt)

	return err
}
