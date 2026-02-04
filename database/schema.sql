-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Schema for user information (enhanced for tenant screening)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('tenant', 'landlord', 'admin')),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Landlord profiles and settings
CREATE TABLE landlord_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(200),
    license_number VARCHAR(100),
    properties_managed INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Landlord screening policies
CREATE TABLE screening_policies (
    id SERIAL PRIMARY KEY,
    landlord_id INT REFERENCES users(id) ON DELETE CASCADE,
    policy_name VARCHAR(100) NOT NULL,
    auto_deny_violent_crimes BOOLEAN DEFAULT true,
    auto_deny_property_crimes BOOLEAN DEFAULT true,
    auto_deny_drug_crimes BOOLEAN DEFAULT false,
    crime_lookback_years INT DEFAULT 7,
    minimum_credit_score INT DEFAULT 600,
    minimum_income_multiplier DECIMAL(3,1) DEFAULT 3.0,
    require_employment_verification BOOLEAN DEFAULT true,
    require_landlord_review_for_flags BOOLEAN DEFAULT true,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Rental applications
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    tenant_id INT REFERENCES users(id),
    landlord_id INT REFERENCES users(id),
    email VARCHAR(100) NOT NULL,
    drivers_license VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (
        status IN ('PENDING', 'IDENTITY_VERIFICATION', 'EMPLOYMENT_VERIFICATION', 
                   'BACKGROUND_CHECK', 'PENDING_LANDLORD_REVIEW', 'APPROVED', 
                   'DENIED', 'APPEALED', 'WITHDRAWN')
    ),
    current_stage INT DEFAULT 1,
    total_stages INT DEFAULT 5,
    automated_decision VARCHAR(20) CHECK (automated_decision IN ('APPROVED', 'DENIED', 'FLAGGED')),
    final_decision VARCHAR(20) CHECK (final_decision IN ('APPROVED', 'DENIED', 'PENDING')),
    flags_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ
);

-- Identity verification results
CREATE TABLE identity_verifications (
    id SERIAL PRIMARY KEY,
    application_id INT UNIQUE REFERENCES applications(id) ON DELETE CASCADE,
    email_verified BOOLEAN DEFAULT false,
    license_verified BOOLEAN DEFAULT false,
    verification_method VARCHAR(50),
    verification_status VARCHAR(20) CHECK (verification_status IN ('PASSED', 'FAILED', 'PENDING')),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Employment & income verification results
CREATE TABLE employment_verifications (
    id SERIAL PRIMARY KEY,
    application_id INT UNIQUE REFERENCES applications(id) ON DELETE CASCADE,
    employer_name VARCHAR(200),
    employment_status VARCHAR(50),
    job_title VARCHAR(100),
    monthly_income DECIMAL(10,2),
    employment_start_date DATE,
    verification_source VARCHAR(100) DEFAULT 'Equifax Work Number',
    verification_status VARCHAR(20) CHECK (verification_status IN ('VERIFIED', 'FAILED', 'PENDING')),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Background check results
CREATE TABLE background_checks (
    id SERIAL PRIMARY KEY,
    application_id INT UNIQUE REFERENCES applications(id) ON DELETE CASCADE,
    criminal_record_found BOOLEAN DEFAULT false,
    criminal_record_details JSONB,
    credit_score INT,
    credit_report_summary JSONB,
    eviction_history_found BOOLEAN DEFAULT false,
    eviction_details JSONB,
    check_status VARCHAR(20) CHECK (check_status IN ('COMPLETED', 'FAILED', 'PENDING')),
    flags_raised INT DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Landlord review and decisions
CREATE TABLE landlord_reviews (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES applications(id) ON DELETE CASCADE,
    landlord_id INT REFERENCES users(id),
    review_type VARCHAR(50) CHECK (review_type IN ('INITIAL', 'OVERRIDE', 'APPEAL')),
    decision VARCHAR(20) CHECK (decision IN ('APPROVED', 'DENIED', 'PENDING')),
    reasoning TEXT,
    override_automated BOOLEAN DEFAULT false,
    reviewed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Application audit trail
CREATE TABLE application_audit_log (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES applications(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    performed_by INT REFERENCES users(id),
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Appeals
CREATE TABLE appeals (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES applications(id) ON DELETE CASCADE,
    tenant_id INT REFERENCES users(id),
    appeal_reason TEXT NOT NULL,
    supporting_documents JSONB,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'DENIED', 'WITHDRAWN')),
    landlord_response TEXT,
    responded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Integration credentials (encrypted storage)
CREATE TABLE integration_credentials (
    id SERIAL PRIMARY KEY,
    landlord_id INT REFERENCES users(id) ON DELETE CASCADE,
    service_name VARCHAR(100) NOT NULL,
    credentials_encrypted TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Schema for locations (existing)
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    geom GEOGRAPHY(Point, 4326),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Schema for activities linked to locations (existing)
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    location_id INT REFERENCES locations(id),
    description TEXT NOT NULL,
    activity_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_locations_geom ON locations USING GIST(geom);
CREATE INDEX idx_applications_tenant ON applications(tenant_id);
CREATE INDEX idx_applications_landlord ON applications(landlord_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_screening_policies_landlord ON screening_policies(landlord_id);
CREATE INDEX idx_audit_log_application ON application_audit_log(application_id);
CREATE INDEX idx_background_checks_criminal ON background_checks(criminal_record_found);
CREATE INDEX idx_applications_created ON applications(created_at DESC);