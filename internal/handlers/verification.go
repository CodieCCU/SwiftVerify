package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/CodieCCU/SwiftVerify/internal/errors"
	"github.com/CodieCCU/SwiftVerify/internal/logger"
	"github.com/CodieCCU/SwiftVerify/internal/middleware"
	"github.com/CodieCCU/SwiftVerify/internal/services/verification"
	"github.com/CodieCCU/SwiftVerify/pkg/dto"
	"github.com/gorilla/mux"
)

// VerificationHandler handles verification-related HTTP requests
type VerificationHandler struct {
	service *verification.Service
}

// NewVerificationHandler creates a new verification handler
func NewVerificationHandler(service *verification.Service) *VerificationHandler {
	return &VerificationHandler{service: service}
}

// SubmitVerification handles POST /api/verify
func (h *VerificationHandler) SubmitVerification(w http.ResponseWriter, r *http.Request) {
	var req dto.VerificationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, r, errors.NewValidationError("Invalid request body", nil))
		return
	}

	logger.WithFields(map[string]interface{}{
		"email":        req.Email,
		"input_method": req.InputMethod,
		"request_id":   r.Context().Value(middleware.RequestIDKey),
	}).Info("Submitting verification request")

	// Submit verification
	verificationReq, err := h.service.SubmitVerification(r.Context(), req.Email, req.LicenseNumber, req.InputMethod)
	if err != nil {
		logger.WithFields(map[string]interface{}{
			"error":      err.Error(),
			"request_id": r.Context().Value(middleware.RequestIDKey),
		}).Error("Failed to submit verification")
		
		sendErrorResponse(w, r, errors.NewInternalError("Failed to submit verification", err))
		return
	}

	response := dto.VerificationResponse{
		ID:        verificationReq.ID,
		Status:    string(verificationReq.Status),
		Email:     verificationReq.Email,
		CreatedAt: verificationReq.CreatedAt,
		UpdatedAt: verificationReq.UpdatedAt,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

// GetVerificationStatus handles GET /api/verify/:id
func (h *VerificationHandler) GetVerificationStatus(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	logger.WithFields(map[string]interface{}{
		"verification_id": id,
		"request_id":      r.Context().Value(middleware.RequestIDKey),
	}).Info("Getting verification status")

	req, result, err := h.service.GetVerificationStatus(r.Context(), id)
	if err != nil {
		logger.WithFields(map[string]interface{}{
			"error":           err.Error(),
			"verification_id": id,
			"request_id":      r.Context().Value(middleware.RequestIDKey),
		}).Error("Failed to get verification status")

		sendErrorResponse(w, r, errors.NewNotFoundError("Verification request not found"))
		return
	}

	response := dto.VerificationStatusResponse{
		ID:        req.ID,
		Status:    string(req.Status),
		Email:     req.Email,
		CreatedAt: req.CreatedAt,
		UpdatedAt: req.UpdatedAt,
	}

	if result != nil {
		response.Approved = result.Approved
		response.Result = result.ResponseData
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// RetryVerification handles POST /api/verify/:id/retry
func (h *VerificationHandler) RetryVerification(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	logger.WithFields(map[string]interface{}{
		"verification_id": id,
		"request_id":      r.Context().Value(middleware.RequestIDKey),
	}).Info("Retrying verification")

	err := h.service.RetryVerification(r.Context(), id)
	if err != nil {
		logger.WithFields(map[string]interface{}{
			"error":           err.Error(),
			"verification_id": id,
			"request_id":      r.Context().Value(middleware.RequestIDKey),
		}).Error("Failed to retry verification")

		sendErrorResponse(w, r, errors.NewInternalError("Failed to retry verification", err))
		return
	}

	response := dto.RetryResponse{
		ID:      id,
		Status:  "pending",
		Message: "Verification retry initiated",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// HealthCheck handles GET /health
func HealthCheck(w http.ResponseWriter, r *http.Request) {
	response := dto.HealthCheckResponse{
		Status:    "ok",
		Timestamp: time.Now(),
		Version:   "1.0.0",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// sendErrorResponse sends a standardized error response
func sendErrorResponse(w http.ResponseWriter, r *http.Request, appErr *errors.AppError) {
	requestID := r.Context().Value(middleware.RequestIDKey)

	response := dto.ErrorResponse{
		Error: dto.ErrorDetail{
			Type:    string(appErr.Type),
			Message: appErr.Message,
			Details: appErr.Details,
		},
		Timestamp: time.Now(),
	}

	if requestID != nil {
		response.RequestID = requestID.(string)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(appErr.StatusCode)
	json.NewEncoder(w).Encode(response)
}
