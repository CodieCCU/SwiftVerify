# SwiftVerify Audit Logging System

## Overview

SwiftVerify implements a comprehensive, **immutable** audit logging system to track all email-related activities, unsubscribe requests, and system events for compliance and security purposes.

## Key Principles

### Immutability
- Audit logs **CANNOT** be deleted
- Audit logs **CANNOT** be modified
- Audit logs are append-only
- All entries are timestamped with microsecond precision

### Completeness
- **Every** unsubscribe is logged
- **Every** email send is logged
- **Every** admin action is logged
- **Every** failed operation is logged

### Security
- Logs encrypted at rest
- Access logged and monitored
- Tamper-evident design
- Role-based access control

## What is Logged

### Email Events
- `email_sent` - Successful email delivery
- `email_failed` - Failed email delivery
- `email_skipped_unsubscribed` - Email skipped due to unsubscribe
- `email_attempted_to_unsubscribed` - Attempted send to unsubscribed user
- `email_retry` - Email retry attempt

### Unsubscribe Events
- `email_unsubscribe` - User unsubscribe request
- `admin_resubscribe` - Admin re-subscription
- `unsubscribe_token_generated` - New unsubscribe token created
- `unsubscribe_token_verified` - Token verification attempt

### Admin Events
- `admin_view_unsubscribes` - Admin viewed unsubscribe list
- `admin_view_audit_logs` - Admin viewed audit logs
- `admin_export_data` - Admin exported data
- `admin_modify_unsubscribe` - Admin modified unsubscribe record

### System Events
- `system_startup` - Server/service startup
- `system_shutdown` - Server/service shutdown
- `database_migration` - Database schema update
- `configuration_change` - System configuration change

## Log Entry Format

Each audit log entry contains:

```json
{
  "id": "uuid-v4",
  "action": "email_unsubscribe",
  "email": "user@example.com",
  "timestamp": "2026-02-09T05:22:57.549123Z",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "details": {
    "token": "base64-encoded-token",
    "reason": "Too many emails",
    "email_type": "denial",
    "application_id": 12345
  },
  "admin_user_id": null,
  "created_at": "2026-02-09T05:22:57.549123Z"
}
```

### Field Descriptions

- **id**: Unique UUID identifier for the log entry
- **action**: Type of action being logged (see event types above)
- **email**: Email address associated with the action
- **timestamp**: Exact time of the event (UTC, microsecond precision)
- **ip_address**: IP address of the requester (IPv4 or IPv6)
- **user_agent**: Browser/client user agent string
- **details**: JSON object with action-specific details
- **admin_user_id**: If admin-initiated, the admin's user ID
- **created_at**: When the log entry was created

## Database Schema

```sql
CREATE TABLE audit_logs (
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

CREATE INDEX idx_audit_logs_email ON audit_logs(email);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
```

### Indexes
- **email**: Fast lookup by email address
- **action**: Filter by action type
- **timestamp**: Time-range queries and sorting

## Logging Best Practices

### DO
✅ Log every significant action
✅ Include all relevant context
✅ Use UTC timestamps
✅ Validate data before logging
✅ Use consistent action names
✅ Include IP and user agent when available

### DON'T
❌ Log sensitive passwords or tokens (hash them)
❌ Log credit card or SSN data
❌ Delete or modify existing logs
❌ Allow users to access all logs
❌ Store logs in plain text files
❌ Skip logging for "minor" events

## Access Control

### Role-Based Access

| Role | Permissions |
|------|-------------|
| **User** | View own audit logs only |
| **Admin** | View all audit logs, export data |
| **Compliance Officer** | Full read access, export, reports |
| **Legal Team** | Full read access (on request) |
| **System** | Write access only |

### Audit Log Access is Logged
When anyone accesses audit logs, it creates a new audit log entry:

```json
{
  "action": "admin_view_audit_logs",
  "email": "admin@swift-verify.org",
  "timestamp": "2026-02-09T05:22:57.549123Z",
  "details": {
    "query_params": {
      "email": "user@example.com",
      "start_date": "2026-01-01",
      "end_date": "2026-02-01"
    },
    "records_returned": 42
  },
  "admin_user_id": 123
}
```

## Querying Audit Logs

### By Email
```sql
SELECT * FROM audit_logs
WHERE email = 'user@example.com'
ORDER BY timestamp DESC;
```

### By Action Type
```sql
SELECT * FROM audit_logs
WHERE action = 'email_unsubscribe'
ORDER BY timestamp DESC;
```

### By Time Range
```sql
SELECT * FROM audit_logs
WHERE timestamp BETWEEN '2026-01-01' AND '2026-02-01'
ORDER BY timestamp DESC;
```

