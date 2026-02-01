# SwiftVerify Immutable Logging System

## Overview

SwiftVerify implements a comprehensive, immutable logging system designed to meet FCRA, GDPR, and CCPA compliance requirements. This system provides complete audit trails for all application activities across both frontend and backend systems.

## Features

### Immutable Logging
- **Append-only file storage**: Logs are written in append-only mode to prevent modification
- **Hash chain verification**: Each log entry contains a SHA-256 hash and references the previous entry's hash
- **WORM-like storage**: Write-Once-Read-Many pattern ensures log integrity
- **Database triggers**: PostgreSQL triggers prevent updates or deletes to audit logs

### Comprehensive Coverage

#### Backend Logging
- All HTTP requests and responses (with status codes and timing)
- WebSocket connections and messages
- Server startup and shutdown events
- API call metadata
- Database interactions
- Error tracking with severity levels

#### Frontend Logging
- User actions and page interactions
- Form submissions (with sensitive data masking)
- Page views with browser metadata
- Authentication events (login, logout)
- API call results
- Input field changes

### Categorization
Logs are categorized for easy filtering and analysis:
- **Authentication**: Login attempts, logouts, session management
- **DriversLicenseCheck**: Verification workflows and submissions
- **APICall**: Backend API requests and responses
- **DatabaseAction**: Database operations
- **ServerEvent**: Server lifecycle and WebSocket events
- **UserAction**: Frontend user interactions
- **SystemEvent**: System-level events

### Severity Levels
- **DEBUG**: Detailed diagnostic information
- **INFO**: General informational messages
- **WARN**: Warning messages for potential issues
- **ERROR**: Error events that might still allow the app to continue
- **CRITICAL**: Critical errors requiring immediate attention

### Privacy & Compliance

#### Sensitive Data Masking
Automatically redacts sensitive fields including:
- SSN (Social Security Numbers)
- Passwords
- Credit card numbers
- CVV codes
- PINs
- Security tokens

#### IP Address Handling
- Logs IP addresses for security and audit purposes
- Can be configured for GDPR/CCPA compliance with masking

#### ISO 8601 Timestamps
All log entries use ISO 8601 format for international compliance and standardization.

### Export & Analysis

#### CSV Export
Export logs to CSV format for spreadsheet analysis:
```bash
curl "http://localhost:8080/api/logs/export?format=csv" -o audit_logs.csv
```

#### JSON Export
Export logs in JSON format:
```bash
curl "http://localhost:8080/api/logs/export?format=json" -o audit_logs.json
```

### Real-time Monitoring

The system includes an alert manager for real-time monitoring:
- Pattern-based alert rules
- Category and severity filters
- Configurable notification channels (email, webhooks)
- Active/inactive alert management

## Architecture

### Backend (Go)

**Package Structure:**
```
pkg/
├── models/
│   └── log.go          # Data models for logs and alerts
└── logger/
    ├── logger.go       # Core logging functionality
    ├── alert.go        # Real-time alert management
    ├── export.go       # CSV/JSON export utilities
    └── middleware.go   # HTTP logging middleware
```

**Key Components:**
- `Logger`: Main logging service with append-only file writing
- `AlertManager`: Real-time monitoring and alerting
- `HTTPLoggingMiddleware`: Automatic HTTP request/response logging
- Export utilities for CSV and JSON formats

### Frontend (React)

**Logger Service:**
```javascript
import logger from './services/logger';

// Log user action
logger.logUserAction('button_clicked', { button: 'submit' });

// Log authentication
logger.logAuthentication('login_success', { username: 'user' });

// Log driver's license check
logger.logDriversLicenseCheck('verification_started', { email: 'user@example.com' });
```

### Database Schema

**audit_logs table:**
- Stores all log entries immutably
- Protected by triggers preventing updates/deletes
- Indexed for efficient querying by timestamp, category, user, session, severity
- Includes hash chain for integrity verification

**alert_configurations table:**
- Stores alert rules for real-time monitoring
- Configurable notification settings

## Usage

### Backend Logging

```go
import (
    "github.com/CodieCCU/SwiftVerify/pkg/logger"
    "github.com/CodieCCU/SwiftVerify/pkg/models"
)

// Initialize logger
auditLogger, err := logger.NewLogger("./logs")
if err != nil {
    log.Fatal(err)
}
defer auditLogger.Close()

// Log an event
auditLogger.LogInfo(
    models.CategoryAuthentication,
    "user_login",
    map[string]interface{}{
        "username": "john_doe",
        "ip": "192.168.1.1",
    },
)

// Log an error
auditLogger.LogError(
    models.CategoryAPICall,
    "api_request_failed",
    err,
    map[string]interface{}{
        "endpoint": "/api/verify",
    },
)
```

### Frontend Logging

```javascript
import { 
    logPageView, 
    logUserAction, 
    logAuthentication,
    logDriversLicenseCheck 
} from './services/logger';

// Log page view
useEffect(() => {
    logPageView('home', { user: currentUser });
}, []);

// Log user action
const handleClick = () => {
    logUserAction('button_clicked', { button: 'submit' });
    // ... handle click
};

// Log form submission
const handleSubmit = (formData) => {
    logFormSubmit('license_form', formData);
    // ... handle submission
};
```

### Exporting Logs

```bash
# Export to CSV
curl "http://localhost:8080/api/logs/export?format=csv" -o audit_logs.csv

# Export to JSON
curl "http://localhost:8080/api/logs/export?format=json" -o audit_logs.json
```

### Verifying Log Integrity

```go
import "github.com/CodieCCU/SwiftVerify/pkg/logger"

logs, err := logger.ReadLogsFromFile("./logs/audit_2026-02-01.jsonl")
if err != nil {
    log.Fatal(err)
}

valid, err := logger.VerifyLogIntegrity(logs)
if !valid {
    log.Printf("Log integrity check failed: %v", err)
}
```

## Log File Format

Logs are stored in JSONL (JSON Lines) format with one JSON object per line:

```json
{
  "id": 1,
  "log_id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2026-02-01T14:55:21.761Z",
  "category": "Authentication",
  "action": "login_success",
  "severity": "INFO",
  "user_id": 123,
  "session_id": "session-1234567890-abc",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "source": "frontend",
  "metadata": {
    "browser": {...},
    "url": "http://localhost:3000/login"
  },
  "hash": "a3d4f5e6...",
  "previous_hash": "b2c3d4e5...",
  "created_at": "2026-02-01T14:55:21.761Z"
}
```

## Compliance Notes

### FCRA Compliance
- All verification activities are logged with complete audit trails
- Logs are immutable and cannot be altered post-creation
- Sensitive information is automatically masked

### GDPR Compliance
- IP addresses can be masked or pseudonymized
- User consent and data access requests are logged
- Right to be forgotten can be implemented via metadata

### CCPA Compliance
- All data collection and processing is logged
- Consumer rights requests are tracked
- Data sharing and third-party access is audited

## Security Considerations

1. **Access Control**: Implement authentication/authorization for log export endpoints
2. **Encryption**: Consider encrypting log files at rest
3. **Backup**: Regular backups of log files to secure storage
4. **Retention**: Define and implement log retention policies
5. **Monitoring**: Set up alerts for critical events and security incidents

## Future Enhancements

- Database-backed logging with PostgreSQL storage
- Log rotation and archival policies
- Advanced search and filtering UI
- Integration with SIEM systems
- Automated compliance reporting
- Encrypted log storage
- Multi-region log replication
- Advanced analytics and visualization
