-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Schema for user information (tenants)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Schema for landlords/property managers
CREATE TABLE landlords (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    company_name VARCHAR(200),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Schema for properties
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    landlord_id INT REFERENCES landlords(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Schema for property units
CREATE TABLE units (
    id SERIAL PRIMARY KEY,
    property_id INT REFERENCES properties(id) ON DELETE CASCADE,
    unit_number VARCHAR(50) NOT NULL,
    rent_amount DECIMAL(10, 2) NOT NULL,
    utilities_cost DECIMAL(10, 2) DEFAULT 0,
    bedrooms INT,
    bathrooms DECIMAL(3, 1),
    status VARCHAR(20) DEFAULT 'available', -- available, occupied, maintenance
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(property_id, unit_number)
);

-- Schema for tenant applications
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    unit_id INT REFERENCES units(id),
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, denied
    email VARCHAR(100) NOT NULL,
    -- Encrypted sensitive data (not directly accessible to landlords)
    drivers_license_number_encrypted TEXT,
    ssn_encrypted TEXT,
    current_address_encrypted TEXT,
    -- Non-sensitive data visible to landlords
    application_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Schema for secure reapplication tokens
CREATE TABLE reapplication_tokens (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    landlord_id INT REFERENCES landlords(id) ON DELETE CASCADE,
    unit_id INT REFERENCES units(id) ON DELETE CASCADE,
    tenant_email VARCHAR(100) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Schema for activity logs (audit trail)
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL, -- token, application, etc.
    entity_id INT NOT NULL,
    action VARCHAR(100) NOT NULL, -- generated, viewed, used, etc.
    actor_type VARCHAR(50), -- landlord, tenant
    actor_id INT,
    metadata JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Schema for locations (original geolocation feature)
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    geom GEOGRAPHY(Point, 4326),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Schema for activities linked to locations (original feature)
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
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_unit_id ON applications(unit_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_reapplication_tokens_token ON reapplication_tokens(token);
CREATE INDEX idx_reapplication_tokens_expires_at ON reapplication_tokens(expires_at);
CREATE INDEX idx_reapplication_tokens_is_used ON reapplication_tokens(is_used);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);