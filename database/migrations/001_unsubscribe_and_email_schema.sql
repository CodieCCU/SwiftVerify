-- ========================================
-- AWS SES EMAIL & UNSUBSCRIBE SCHEMA
-- ========================================

-- Unsubscribe Management Table
CREATE TABLE IF NOT EXISTS unsubscribes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    token VARCHAR(255) NOT NULL UNIQUE,
    unsubscribe_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    reason TEXT,
    admin_removed BOOLEAN DEFAULT FALSE,
    admin_user_id INT REFERENCES users(id),
    removal_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_unsubscribes_email ON unsubscribes(email);
CREATE INDEX IF NOT EXISTS idx_unsubscribes_token ON unsubscribes(token);
CREATE INDEX IF NOT EXISTS idx_unsubscribes_timestamp ON unsubscribes(unsubscribe_timestamp);

-- Audit Logs Table (Immutable)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSONB,
    admin_user_id INT REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_email ON audit_logs(email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);

-- Email Logs Table
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_type VARCHAR(50) NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    application_id INT REFERENCES tenant_applications(id),
    aws_message_id VARCHAR(255),
    sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    skipped_reason VARCHAR(255),
    retry_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_app_id ON email_logs(application_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_timestamp ON email_logs(sent_at);

-- Comments for documentation
COMMENT ON TABLE unsubscribes IS 'Stores email unsubscribe requests with immediate processing';
COMMENT ON TABLE audit_logs IS 'Immutable audit trail for compliance - entries cannot be deleted';
COMMENT ON TABLE email_logs IS 'Tracks all email sends, skips, and failures';

COMMENT ON COLUMN unsubscribes.token IS 'HMAC-SHA256 unique token for unsubscribe verification';
COMMENT ON COLUMN unsubscribes.admin_removed IS 'TRUE if admin manually removed unsubscribe (requires notes)';
COMMENT ON COLUMN audit_logs.details IS 'JSON details of the audit event';
COMMENT ON COLUMN email_logs.skipped_reason IS 'Reason email was skipped (e.g., user unsubscribed)';
