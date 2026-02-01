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

-- Enable pg_cron extension for automated tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schema for Driver's License records with lifecycle management
CREATE TABLE drivers_licenses (
    id SERIAL PRIMARY KEY,
    record_reference_id VARCHAR(64) UNIQUE NOT NULL, -- Hashed/obfuscated identifier
    user_id INT REFERENCES users(id),
    email VARCHAR(100) NOT NULL,
    license_number_encrypted TEXT NOT NULL, -- Encrypted license number
    license_data_encrypted TEXT, -- Additional encrypted license data
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expiration_date TIMESTAMPTZ NOT NULL, -- Auto-calculated as created_at + 30 days
    deleted_at TIMESTAMPTZ, -- Soft delete timestamp
    encryption_key_id VARCHAR(64) -- Reference to encryption key
);

-- Immutable audit log for all Driver's License operations (WORM-style)
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    record_reference_id VARCHAR(64) NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'CREATED', 'TAGGED', 'DELETED', 'NOTIFICATION_SENT'
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    details JSONB, -- Additional context about the action
    user_agent TEXT,
    ip_address INET
);

-- Index for faster audit log queries
CREATE INDEX idx_audit_logs_record_ref ON audit_logs(record_reference_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- Table for tracking deletion notifications
CREATE TABLE deletion_notifications (
    id SERIAL PRIMARY KEY,
    record_reference_id VARCHAR(64) NOT NULL,
    email VARCHAR(100) NOT NULL,
    notification_sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    notification_status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'SENT', 'FAILED'
    retry_count INT DEFAULT 0,
    error_message TEXT,
    CONSTRAINT chk_notification_status CHECK (notification_status IN ('PENDING', 'SENT', 'FAILED'))
);

-- Index for tracking notification status
CREATE INDEX idx_deletion_notifications_status ON deletion_notifications(notification_status);
CREATE INDEX idx_deletion_notifications_record_ref ON deletion_notifications(record_reference_id);

-- Table for deletion job execution logs
CREATE TABLE deletion_job_logs (
    id SERIAL PRIMARY KEY,
    job_execution_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    records_deleted INT DEFAULT 0,
    records_failed INT DEFAULT 0,
    execution_status VARCHAR(20) DEFAULT 'COMPLETED', -- 'COMPLETED', 'FAILED', 'PARTIAL'
    error_details TEXT,
    CONSTRAINT chk_execution_status CHECK (execution_status IN ('COMPLETED', 'FAILED', 'PARTIAL'))
);

-- Function to automatically set expiration_date
CREATE OR REPLACE FUNCTION set_expiration_date()
RETURNS TRIGGER AS $$
BEGIN
    NEW.expiration_date := NEW.created_at + INTERVAL '30 days';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set expiration_date on insert
CREATE TRIGGER trigger_set_expiration_date
    BEFORE INSERT ON drivers_licenses
    FOR EACH ROW
    EXECUTE FUNCTION set_expiration_date();

-- Function to perform automated deletion with audit logging
CREATE OR REPLACE FUNCTION delete_expired_drivers_licenses()
RETURNS TABLE(deleted_count INT, failed_count INT) AS $$
DECLARE
    v_deleted_count INT := 0;
    v_failed_count INT := 0;
    v_record RECORD;
    v_job_log_id INT;
BEGIN
    -- Create job log entry
    INSERT INTO deletion_job_logs (job_execution_time, execution_status)
    VALUES (CURRENT_TIMESTAMP, 'COMPLETED')
    RETURNING id INTO v_job_log_id;
    
    -- Find and delete expired records
    FOR v_record IN 
        SELECT id, record_reference_id, email
        FROM drivers_licenses
        WHERE expiration_date <= CURRENT_TIMESTAMP
        AND deleted_at IS NULL
    LOOP
        BEGIN
            -- Mark record as deleted (soft delete)
            UPDATE drivers_licenses
            SET deleted_at = CURRENT_TIMESTAMP
            WHERE id = v_record.id;
            
            -- Log the deletion in audit_logs
            INSERT INTO audit_logs (record_reference_id, action, details)
            VALUES (
                v_record.record_reference_id,
                'DELETED',
                jsonb_build_object(
                    'deletion_timestamp', CURRENT_TIMESTAMP,
                    'deletion_type', 'AUTOMATED',
                    'job_log_id', v_job_log_id
                )
            );
            
            -- Create notification record
            INSERT INTO deletion_notifications (record_reference_id, email)
            VALUES (v_record.record_reference_id, v_record.email);
            
            v_deleted_count := v_deleted_count + 1;
            
        EXCEPTION WHEN OTHERS THEN
            v_failed_count := v_failed_count + 1;
            
            -- Log the failure
            INSERT INTO audit_logs (record_reference_id, action, details)
            VALUES (
                v_record.record_reference_id,
                'DELETION_FAILED',
                jsonb_build_object(
                    'error_message', SQLERRM,
                    'error_state', SQLSTATE
                )
            );
        END;
    END LOOP;
    
    -- Update job log with results
    UPDATE deletion_job_logs
    SET 
        records_deleted = v_deleted_count,
        records_failed = v_failed_count,
        execution_status = CASE 
            WHEN v_failed_count = 0 THEN 'COMPLETED'
            WHEN v_deleted_count = 0 THEN 'FAILED'
            ELSE 'PARTIAL'
        END
    WHERE id = v_job_log_id;
    
    RETURN QUERY SELECT v_deleted_count, v_failed_count;
END;
$$ LANGUAGE plpgsql;

-- Schedule automated deletion job to run daily at 2 AM UTC
-- Note: pg_cron needs to be installed and configured
SELECT cron.schedule(
    'delete-expired-drivers-licenses',
    '0 2 * * *', -- Daily at 2 AM UTC
    $$SELECT delete_expired_drivers_licenses();$$
);

-- Index for faster expiration queries
CREATE INDEX idx_drivers_licenses_expiration ON drivers_licenses(expiration_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_drivers_licenses_created_at ON drivers_licenses(created_at);
CREATE INDEX idx_drivers_licenses_deleted_at ON drivers_licenses(deleted_at);