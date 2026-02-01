package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/CodieCCU/SwiftVerify/internal/db"
	"github.com/CodieCCU/SwiftVerify/internal/models"
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

		if tokenModel.ExpiresAt.Before(http.TimeFunc()) {
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

	// In production, encrypt sensitive data before storing
	// For demonstration, we'll store them with a simple prefix
	app := &models.Application{
		UnitID:                        req.UnitID,
		Email:                         req.Email,
		Status:                        "pending",
		DriversLicenseNumberEncrypted: "encrypted:" + req.DriversLicenseNumber,
		SSNEncrypted:                  "encrypted:" + req.SSN,
		CurrentAddressEncrypted:       "encrypted:" + req.CurrentAddress,
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
