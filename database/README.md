# Database Setup Guide

## Prerequisites

- PostgreSQL 12 or higher
- pg_cron extension installed
- PostGIS extension (for existing location features)

## Installation Steps

### 1. Install pg_cron Extension

#### On Ubuntu/Debian:
```bash
sudo apt-get install postgresql-12-cron
```

#### On macOS (with Homebrew):
```bash
brew install pgcron
```

#### Enable pg_cron in PostgreSQL:
Add the following to `postgresql.conf`:
```
shared_preload_libraries = 'pg_cron'
cron.database_name = 'swiftverify'
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

### 2. Create Database

```bash
createdb swiftverify
```

Or using psql:
```sql
CREATE DATABASE swiftverify;
```

### 3. Run Schema Migration

```bash
psql -U postgres -d swiftverify -f database/schema.sql
```

This will:
- Enable PostGIS and pg_cron extensions
- Create all required tables
- Set up triggers for automatic expiration date calculation
- Create the deletion function
- Schedule the daily deletion job

### 4. Verify Installation

```bash
psql -U postgres -d swiftverify -f database/test_queries.sql
```

Check that all tables exist:
```sql
\dt
```

You should see:
- users
- locations
- activities
- drivers_licenses
- audit_logs
- deletion_notifications
- deletion_job_logs

### 5. Verify pg_cron Schedule

```sql
SELECT * FROM cron.job WHERE jobname = 'delete-expired-drivers-licenses';
```

You should see one entry with:
- schedule: `0 2 * * *` (daily at 2 AM UTC)
- command: `SELECT delete_expired_drivers_licenses();`

## Configuration

### Environment Variables

Set the database connection string:
```bash
export DATABASE_URL="postgres://username:password@localhost:5432/swiftverify?sslmode=disable"
```

For production, use SSL:
```bash
export DATABASE_URL="postgres://username:password@localhost:5432/swiftverify?sslmode=require"
```

## Manual Testing

### Create a Test Record

Using the API:
```bash
curl -X POST http://localhost:8080/api/drivers-license \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "license_number": "DL123456789"
  }'
```

### Manually Trigger Deletion (for testing)

1. Make a record expired:
```sql
UPDATE drivers_licenses 
SET expiration_date = CURRENT_TIMESTAMP - INTERVAL '1 day'
WHERE id = 1;
```

2. Run the deletion function:
```sql
SELECT delete_expired_drivers_licenses();
```

3. Check the results:
```sql
SELECT * FROM drivers_licenses WHERE deleted_at IS NOT NULL;
SELECT * FROM deletion_notifications ORDER BY notification_sent_at DESC LIMIT 5;
SELECT * FROM audit_logs WHERE action = 'DELETED' ORDER BY timestamp DESC LIMIT 5;
```

## Troubleshooting

### pg_cron not working

1. Check if pg_cron is loaded:
```sql
SELECT * FROM pg_extension WHERE extname = 'pg_cron';
```

2. Check PostgreSQL logs for errors:
```bash
tail -f /var/log/postgresql/postgresql-12-main.log
```

3. Verify cron.database_name in postgresql.conf matches your database

### Permission Issues

Grant necessary permissions:
```sql
GRANT USAGE ON SCHEMA cron TO your_user;
GRANT SELECT ON cron.job TO your_user;
```

### Connection Issues

Test connection:
```bash
psql -U postgres -d swiftverify -c "SELECT version();"
```

## Backup and Recovery

### Backup

Full backup:
```bash
pg_dump -U postgres swiftverify > swiftverify_backup.sql
```

Data only:
```bash
pg_dump -U postgres --data-only swiftverify > swiftverify_data.sql
```

### Restore

```bash
psql -U postgres swiftverify < swiftverify_backup.sql
```

## Security Best Practices

1. **Use strong passwords** for database users
2. **Enable SSL** for production connections
3. **Limit database user permissions** - don't use superuser for application
4. **Regular backups** - automated daily backups recommended
5. **Monitor audit logs** - set up alerts for suspicious activity
6. **Rotate encryption keys** - implement key rotation policy

## Monitoring

### Check deletion job status

```sql
SELECT 
    job_execution_time,
    records_deleted,
    records_failed,
    execution_status
FROM deletion_job_logs
ORDER BY job_execution_time DESC
LIMIT 10;
```

### Check pending notifications

```sql
SELECT COUNT(*) as pending_count
FROM deletion_notifications
WHERE notification_status = 'PENDING';
```

### Audit log size monitoring

```sql
SELECT 
    pg_size_pretty(pg_total_relation_size('audit_logs')) as audit_log_size,
    COUNT(*) as total_records
FROM audit_logs;
```

## Maintenance

### Archive old audit logs

For compliance, you may want to archive old audit logs:

```sql
-- Archive logs older than 1 year
CREATE TABLE audit_logs_archive AS
SELECT * FROM audit_logs
WHERE timestamp < CURRENT_TIMESTAMP - INTERVAL '1 year';

DELETE FROM audit_logs
WHERE timestamp < CURRENT_TIMESTAMP - INTERVAL '1 year';
```

### Permanently delete soft-deleted records

After the required retention period:

```sql
-- Permanently delete records that have been soft-deleted for > 90 days
DELETE FROM drivers_licenses
WHERE deleted_at IS NOT NULL
  AND deleted_at < CURRENT_TIMESTAMP - INTERVAL '90 days';
```

### Vacuum and analyze

Regular maintenance:
```sql
VACUUM ANALYZE drivers_licenses;
VACUUM ANALYZE audit_logs;
VACUUM ANALYZE deletion_notifications;
```
