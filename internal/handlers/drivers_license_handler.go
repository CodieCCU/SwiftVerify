package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/CodieCCU/SwiftVerify/internal/database"
	"github.com/CodieCCU/SwiftVerify/internal/models"
	"github.com/CodieCCU/SwiftVerify/internal/services"
	"github.com/CodieCCU/SwiftVerify/internal/utils"
)

// DriversLicenseHandler handles driver's license related requests
type DriversLicenseHandler struct {
	db                  *database.DB
	encryptionService   *utils.EncryptionService
	notificationService *services.NotificationService
}

// NewDriversLicenseHandler creates a new handler
func NewDriversLicenseHandler(db *database.DB, encryptionService *utils.EncryptionService, notificationService *services.NotificationService) *DriversLicenseHandler {
	return &DriversLicenseHandler{
		db:                  db,
		encryptionService:   encryptionService,
		notificationService: notificationService,
	}
}

// CreateDriversLicense handles POST /api/drivers-license
func (h *DriversLicenseHandler) CreateDriversLicense(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.DriversLicenseRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if req.Email == "" || req.LicenseNumber == "" {
		http.Error(w, "Email and license number are required", http.StatusBadRequest)
		return
	}

	// Generate record reference ID
	recordRefID := utils.GenerateRecordReferenceID(req.Email, req.LicenseNumber)

	// Encrypt sensitive data
	encryptedLicense, err := h.encryptionService.Encrypt(req.LicenseNumber)
	if err != nil {
		log.Printf("Failed to encrypt license number: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	var encryptedData *string
	if req.LicenseData != "" {
		encrypted, err := h.encryptionService.Encrypt(req.LicenseData)
		if err != nil {
			log.Printf("Failed to encrypt license data: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
		encryptedData = &encrypted
	}

	// Create driver's license record
	dl := &models.DriversLicense{
		RecordReferenceID:      recordRefID,
		UserID:                 req.UserID,
		Email:                  req.Email,
		LicenseNumberEncrypted: encryptedLicense,
		LicenseDataEncrypted:   encryptedData,
		CreatedAt:              time.Now(),
	}

	err = h.db.CreateDriversLicense(dl)
	if err != nil {
		log.Printf("Failed to create driver's license record: %v", err)
		http.Error(w, "Failed to store driver's license", http.StatusInternalServerError)
		return
	}

	// Get client info for audit logging
	userAgent := r.Header.Get("User-Agent")
	ipAddr := r.RemoteAddr

	// Create audit log entry for creation
	err = h.db.LogAuditEntry(
		recordRefID,
		"CREATED",
		map[string]interface{}{
			"email":           req.Email,
			"created_at":      dl.CreatedAt,
			"expiration_date": dl.ExpirationDate,
		},
		&userAgent,
		&ipAddr,
	)
	if err != nil {
		log.Printf("Failed to create audit log: %v", err)
		// Continue even if audit log fails
	}

	// Send response
	response := models.DriversLicenseResponse{
		RecordReferenceID: recordRefID,
		Email:             req.Email,
		CreatedAt:         dl.CreatedAt,
		ExpirationDate:    dl.ExpirationDate,
		Message:           "Driver's license data stored successfully. Data will be automatically deleted after 30 days.",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

// GetAuditLogs handles GET /api/audit-logs
func (h *DriversLicenseHandler) GetAuditLogs(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get query parameters
	recordRefID := r.URL.Query().Get("record_reference_id")
	limitStr := r.URL.Query().Get("limit")
	offsetStr := r.URL.Query().Get("offset")

	limit := 50
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}

	offset := 0
	if offsetStr != "" {
		if o, err := strconv.Atoi(offsetStr); err == nil && o >= 0 {
			offset = o
		}
	}

	var recordRefPtr *string
	if recordRefID != "" {
		recordRefPtr = &recordRefID
	}

	logs, err := h.db.GetAuditLogs(recordRefPtr, limit, offset)
	if err != nil {
		log.Printf("Failed to get audit logs: %v", err)
		http.Error(w, "Failed to retrieve audit logs", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(logs)
}

// GetDeletionReport handles GET /api/deletion-reports
func (h *DriversLicenseHandler) GetDeletionReport(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get date parameter (defaults to today)
	dateStr := r.URL.Query().Get("date")
	var date time.Time
	var err error

	if dateStr != "" {
		date, err = time.Parse("2006-01-02", dateStr)
		if err != nil {
			http.Error(w, "Invalid date format. Use YYYY-MM-DD", http.StatusBadRequest)
			return
		}
	} else {
		date = time.Now()
	}

	report, err := h.db.GetDeletionReport(date)
	if err != nil {
		log.Printf("Failed to generate deletion report: %v", err)
		http.Error(w, "Failed to generate report", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(report)
}

// GetDeletionJobLogs handles GET /api/deletion-job-logs
func (h *DriversLicenseHandler) GetDeletionJobLogs(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	limitStr := r.URL.Query().Get("limit")
	limit := 30
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}

	logs, err := h.db.GetDeletionJobLogs(limit)
	if err != nil {
		log.Printf("Failed to get deletion job logs: %v", err)
		http.Error(w, "Failed to retrieve job logs", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(logs)
}

// ProcessNotifications handles POST /api/process-notifications
func (h *DriversLicenseHandler) ProcessNotifications(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	sent, failed, err := h.notificationService.ProcessPendingNotifications()
	if err != nil {
		log.Printf("Failed to process notifications: %v", err)
		http.Error(w, "Failed to process notifications", http.StatusInternalServerError)
		return
	}

	result := map[string]interface{}{
		"sent":   sent,
		"failed": failed,
		"total":  sent + failed,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}
