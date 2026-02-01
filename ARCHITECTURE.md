# Data Lifecycle Management Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SwiftVerify Platform                         │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐                                   ┌──────────────┐
│   User Browser   │                                   │    Admin     │
│   (React App)    │                                   │  Dashboard   │
└────────┬─────────┘                                   └──────┬───────┘
         │                                                    │
         │ POST /api/drivers-license                         │ GET /api/*
         │ (email, license_number)                           │
         │                                                    │
         ▼                                                    ▼
┌────────────────────────────────────────────────────────────────────┐
│                      Go Backend Server (Port 8080)                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              HTTP Handlers (CORS enabled)                     │  │
│  │  - DriversLicenseHandler                                      │  │
│  │  - AuditLogHandler                                            │  │
│  │  - ReportHandler                                              │  │
│  └──────────────────┬────────────────────────────────────────────┘  │
│                     │                                               │
│  ┌──────────────────┴────────────────────────────────────────────┐  │
│  │                     Services Layer                             │  │
│  │  ┌──────────────────┐      ┌──────────────────────────────┐   │  │
│  │  │ Encryption       │      │  Notification Service        │   │  │
│  │  │ Service          │      │  - SendDeletionEmail()       │   │  │
│  │  │ - AES-256-GCM    │      │  - ProcessPending()          │   │  │
│  │  │ - Encrypt()      │      │  - Retry logic (3x)          │   │  │
│  │  │ - Decrypt()      │      └──────────────────────────────┘   │  │
│  │  │ - HashData()     │                                          │  │
│  │  └──────────────────┘                                          │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                     │                                               │
│  ┌──────────────────┴────────────────────────────────────────────┐  │
│  │                   Database Layer                               │  │
│  │  - CreateDriversLicense()                                      │  │
│  │  - CreateAuditLog()                                            │  │
│  │  - GetDeletionReport()                                         │  │
│  │  - UpdateNotificationStatus()                                  │  │
│  └────────────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         │ PostgreSQL Driver (lib/pq)
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      PostgreSQL Database                             │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Core Tables                                                  │   │
│  │  - users                                                      │   │
│  │  - locations                                                  │   │
│  │  - activities                                                 │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Lifecycle Management Tables                                  │   │
│  │  ┌─────────────────────────────────────────────────────────┐ │   │
│  │  │ drivers_licenses                                         │ │   │
│  │  │ - id, record_reference_id (SHA-256 hash)                │ │   │
│  │  │ - email, license_number_encrypted (AES-256)             │ │   │
│  │  │ - created_at, expiration_date (created_at + 30 days)    │ │   │
│  │  │ - deleted_at (soft delete)                              │ │   │
│  │  └─────────────────────────────────────────────────────────┘ │   │
│  │  ┌─────────────────────────────────────────────────────────┐ │   │
│  │  │ audit_logs (IMMUTABLE - WORM style)                     │ │   │
│  │  │ - id, record_reference_id, action, timestamp            │ │   │
│  │  │ - details (JSONB), user_agent, ip_address               │ │   │
│  │  │ Actions: CREATED, TAGGED, DELETED, NOTIFICATION_SENT    │ │   │
│  │  └─────────────────────────────────────────────────────────┘ │   │
│  │  ┌─────────────────────────────────────────────────────────┐ │   │
│  │  │ deletion_notifications                                   │ │   │
│  │  │ - id, record_reference_id, email                        │ │   │
│  │  │ - notification_status (PENDING/SENT/FAILED)             │ │   │
│  │  │ - retry_count, error_message                            │ │   │
│  │  └─────────────────────────────────────────────────────────┘ │   │
│  │  ┌─────────────────────────────────────────────────────────┐ │   │
│  │  │ deletion_job_logs                                        │ │   │
│  │  │ - id, job_execution_time                                │ │   │
│  │  │ - records_deleted, records_failed, execution_status     │ │   │
│  │  └─────────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Automated Functions & Triggers                               │   │
│  │  ┌─────────────────────────────────────────────────────────┐ │   │
│  │  │ Trigger: set_expiration_date()                          │ │   │
│  │  │ - Automatically sets expiration_date on INSERT          │ │   │
│  │  │ - Formula: created_at + INTERVAL '30 days'             │ │   │
│  │  └─────────────────────────────────────────────────────────┘ │   │
│  │  ┌─────────────────────────────────────────────────────────┐ │   │
│  │  │ Function: delete_expired_drivers_licenses()             │ │   │
│  │  │ - Finds records where expiration_date <= NOW()          │ │   │
│  │  │ - Soft deletes (sets deleted_at timestamp)              │ │   │
│  │  │ - Creates audit log entry                               │ │   │
│  │  │ - Creates deletion notification                         │ │   │
│  │  │ - Logs job execution statistics                         │ │   │
│  │  └─────────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  pg_cron Extension                                            │   │
│  │  ┌─────────────────────────────────────────────────────────┐ │   │
│  │  │ Job: delete-expired-drivers-licenses                    │ │   │
│  │  │ Schedule: 0 2 * * * (Daily at 2 AM UTC)                │ │   │
│  │  │ Command: SELECT delete_expired_drivers_licenses();      │ │   │
│  │  └─────────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘

                         │
                         │ (Future: Email Service Integration)
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   Email Service (Future)                             │
│                   - SendGrid / AWS SES / SMTP                        │
│                   - Deletion confirmation emails                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Driver's License Submission Flow
```
User → DriversLicense.jsx → POST /api/drivers-license
  ↓
HTTP Handler validates input
  ↓
Encryption Service encrypts license_number
  ↓
Database Layer creates record with auto-calculated expiration_date
  ↓
Audit Log: "CREATED" action logged
  ↓
Response returned to user with record_reference_id
```

### 2. Automated Deletion Flow (Daily at 2 AM UTC)
```
pg_cron triggers → delete_expired_drivers_licenses()
  ↓
Find records WHERE expiration_date <= NOW() AND deleted_at IS NULL
  ↓
For each expired record:
  ├─ Update drivers_licenses SET deleted_at = NOW()
  ├─ INSERT INTO audit_logs (action = 'DELETED')
  └─ INSERT INTO deletion_notifications (status = 'PENDING')
  ↓
Update deletion_job_logs with statistics
```

### 3. Email Notification Flow
```
Manual or Scheduled → POST /api/process-notifications
  ↓
Get pending notifications (status = 'PENDING', retry_count < 3)
  ↓
For each notification:
  ├─ SendDeletionEmail(email, record_ref_id)
  ├─ If success: status = 'SENT'
  ├─ If failure: status = 'FAILED', retry_count++
  └─ Audit Log: "NOTIFICATION_SENT" or "NOTIFICATION_FAILED"
```

### 4. Admin Monitoring Flow
```
Admin Dashboard → Multiple GET requests
  ↓
GET /api/deletion-reports?date=YYYY-MM-DD
  ├─ Query deletion_job_logs for date range
  └─ Count notifications by status
  ↓
GET /api/deletion-job-logs
  ├─ Recent job executions
  └─ Success/failure statistics
  ↓
GET /api/audit-logs
  └─ Recent actions with filtering
```

## Security Layers

1. **Data at Rest**: AES-256-GCM encryption
2. **Data in Transit**: HTTPS (production configuration)
3. **Access Control**: Admin endpoints (authentication ready)
4. **Audit Trail**: Immutable logs with IP and user agent
5. **Privacy**: Hashed record reference IDs
6. **SQL Injection**: Parameterized queries throughout

## Compliance Checkpoints

### FCRA
✅ Automated deletion prevents stale data usage
✅ Audit trail for regulatory review
✅ Encryption protects consumer data

### GDPR
✅ Right to erasure (30-day auto-delete)
✅ Data minimization
✅ Processing transparency (email notifications)
✅ Security of processing (encryption + audit)
✅ Data subject rights (audit logs)

## Performance Optimizations

- **Indexes**: On expiration_date, created_at, deleted_at, record_reference_id
- **Soft Delete**: Preserves audit trail without immediate physical deletion
- **Batch Processing**: pg_cron handles bulk deletions efficiently
- **Connection Pooling**: PostgreSQL connection reuse
- **Pagination**: Audit logs support limit/offset

## Monitoring Points

1. **Deletion Job Success Rate**: Check deletion_job_logs daily
2. **Pending Notifications**: Monitor count of PENDING status
3. **Failed Notifications**: Alert on retry_count >= 3
4. **Database Growth**: Track audit_logs table size
5. **API Response Times**: Monitor endpoint latency
6. **Encryption Performance**: Track encryption/decryption times
