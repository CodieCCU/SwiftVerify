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

-- Schema for driver's license verification
CREATE TABLE driver_licenses (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    license_number VARCHAR(50) NOT NULL,
    verification_method VARCHAR(20) CHECK (verification_method IN ('manual', 'scan')),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Schema for properties
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    address VARCHAR(300),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Schema for rental applications and verification results
CREATE TABLE verification_results (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    license_id INT REFERENCES driver_licenses(id),
    property_id INT REFERENCES properties(id),
    unit_number VARCHAR(50),
    tenant_income DECIMAL(10, 2),
    apartment_cost DECIMAL(10, 2),
    approved BOOLEAN DEFAULT FALSE,
    gap_waiver_needed BOOLEAN DEFAULT FALSE,
    additional_funding_provided BOOLEAN DEFAULT FALSE,
    funding_amount DECIMAL(10, 2) DEFAULT 0,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_driver_licenses_user_id ON driver_licenses(user_id);
CREATE INDEX idx_verification_results_user_id ON verification_results(user_id);
CREATE INDEX idx_verification_results_license_id ON verification_results(license_id);