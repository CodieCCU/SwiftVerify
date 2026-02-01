package models

import "time"

type Landlord struct {
	ID           int       `json:"id"`
	Username     string    `json:"username"`
	Email        string    `json:"email"`
	CompanyName  string    `json:"company_name,omitempty"`
	PasswordHash string    `json:"-"` // Never expose password hash
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type Property struct {
	ID         int       `json:"id"`
	LandlordID int       `json:"landlord_id"`
	Name       string    `json:"name"`
	Address    string    `json:"address"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type Unit struct {
	ID            int     `json:"id"`
	PropertyID    int     `json:"property_id"`
	UnitNumber    string  `json:"unit_number"`
	RentAmount    float64 `json:"rent_amount"`
	UtilitiesCost float64 `json:"utilities_cost"`
	Bedrooms      int     `json:"bedrooms"`
	Bathrooms     float64 `json:"bathrooms"`
	Status        string  `json:"status"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
