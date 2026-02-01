-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Schema for user information
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    mfa_enabled BOOLEAN DEFAULT TRUE,
    mfa_secret VARCHAR(255),
    role VARCHAR(20) DEFAULT 'user',
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

-- Schema for verification requests
CREATE TABLE verification_requests (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    email VARCHAR(100) NOT NULL,
    license_number VARCHAR(100),
    income_proof_path VARCHAR(255),
    staff_assisted BOOLEAN DEFAULT FALSE,
    low_deposit_mode BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'pending',
    approved BOOLEAN,
    verification_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Schema for uploaded documents
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    verification_id INT REFERENCES verification_requests(id),
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT,
    encrypted BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Schema for audit logs
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    user_id INT REFERENCES users(id),
    username VARCHAR(50),
    ip_address VARCHAR(45),
    details TEXT,
    device_info TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Schema for MFA sessions
CREATE TABLE mfa_sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(50) NOT NULL,
    code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Schema for shared device sessions (for kiosk mode)
CREATE TABLE shared_device_sessions (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(100) NOT NULL,
    location_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    last_activity TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexing geography columns for performance
CREATE INDEX idx_locations_geom ON locations USING GIST(geom);

-- Indexing for better query performance
CREATE INDEX idx_verification_requests_user_id ON verification_requests(user_id);
CREATE INDEX idx_verification_requests_status ON verification_requests(status);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_verification_id ON documents(verification_id);
CREATE INDEX idx_mfa_sessions_session_id ON mfa_sessions(session_id);
CREATE INDEX idx_shared_device_sessions_device_id ON shared_device_sessions(device_id);