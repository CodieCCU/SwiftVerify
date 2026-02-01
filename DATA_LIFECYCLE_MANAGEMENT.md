# Driver's License Data Lifecycle Management System

## Overview

This document describes the automated data lifecycle management system for Driver's License records in SwiftVerify. The system ensures compliance with FCRA, GDPR, and data retention regulations by automatically deleting sensitive data 30 days after ingestion.

## Features

### 1. Timed Data Deletion
- **Automatic Expiration**: Each Driver's License record is tagged with `created_at` and `expiration_date` (created_at + 30 days)
- **Automated Deletion**: PostgreSQL `pg_cron` extension runs daily at 2 AM UTC to delete expired records
- **Soft Delete**: Records are marked with `deleted_at` timestamp for audit trail before permanent removal

### 2. Immutable Audit Logging
- **WORM-style Logging**: All operations are logged in an append-only `audit_logs` table
- **Comprehensive Tracking**: Logs include:
  - Record Reference ID (hashed identifier)
  - Action type (CREATED, TAGGED, DELETED, NOTIFICATION_SENT)
  - Timestamp
  - Additional details (JSON format)
  - User agent and IP address

### 3. Email Notification System
- **Deletion Confirmation**: Automated emails sent to tenants after data deletion
- **Retry Logic**: Failed notifications are retried up to 3 times
- **Audit Trail**: All notification attempts are logged

### 4. Data Encryption
- **AES-GCM Encryption**: All sensitive data (license numbers) encrypted at rest
- **Key Management**: Encryption keys tracked with `encryption_key_id`
- **Secure Storage**: Encrypted data never exposed via API responses

### 5. Monitoring and Reporting
- **Daily Reports**: Automated reports showing:
  - Total deletions
  - Successful vs failed deletions
  - Notifications sent/failed
- **Admin Dashboard**: Web interface for monitoring deletion jobs and audit logs
- **Job Logs**: Complete history of deletion job executions

## Architecture

### Database Schema

#### drivers_licenses Table
- `id`: Primary key
- `record_reference_id`: Hashed identifier for privacy
- `email`: User email for notifications
- `license_number_encrypted`: Encrypted license number
- `created_at`: Record creation timestamp
- `expiration_date`: Auto-calculated (created_at + 30 days)
- `deleted_at`: Soft delete timestamp

#### audit_logs Table (Immutable)
- Complete log of all operations
- Supports forensic analysis and compliance audits

#### deletion_notifications Table
- Tracks notification status (PENDING, SENT, FAILED)
- Includes retry count and error messages

#### deletion_job_logs Table
- Records each deletion job execution
- Tracks success/failure statistics

### Backend Components

#### Models (`internal/models/`)
- Data structures for all entities
- Request/response DTOs

#### Database Layer (`internal/database/`)
- Database connection management
- CRUD operations
- Audit logging helpers

#### Services (`internal/services/`)
- **NotificationService**: Email notification handling
- Implements retry logic and error handling

#### Handlers (`internal/handlers/`)
- HTTP request handlers
- API endpoints for frontend integration

#### Utilities (`internal/utils/`)
- **EncryptionService**: AES-GCM encryption/decryption
- Hashing and identifier generation

### API Endpoints

#### POST /api/drivers-license
Creates a new driver's license record with automatic expiration.

**Request:**
```json
{
  "email": "user@example.com",
  "license_number": "DL123456789",
  "user_id": 1
}
```

**Response:**
```json
{
  "record_reference_id": "abc123...",
  "email": "user@example.com",
  "created_at": "2026-02-01T10:00:00Z",
  "expiration_date": "2026-03-03T10:00:00Z",
  "message": "Driver's license data stored successfully. Data will be automatically deleted after 30 days."
}
```

#### GET /api/audit-logs
Retrieves audit logs (admin only).

**Query Parameters:**
- `record_reference_id`: Filter by specific record
- `limit`: Number of results (default: 50)
- `offset`: Pagination offset

#### GET /api/deletion-reports
Generates deletion report for a specific date.

**Query Parameters:**
- `date`: Date in YYYY-MM-DD format (default: today)

#### GET /api/deletion-job-logs
Retrieves deletion job execution logs.

