package models

import "time"

type Application struct {
	ID                            int       `json:"id"`
	UserID                        int       `json:"user_id,omitempty"`
	UnitID                        int       `json:"unit_id"`
	Status                        string    `json:"status"`
	Email                         string    `json:"email"`
	// Encrypted fields - never sent to frontend
	DriversLicenseNumberEncrypted string    `json:"-"`
	SSNEncrypted                  string    `json:"-"`
	CurrentAddressEncrypted       string    `json:"-"`
	ApplicationDate               time.Time `json:"application_date"`
	CreatedAt                     time.Time `json:"created_at"`
	UpdatedAt                     time.Time `json:"updated_at"`
}

// ApplicationSummary is the landlord-safe view of an application
// It contains only non-sensitive information
type ApplicationSummary struct {
	ID              int       `json:"id"`
	UnitID          int       `json:"unit_id"`
	UnitNumber      string    `json:"unit_number"`
	PropertyName    string    `json:"property_name"`
	Status          string    `json:"status"`
	RentAmount      float64   `json:"rent_amount"`
	UtilitiesCost   float64   `json:"utilities_cost"`
	ApplicationDate time.Time `json:"application_date"`
	// Partial email for identification (e.g., "j***@example.com")
	EmailPartial    string    `json:"email_partial,omitempty"`
}
