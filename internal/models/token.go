package models

import "time"

type ReapplicationToken struct {
	ID          int       `json:"id"`
	Token       string    `json:"token"`
	LandlordID  int       `json:"landlord_id"`
	UnitID      int       `json:"unit_id"`
	TenantEmail string    `json:"tenant_email"`
	ExpiresAt   time.Time `json:"expires_at"`
	UsedAt      *time.Time `json:"used_at,omitempty"`
	IsUsed      bool      `json:"is_used"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type ActivityLog struct {
	ID         int                    `json:"id"`
	EntityType string                 `json:"entity_type"`
	EntityID   int                    `json:"entity_id"`
	Action     string                 `json:"action"`
	ActorType  string                 `json:"actor_type,omitempty"`
	ActorID    int                    `json:"actor_id,omitempty"`
	Metadata   map[string]interface{} `json:"metadata,omitempty"`
	IPAddress  string                 `json:"ip_address,omitempty"`
	CreatedAt  time.Time              `json:"created_at"`
}