**Query Parameters:**
- `limit`: Number of results (default: 30)

#### POST /api/process-notifications
Manually triggers processing of pending notifications.

## Configuration

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `ENCRYPTION_KEY`: 64-character hex string (32 bytes) for AES-256 encryption
- `PORT`: Server port (default: 8080)

### Example Configuration

```bash
export DATABASE_URL="postgres://user:password@localhost:5432/swiftverify?sslmode=disable"
export ENCRYPTION_KEY="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
export PORT="8080"
```

## Setup Instructions

### 1. Database Setup

```sql
-- Run the schema.sql file to create all tables and functions
psql -U user -d swiftverify -f database/schema.sql
```

This will:
- Enable pg_cron extension
- Create all required tables
- Set up triggers for automatic expiration date calculation
- Schedule the daily deletion job

### 2. Backend Setup

```bash
# Install dependencies
go mod download

# Run the server
go run cmd/server/main.go
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Set API URL in .env
echo "VITE_API_URL=http://localhost:8080" > .env

# Start development server
npm run dev
```

## Compliance

### FCRA Compliance
- Automatic deletion ensures expired data is not used for credit decisions
- Audit logs provide evidence of compliance
- Encryption protects sensitive consumer information

### GDPR Compliance
- Right to be forgotten: Automatic deletion after retention period
- Data minimization: Only necessary data collected
- Encryption and security: AES-256 encryption at rest
- Audit trail: Complete logging of data processing activities

### Best Practices
- Immutable audit logs prevent tampering
- Regular deletion prevents data accumulation
- Email notifications ensure transparency
- Error handling and retry logic ensure reliability

## Monitoring

### Admin Dashboard
Access at `/admin` route after authentication.

Features:
- Daily deletion statistics
- Recent deletion job logs
- Real-time audit log viewer
- Manual notification processing

### Alerts and Notifications
- Admin team notified when batch deletion jobs complete
- Failed deletions logged with error details
- Notification failures tracked for manual intervention

## Error Handling

### Deletion Failures
- Failed deletions are logged in `audit_logs` with error details
- Job continues with other records
- Partial completion status tracked in `deletion_job_logs`

### Notification Failures
- Automatic retry up to 3 times
- Error messages stored in `deletion_notifications` table
- Manual reprocessing available via API

### Fallback Actions
- Database transaction rollback on critical failures
- Soft delete allows recovery if needed
- Comprehensive error logging for debugging

## Security Considerations

1. **Encryption**: All sensitive data encrypted with AES-256-GCM
2. **Hashing**: Record IDs hashed to prevent identifier exposure
3. **Audit Trail**: Immutable logs prevent tampering
4. **Access Control**: Admin endpoints should be protected (add authentication)
5. **Key Rotation**: Implement encryption key rotation policy
6. **SQL Injection**: Parameterized queries prevent SQL injection
7. **HTTPS**: Use HTTPS in production for data in transit

## Future Enhancements

1. **Email Integration**: Integrate with SendGrid, AWS SES, or similar service
2. **Key Rotation**: Automated encryption key rotation
3. **Permanent Deletion**: Add job to permanently remove soft-deleted records after audit period
4. **Export Reports**: CSV/Excel export for deletion reports
5. **Admin Authentication**: Role-based access control
6. **Metrics**: Integration with monitoring tools (Prometheus, Grafana)
7. **Multi-tenant**: Support for multiple organizations

## Testing

### Manual Testing
1. Submit a driver's license through the web interface
2. Verify record created in database with correct expiration date
3. Check audit log entry
4. Manually trigger deletion function: `SELECT delete_expired_drivers_licenses();`
5. Verify notification created
6. Process notifications: `POST /api/process-notifications`
7. Check admin dashboard for statistics

### Database Testing
```sql
-- Test deletion function
SELECT delete_expired_drivers_licenses();

-- View audit logs
SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 10;

-- Check pending notifications
SELECT * FROM deletion_notifications WHERE notification_status = 'PENDING';
```

## Support

For questions or issues:
- Email: support@swiftverify.com
- Review audit logs for operational issues
- Check deletion job logs for automated deletion status
