-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Schema for user information
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Schema for locations
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    geom GEOGRAPHY(Point, 4326),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Schema for activities linked to locations
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    location_id INT REFERENCES locations(id),
    description TEXT NOT NULL,
    activity_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexing geography columns for performance
CREATE INDEX idx_locations_geom ON locations USING GIST(geom);

-- ========================================
-- SWIFTVERIFY NO CREDIT CHECK SCHEMA
-- ========================================

-- Landlord Agreement Table
-- Tracks acceptance of NO CREDIT CHECK agreement
CREATE TABLE landlord_agreements (
    id SERIAL PRIMARY KEY,
    landlord_id INT REFERENCES users(id),
    landlord_name VARCHAR(255) NOT NULL,
    landlord_email VARCHAR(255) NOT NULL,
    property_management_company VARCHAR(255),
    agreement_version VARCHAR(50) NOT NULL DEFAULT '1.0',
    accepted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    
    -- Individual acknowledgment flags
    ack_read_and_understand BOOLEAN NOT NULL DEFAULT FALSE,
    ack_no_credit_check_system BOOLEAN NOT NULL DEFAULT FALSE,
    ack_without_credit_evaluation BOOLEAN NOT NULL DEFAULT FALSE,
    ack_will_not_conduct_credit_checks BOOLEAN NOT NULL DEFAULT FALSE,
    ack_before_and_after BOOLEAN NOT NULL DEFAULT FALSE,
    ack_account_termination BOOLEAN NOT NULL DEFAULT FALSE,
    ack_rental_decision_criteria BOOLEAN NOT NULL DEFAULT FALSE,
    ack_fair_housing_compliance BOOLEAN NOT NULL DEFAULT FALSE,
    
    legal_acknowledgment BOOLEAN NOT NULL DEFAULT FALSE,
    signature VARCHAR(255) NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure all acknowledgments are true
    CONSTRAINT all_acknowledgments_required CHECK (
        ack_read_and_understand = TRUE AND
        ack_no_credit_check_system = TRUE AND
        ack_without_credit_evaluation = TRUE AND
        ack_will_not_conduct_credit_checks = TRUE AND
        ack_before_and_after = TRUE AND
        ack_account_termination = TRUE AND
        ack_rental_decision_criteria = TRUE AND
        ack_fair_housing_compliance = TRUE AND
        legal_acknowledgment = TRUE
    )
);

CREATE INDEX idx_landlord_agreements_landlord_id ON landlord_agreements(landlord_id);
CREATE INDEX idx_landlord_agreements_email ON landlord_agreements(landlord_email);

-- Tenant Applications Table
-- NO CREDIT CHECK - Only identity, employment, and background data
CREATE TABLE tenant_applications (
    id SERIAL PRIMARY KEY,
    tenant_id INT REFERENCES users(id),
    landlord_id INT REFERENCES users(id),
    property_id INT REFERENCES locations(id),
    
    -- Application status workflow (NO CREDIT CHECK STAGE)
    -- SUBMITTED -> IDENTITY_VERIFIED -> EMPLOYMENT_VERIFIED -> 
    -- BACKGROUND_CHECKED (optional) -> LANDLORD_REVIEW_REQUIRED (if flags) ->
    -- FINAL_DECISION -> APPROVED/DENIED
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED',
    
    -- Identity Verification Data
    identity_verification JSONB DEFAULT '{
        "verified": false,
        "driver_license_number": "",
        "driver_license_state": "",
        "date_of_birth": "",
        "full_name": "",
        "address": "",
        "verification_date": null,
        "verification_method": "driver_license"
    }'::jsonb,
    
    -- Employment & Income Verification (NO CREDIT DATA)
    employment_verification JSONB DEFAULT '{
        "verified": false,
        "employer_name": "",
        "employer_contact": "",
        "monthly_income": 0,
        "employment_start_date": "",
        "employment_status": "active",
        "verification_date": null,
        "verification_source": "equifax_work_number"
    }'::jsonb,
    
    -- Criminal Background Check (Optional)
    background_check JSONB DEFAULT '{
        "requested": false,
        "completed": false,
        "results": {},
        "criminal_records_found": false,
        "sex_offender_registry": false,
        "completion_date": null
    }'::jsonb,
    
    -- Landlord Review & Decision
    landlord_review_notes TEXT,
    decision VARCHAR(20), -- APPROVED or DENIED
    decision_reason TEXT,
    decision_date TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_status CHECK (
        status IN (
            'SUBMITTED',
            'IDENTITY_VERIFIED',
            'EMPLOYMENT_VERIFIED',
            'BACKGROUND_CHECKED',
            'LANDLORD_REVIEW_REQUIRED',
            'FINAL_DECISION',
            'APPROVED',
            'DENIED'
        )
    ),
    CONSTRAINT valid_decision CHECK (
        decision IS NULL OR decision IN ('APPROVED', 'DENIED')
    )
);

CREATE INDEX idx_tenant_applications_tenant_id ON tenant_applications(tenant_id);
CREATE INDEX idx_tenant_applications_landlord_id ON tenant_applications(landlord_id);
CREATE INDEX idx_tenant_applications_status ON tenant_applications(status);
CREATE INDEX idx_tenant_applications_created_at ON tenant_applications(created_at DESC);

-- Audit Trail for Compliance
-- Logs any suspicious activity or agreement violations
CREATE TABLE compliance_audit_log (
    id SERIAL PRIMARY KEY,
    landlord_id INT REFERENCES users(id),
    event_type VARCHAR(100) NOT NULL,
    event_description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'INFO', -- INFO, WARNING, CRITICAL
    ip_address VARCHAR(45),
    user_agent TEXT,
    additional_data JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_severity CHECK (
        severity IN ('INFO', 'WARNING', 'CRITICAL')
    )
);

CREATE INDEX idx_compliance_audit_landlord_id ON compliance_audit_log(landlord_id);
CREATE INDEX idx_compliance_audit_event_type ON compliance_audit_log(event_type);
CREATE INDEX idx_compliance_audit_severity ON compliance_audit_log(severity);
CREATE INDEX idx_compliance_audit_created_at ON compliance_audit_log(created_at DESC);

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_landlord_agreements_updated_at BEFORE UPDATE ON landlord_agreements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_applications_updated_at BEFORE UPDATE ON tenant_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();