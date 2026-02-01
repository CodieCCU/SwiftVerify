package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/CodieCCU/SwiftVerify/internal/db"
	"github.com/CodieCCU/SwiftVerify/internal/models"
	"github.com/CodieCCU/SwiftVerify/internal/utils"
)

type ApplicationHandler struct {
	db *db.Database
}

func NewApplicationHandler(database *db.Database) *ApplicationHandler {
	return &ApplicationHandler{db: database}
}

// SubmitApplication handles tenant application submissions
func (h *ApplicationHandler) SubmitApplication(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Token                string `json:"token,omitempty"`
		UnitID               int    `json:"unit_id"`
		Email                string `json:"email"`
		DriversLicenseNumber string `json:"drivers_license_number"`
		SSN                  string `json:"ssn"`
		CurrentAddress       string `json:"current_address"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// If token is provided, validate it
	var tokenModel *models.ReapplicationToken
	if req.Token != "" {
		var err error
		tokenModel, err = h.db.ValidateAndGetToken(req.Token)
		if err != nil {
			http.Error(w, "Invalid token", http.StatusBadRequest)
			return
		}

		// Verify token is valid
		if tokenModel.IsUsed {
			http.Error(w, "Token already used", http.StatusGone)
			return
		}

		if tokenModel.ExpiresAt.Before(time.Now()) {
			http.Error(w, "Token expired", http.StatusGone)
			return
		}

		// Verify email matches
		if tokenModel.TenantEmail != req.Email {
			http.Error(w, "Email does not match token", http.StatusBadRequest)
			return
		}

		// Use unit ID from token
		req.UnitID = tokenModel.UnitID
	}

	// Encrypt sensitive data before storing
	encryptedDL, err := utils.EncryptData(req.DriversLicenseNumber)
	if err != nil {
		http.Error(w, "Failed to encrypt data", http.StatusInternalServerError)
		return
	}

	encryptedSSN, err := utils.EncryptData(req.SSN)
	if err != nil {
		http.Error(w, "Failed to encrypt data", http.StatusInternalServerError)
		return
	}

	encryptedAddress, err := utils.EncryptData(req.CurrentAddress)
	if err != nil {
		http.Error(w, "Failed to encrypt data", http.StatusInternalServerError)
		return
	}

	app := &models.Application{
		UnitID:                        req.UnitID,
		Email:                         req.Email,
		Status:                        "pending",
		DriversLicenseNumberEncrypted: encryptedDL,
		SSNEncrypted:                  encryptedSSN,
		CurrentAddressEncrypted:       encryptedAddress,
	}

	if err := h.db.CreateApplication(app); err != nil {
		http.Error(w, "Failed to create application", http.StatusInternalServerError)
		return
	}

	// If using a token, mark it as used
	if tokenModel != nil {
		if err := h.db.MarkTokenAsUsed(tokenModel.ID); err != nil {
			// Log error but don't fail the request
			// Application was already created successfully
		}

		// Log token usage
		h.db.LogActivity(&models.ActivityLog{
			EntityType: "token",
			EntityID:   tokenModel.ID,
			Action:     "used",
			Metadata: map[string]interface{}{
				"application_id": app.ID,
			},
			IPAddress: r.RemoteAddr,
		})
	}

	// Log application submission
	h.db.LogActivity(&models.ActivityLog{
		EntityType: "application",
		EntityID:   app.ID,
		Action:     "submitted",
		Metadata: map[string]interface{}{
			"unit_id": req.UnitID,
			"via_token": tokenModel != nil,
		},
		IPAddress: r.RemoteAddr,
	})

	response := map[string]interface{}{
		"success":        true,
		"application_id": app.ID,
		"status":         app.Status,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
