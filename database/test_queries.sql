-- Manual Testing Script for Data Lifecycle Management
-- This script helps test the deletion workflow manually

-- 1. Check current driver's license records
SELECT 
    id, 
    record_reference_id, 
    email, 
    created_at, 
    expiration_date, 
    deleted_at,
    CASE 
        WHEN expiration_date <= CURRENT_TIMESTAMP THEN 'EXPIRED'
        ELSE 'ACTIVE'
    END as status
FROM drivers_licenses
ORDER BY created_at DESC
LIMIT 10;

-- 2. View audit logs for recent activity
SELECT 
    id,
    record_reference_id,
    action,
    timestamp,
    details
FROM audit_logs
ORDER BY timestamp DESC
LIMIT 20;

-- 3. Check deletion job logs
SELECT 
    id,
    job_execution_time,
    records_deleted,
    records_failed,
    execution_status,
    error_details
FROM deletion_job_logs
ORDER BY job_execution_time DESC
LIMIT 10;

-- 4. Check pending notifications
SELECT 
    id,
    record_reference_id,
    email,
    notification_sent_at,
    notification_status,
    retry_count,
    error_message
FROM deletion_notifications
WHERE notification_status = 'PENDING'
ORDER BY notification_sent_at DESC
LIMIT 10;

-- 5. Manually expire a test record (for testing only)
-- Replace 'YOUR_RECORD_REF_ID' with an actual record reference ID
-- UPDATE drivers_licenses 
-- SET expiration_date = CURRENT_TIMESTAMP - INTERVAL '1 day'
-- WHERE record_reference_id = 'YOUR_RECORD_REF_ID'
-- AND deleted_at IS NULL;

-- 6. Manually trigger the deletion function
-- SELECT delete_expired_drivers_licenses();

-- 7. View results after deletion
-- SELECT * FROM drivers_licenses WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC LIMIT 10;
-- SELECT * FROM deletion_notifications ORDER BY notification_sent_at DESC LIMIT 10;
-- SELECT * FROM audit_logs WHERE action IN ('DELETED', 'NOTIFICATION_SENT') ORDER BY timestamp DESC LIMIT 10;

-- 8. Generate a deletion report for today
SELECT 
    CURRENT_DATE as report_date,
    COALESCE(SUM(records_deleted), 0) as total_deleted,
    COALESCE(SUM(records_failed), 0) as total_failed
FROM deletion_job_logs
WHERE job_execution_time >= CURRENT_DATE 
  AND job_execution_time < CURRENT_DATE + INTERVAL '1 day';

-- 9. Check pg_cron schedule
SELECT * FROM cron.job WHERE jobname = 'delete-expired-drivers-licenses';

-- 10. View full deletion workflow for a specific record
-- Replace 'YOUR_RECORD_REF_ID' with an actual record reference ID
-- SELECT 
--     'Record Info' as type,
--     id::text,
--     email as detail,
--     created_at as timestamp
-- FROM drivers_licenses 
-- WHERE record_reference_id = 'YOUR_RECORD_REF_ID'
-- UNION ALL
-- SELECT 
--     'Audit Log' as type,
--     id::text,
--     action as detail,
--     timestamp
-- FROM audit_logs
-- WHERE record_reference_id = 'YOUR_RECORD_REF_ID'
-- ORDER BY timestamp DESC;
