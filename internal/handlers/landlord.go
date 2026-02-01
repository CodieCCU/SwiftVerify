package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/CodieCCU/SwiftVerify/internal/db"
	"github.com/CodieCCU/SwiftVerify/internal/models"
	"github.com/gorilla/mux"
)

type LandlordHandler struct {
	db *db.Database
}

func NewLandlordHandler(database *db.Database) *LandlordHandler {
	return &LandlordHandler{db: database}
}

// GetApplications returns all applications for a landlord
func (h *LandlordHandler) GetApplications(w http.ResponseWriter, r *http.Request) {
	// In production, get landlordID from authenticated session
	// For now, using a query parameter
	landlordIDStr := r.URL.Query().Get("landlord_id")
	if landlordIDStr == "" {
		http.Error(w, "landlord_id required", http.StatusBadRequest)
		return
	}

	landlordID, err := strconv.Atoi(landlordIDStr)
	if err != nil {
		http.Error(w, "Invalid landlord_id", http.StatusBadRequest)
		return
	}

	summaries, err := h.db.GetLandlordApplications(landlordID)
	if err != nil {
		http.Error(w, "Failed to retrieve applications", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(summaries)
}

// CreateReapplicationLink creates a secure reapplication link
func (h *LandlordHandler) CreateReapplicationLink(w http.ResponseWriter, r *http.Request) {
	var req struct {
		LandlordID  int    `json:"landlord_id"`
		UnitID      int    `json:"unit_id"`
		TenantEmail string `json:"tenant_email"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate inputs
	if req.LandlordID <= 0 || req.UnitID <= 0 || req.TenantEmail == "" {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	// Create token
	token, err := h.db.CreateReapplicationToken(req.LandlordID, req.UnitID, req.TenantEmail)
	if err != nil {
		http.Error(w, "Failed to create reapplication link", http.StatusInternalServerError)
		return
	}

	// Log activity
	h.db.LogActivity(&models.ActivityLog{
		EntityType: "token",
		EntityID:   token.ID,
		Action:     "generated",
		ActorType:  "landlord",
		ActorID:    req.LandlordID,
		Metadata: map[string]interface{}{
			"unit_id":      req.UnitID,
			"tenant_email": req.TenantEmail,
		},
		IPAddress: r.RemoteAddr,
	})

	// Return token info (in production, also send email)
	response := map[string]interface{}{
		"success": true,
		"token":   token.Token,
		"link":    "/reapply?token=" + token.Token,
		"expires_at": token.ExpiresAt,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// ValidateToken validates a reapplication token
func (h *LandlordHandler) ValidateToken(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	token := vars["token"]

	if token == "" {
		http.Error(w, "Token required", http.StatusBadRequest)
		return
	}

	tokenModel, err := h.db.ValidateAndGetToken(token)
	if err != nil {
		http.Error(w, "Invalid token", http.StatusNotFound)
		return
	}

	// Check if token is expired
	if tokenModel.ExpiresAt.Before(http.TimeFunc()) {
		http.Error(w, "Token expired", http.StatusGone)
		return
	}

	// Check if token is already used
	if tokenModel.IsUsed {
		http.Error(w, "Token already used", http.StatusGone)
		return
	}

	// Get unit information
	unit, err := h.db.GetUnitByID(tokenModel.UnitID)
	if err != nil {
		http.Error(w, "Unit not found", http.StatusNotFound)
		return
	}

	// Log token view
	h.db.LogActivity(&models.ActivityLog{
		EntityType: "token",
		EntityID:   tokenModel.ID,
		Action:     "viewed",
		IPAddress:  r.RemoteAddr,
	})

	// Return token validation response with unit info
	response := map[string]interface{}{
		"valid":        true,
		"tenant_email": tokenModel.TenantEmail,
		"unit": map[string]interface{}{
			"id":             unit.ID,
			"unit_number":    unit.UnitNumber,
			"rent_amount":    unit.RentAmount,
			"utilities_cost": unit.UtilitiesCost,
			"bedrooms":       unit.Bedrooms,
			"bathrooms":      unit.Bathrooms,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