### Complex Query (Admin Actions)
```sql
SELECT * FROM audit_logs
WHERE admin_user_id IS NOT NULL
  AND action LIKE 'admin_%'
  AND timestamp > NOW() - INTERVAL '30 days'
ORDER BY timestamp DESC;
```

## Monthly Audit Reports

### Report Contents
1. **Summary Statistics**
   - Total events logged
   - Events by type
   - Events by email domain
   - Admin actions count

2. **Unsubscribe Metrics**
   - Total unsubscribes
   - Unsubscribe rate by email type
   - Top unsubscribe reasons
   - Unsubscribe trends

3. **Email Metrics**
   - Total emails sent
   - Emails skipped (unsubscribed)
   - Failed emails
   - Retry statistics

4. **Compliance Status**
   - CAN-SPAM compliance check
   - GDPR compliance check
   - Suspicious activity alerts
   - Data retention status

### Report Generation
```go
// Pseudo-code for monthly report generation
func GenerateMonthlyAuditReport(year, month int) {
    startDate := time.Date(year, month, 1, 0, 0, 0, 0, time.UTC)
    endDate := startDate.AddDate(0, 1, 0)
    
    logs := QueryAuditLogs(startDate, endDate)
    
    report := AuditReport{
        Period: fmt.Sprintf("%d-%02d", year, month),
        TotalEvents: len(logs),
        EventsByType: CountByAction(logs),
        UnsubscribeMetrics: CalculateUnsubscribeMetrics(logs),
        EmailMetrics: CalculateEmailMetrics(logs),
        ComplianceStatus: CheckCompliance(logs),
    }
    
    SaveReport(report)
    NotifyStakeholders(report)
}
```

## Data Retention

### Retention Periods
- **Audit Logs**: 7 years (2,555 days) minimum
- **Email Logs**: 1 year minimum
- **Unsubscribe Records**: Indefinite (compliance requirement)

### Archival Process
1. Logs older than 1 year moved to cold storage
2. Cold storage encrypted and compressed
3. Access requires special approval
4. Retrieval takes 24-48 hours

### Deletion Policy
- Audit logs are **NEVER** deleted
- Only archived to cold storage
- Exception: Court order or legal requirement

## Security Measures

### Encryption
- **At Rest**: AES-256 encryption
- **In Transit**: TLS 1.3
- **Backups**: Encrypted backups

### Access Monitoring
- All access logged
- Failed access attempts flagged
- Unusual access patterns trigger alerts
- Regular security audits

### Tamper Detection
- Cryptographic checksums
- Merkle tree validation
- Regular integrity checks
- Alerts on tampering attempts

## Compliance Integration

### CAN-SPAM Act
- Logs prove immediate unsubscribe processing
- Logs show no emails sent to unsubscribed users
- Audit trail for enforcement

### GDPR
- Logs support right to access
- Logs prove right to erasure compliance
- Audit trail for data processing

### SOC 2 Type II
- Comprehensive audit trail
- Access controls documented
- Security controls validated

## API Endpoints

### Query Audit Logs (Admin)
```
POST /api/admin/unsubscribe/audit
Content-Type: application/json

{
  "email": "user@example.com",
  "startDate": "2026-01-01T00:00:00Z",
  "endDate": "2026-02-01T00:00:00Z",
  "limit": 100,
  "offset": 0
}
```

### Response
```json
{
  "auditLogs": [
    {
      "id": "uuid",
      "action": "email_unsubscribe",
      "email": "user@example.com",
      "timestamp": "2026-02-09T05:22:57.549123Z",
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "details": {
        "reason": "Too many emails"
      }
    }
  ],
  "total": 1,
  "limit": 100,
  "offset": 0
}
```

## Troubleshooting

### Missing Logs
**Problem**: Expected log entry not found
**Solution**: 
1. Check if action was actually performed
2. Verify timestamp/time zone
3. Check if logging service was running
4. Review error logs for logging failures

### Performance Issues
**Problem**: Slow audit log queries
**Solution**:
1. Use indexed columns in WHERE clauses
2. Limit query time ranges
3. Use pagination (LIMIT/OFFSET)
4. Consider caching common queries

### Storage Growth
**Problem**: Audit logs consuming too much storage
**Solution**:
1. Archive old logs to cold storage
2. Compress archived logs
3. Implement log rotation
4. Monitor storage usage

## Future Enhancements

- [ ] Real-time log streaming
- [ ] Machine learning anomaly detection
- [ ] Automated compliance checking
- [ ] GraphQL query interface
- [ ] Log visualization dashboard
- [ ] Blockchain anchoring for tamper-evidence

## Contact

For questions about audit logging:
- **Technical:** devops@swift-verify.org
- **Compliance:** compliance@swift-verify.org
- **Legal:** legal@swift-verify.org

Last Updated: 2026-02-09
Version: 1.0
