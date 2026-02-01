package db

import (
	"database/sql"
	"encoding/json"
	"time"

	_ "github.com/lib/pq"
	"github.com/CodieCCU/SwiftVerify/internal/models"
	"github.com/CodieCCU/SwiftVerify/internal/utils"
)

type Database struct {
	conn *sql.DB
}

func NewDatabase(connStr string) (*Database, error) {
	conn, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	if err := conn.Ping(); err != nil {
		return nil, err
	}

	return &Database{conn: conn}, nil
}

func (db *Database) Close() error {
	return db.conn.Close()
}

// CreateReapplicationToken creates a new reapplication token
func (db *Database) CreateReapplicationToken(landlordID, unitID int, tenantEmail string) (*models.ReapplicationToken, error) {
	token, err := utils.GenerateSecureToken()
	if err != nil {
		return nil, err
	}

	expiresAt := utils.GetDefaultTokenExpiration()

	var tokenModel models.ReapplicationToken
	err = db.conn.QueryRow(`
		INSERT INTO reapplication_tokens (token, landlord_id, unit_id, tenant_email, expires_at)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, token, landlord_id, unit_id, tenant_email, expires_at, is_used, created_at, updated_at
	`, token, landlordID, unitID, tenantEmail, expiresAt).Scan(
		&tokenModel.ID,
		&tokenModel.Token,
		&tokenModel.LandlordID,
		&tokenModel.UnitID,
		&tokenModel.TenantEmail,
		&tokenModel.ExpiresAt,
		&tokenModel.IsUsed,
		&tokenModel.CreatedAt,
		&tokenModel.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &tokenModel, nil
}

// ValidateAndGetToken validates a token and returns it if valid
func (db *Database) ValidateAndGetToken(token string) (*models.ReapplicationToken, error) {
	var tokenModel models.ReapplicationToken
	var usedAt sql.NullTime

	err := db.conn.QueryRow(`
		SELECT id, token, landlord_id, unit_id, tenant_email, expires_at, used_at, is_used, created_at, updated_at
		FROM reapplication_tokens
		WHERE token = $1
	`, token).Scan(
		&tokenModel.ID,
		&tokenModel.Token,
		&tokenModel.LandlordID,
		&tokenModel.UnitID,
		&tokenModel.TenantEmail,
		&tokenModel.ExpiresAt,
		&usedAt,
		&tokenModel.IsUsed,
		&tokenModel.CreatedAt,
		&tokenModel.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	if usedAt.Valid {
		tokenModel.UsedAt = &usedAt.Time
	}

	return &tokenModel, nil
}

// MarkTokenAsUsed marks a token as used
func (db *Database) MarkTokenAsUsed(tokenID int) error {
	_, err := db.conn.Exec(`
		UPDATE reapplication_tokens
		SET is_used = true, used_at = $1, updated_at = $1
		WHERE id = $2
	`, time.Now(), tokenID)
	return err
}

// GetLandlordApplications retrieves application summaries for a landlord
func (db *Database) GetLandlordApplications(landlordID int) ([]models.ApplicationSummary, error) {
	rows, err := db.conn.Query(`
		SELECT 
			a.id,
			a.unit_id,
			u.unit_number,
			p.name as property_name,
			a.status,
			u.rent_amount,
			u.utilities_cost,
			a.application_date,
			a.email
		FROM applications a
		INNER JOIN units u ON a.unit_id = u.id
		INNER JOIN properties p ON u.property_id = p.id
		WHERE p.landlord_id = $1
		ORDER BY a.application_date DESC
	`, landlordID)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var summaries []models.ApplicationSummary
	for rows.Next() {
		var summary models.ApplicationSummary
		var email string

		err := rows.Scan(
			&summary.ID,
			&summary.UnitID,
			&summary.UnitNumber,
			&summary.PropertyName,
			&summary.Status,
			&summary.RentAmount,
			&summary.UtilitiesCost,
			&summary.ApplicationDate,
			&email,
		)

		if err != nil {
			return nil, err
		}

		// Mask email for privacy
		summary.EmailPartial = utils.MaskEmail(email)
		summaries = append(summaries, summary)
	}

	return summaries, nil
}

// CreateApplication creates a new tenant application
func (db *Database) CreateApplication(app *models.Application) error {
	return db.conn.QueryRow(`
		INSERT INTO applications (user_id, unit_id, status, email, drivers_license_number_encrypted, ssn_encrypted, current_address_encrypted)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, application_date, created_at, updated_at
	`, app.UserID, app.UnitID, app.Status, app.Email, app.DriversLicenseNumberEncrypted, app.SSNEncrypted, app.CurrentAddressEncrypted).Scan(
		&app.ID,
		&app.ApplicationDate,
		&app.CreatedAt,
		&app.UpdatedAt,
	)
}

// LogActivity logs an activity for audit purposes
func (db *Database) LogActivity(log *models.ActivityLog) error {
	var metadataJSON []byte
	var err error
	
	if log.Metadata != nil {
		metadataJSON, err = json.Marshal(log.Metadata)
		if err != nil {
			return err
		}
	}

	_, err = db.conn.Exec(`
		INSERT INTO activity_logs (entity_type, entity_id, action, actor_type, actor_id, metadata, ip_address)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`, log.EntityType, log.EntityID, log.Action, log.ActorType, log.ActorID, metadataJSON, log.IPAddress)

	return err
}

// GetUnitByID retrieves a unit by ID
func (db *Database) GetUnitByID(unitID int) (*models.Unit, error) {
	var unit models.Unit
	err := db.conn.QueryRow(`
		SELECT id, property_id, unit_number, rent_amount, utilities_cost, bedrooms, bathrooms, status, created_at, updated_at
		FROM units
		WHERE id = $1
	`, unitID).Scan(
		&unit.ID,
		&unit.PropertyID,
		&unit.UnitNumber,
		&unit.RentAmount,
		&unit.UtilitiesCost,
		&unit.Bedrooms,
		&unit.Bathrooms,
		&unit.Status,
		&unit.CreatedAt,
		&unit.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &unit, nil
}
