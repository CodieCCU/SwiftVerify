-- Migration: Create verification tables
-- Description: Tables for storing verification requests, results, and error logs
-- Version: 001
-- Date: 2026-02-02

-- Create verification_requests table
CREATE TABLE IF NOT EXISTS verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    license_number TEXT NOT NULL, -- Should be encrypted in production
    input_method VARCHAR(50) NOT NULL CHECK (input_method IN ('manual', 'scan')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for quick lookups
CREATE INDEX IF NOT EXISTS idx_verification_requests_email ON verification_requests(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_verification_requests_status ON verification_requests(status);

-- Create index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_verification_requests_created_at ON verification_requests(created_at DESC);

-- Create verification_results table
CREATE TABLE IF NOT EXISTS verification_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_request_id UUID NOT NULL REFERENCES verification_requests(id) ON DELETE CASCADE,
    approved BOOLEAN NOT NULL DEFAULT false,
    response_data JSONB,
    provider_status VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(verification_request_id)
);

-- Create index on verification_request_id for quick lookups
CREATE INDEX IF NOT EXISTS idx_verification_results_request_id ON verification_results(verification_request_id);

-- Create verification_error_logs table
CREATE TABLE IF NOT EXISTS verification_error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_request_id UUID NOT NULL REFERENCES verification_requests(id) ON DELETE CASCADE,
    error_type VARCHAR(100) NOT NULL,
    error_message TEXT NOT NULL,
    error_details JSONB,
    retryable BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on verification_request_id for quick lookups
CREATE INDEX IF NOT EXISTS idx_verification_error_logs_request_id ON verification_error_logs(verification_request_id);

-- Create index on error_type for filtering
CREATE INDEX IF NOT EXISTS idx_verification_error_logs_error_type ON verification_error_logs(error_type);

-- Create index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_verification_error_logs_created_at ON verification_error_logs(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for verification_requests
CREATE TRIGGER update_verification_requests_updated_at BEFORE UPDATE ON verification_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for verification_results
CREATE TRIGGER update_verification_results_updated_at BEFORE UPDATE ON verification_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
