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

-- Schema for tenant verifications
CREATE TABLE tenant_verifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    email VARCHAR(100) NOT NULL,
    license_number VARCHAR(50),
    verification_status VARCHAR(50) NOT NULL CHECK (verification_status IN ('pending', 'approved', 'denied', 'data_freeze', 'error')),
    error_type VARCHAR(100),
    error_message TEXT,
    retry_count INT DEFAULT 0,
    equifax_response JSONB, -- Store the full Equifax API response
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries on user_id and status
CREATE INDEX idx_tenant_verifications_user_id ON tenant_verifications(user_id);
CREATE INDEX idx_tenant_verifications_status ON tenant_verifications(verification_status);

-- Schema for verification attempt logs (analytics)
CREATE TABLE verification_attempt_logs (
    id SERIAL PRIMARY KEY,
    verification_id INT REFERENCES tenant_verifications(id),
    attempt_number INT NOT NULL,
    attempt_status VARCHAR(50) NOT NULL, -- 'success', 'failed', 'data_freeze'
    error_type VARCHAR(100),
    error_details TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Index for analytics queries
CREATE INDEX idx_verification_logs_verification_id ON verification_attempt_logs(verification_id);
CREATE INDEX idx_verification_logs_status ON verification_attempt_logs(attempt_status);