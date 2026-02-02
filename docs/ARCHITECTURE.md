# SwiftVerify Architecture Documentation

## System Overview

SwiftVerify is a driver's license verification system designed to integrate with the Equifax Work Number API. The system follows a clean architecture pattern with clear separation of concerns between the frontend, backend API, business logic, and data persistence layers.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ DriversLicense│  │ Verification │  │ Verification │          │
│  │    Page       │─>│  Processing  │─>│   Result     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/JSON
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      Backend API (Go)                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    HTTP Handlers                          │  │
│  │  POST /api/verify  │  GET /api/verify/:id  │  POST retry │  │
│  └─────────────┬──────────────────────────────────────────┬─┘  │
│                │                                           │     │
│  ┌─────────────▼─────────────────────────────────────────▼──┐  │
│  │                      Middleware                           │  │
│  │  Request ID │ Logging │ Validation │ Recovery │ CORS     │  │
│  └─────────────┬──────────────────────────────────────────┬─┘  │
│                │                                           │     │
│  ┌─────────────▼─────────────────────────────────────────▼──┐  │
│  │                  Verification Service                     │  │
│  │  - Business Logic                                         │  │
│  │  - Orchestrates provider and repository                  │  │
│  └─────────────┬──────────────────────────────────────────┬─┘  │
│                │                                           │     │
│       ┌────────▼─────────┐                     ┌──────────▼───┐ │
│       │ Provider Interface│                     │  Repository  │ │
│       │  (Verification)   │                     │  Interface   │ │
│       └────────┬─────────┘                     └──────────┬───┘ │
│                │                                           │     │
│      ┌─────────▼──────────┐                   ┌──────────▼────┐ │
│      │  Mock Provider     │                   │  PostgreSQL   │ │
│      │ (Development)      │                   │  Repository   │ │
│      └────────────────────┘                   └──────────┬────┘ │
│      ┌────────────────────┐                             │       │
│      │ Equifax Provider   │                             │       │
│      │  (Production)      │                             │       │
│      └────────────────────┘                             │       │
└─────────────────────────────────────────────────────────┼───────┘
                                                          │
                                               ┌──────────▼────────┐
                                               │  PostgreSQL DB    │
                                               │  - Requests       │
                                               │  - Results        │
                                               │  - Error Logs     │
                                               └───────────────────┘
```

## Components

### Frontend Layer

**Technology**: React with Vite

**Responsibilities**:
- User interface for license submission
- Status polling and display
- Error handling and user feedback
- Form validation

**Key Components**:
1. `DriversLicense.jsx`: License input form
2. `VerificationProcessing.jsx`: Processing status with polling
3. `VerificationResult.jsx`: Result display

### Backend API Layer

**Technology**: Go with Gorilla Mux

**Structure**:

```
cmd/
  server/
    main.go              # Application entry point

internal/
  config/
    config.go            # Configuration management
  
  handlers/
    verification.go      # HTTP request handlers
  
  middleware/
    middleware.go        # Request ID, logging, recovery
    validation.go        # Input validation
  
  services/
    verification/
      service.go         # Business logic
      repository.go      # Data access interface
      mock_provider.go   # Mock implementation
      # equifax_provider.go (to be implemented)
  
  models/
    verification.go      # Domain models
  
  database/
    db.go               # Database connection
  
  errors/
    errors.go           # Error types and handling
  
  logger/
    logger.go           # Structured logging

pkg/
  dto/
    verification.go     # Data transfer objects
```

## Data Flow

### Verification Request Flow

1. **User submits form** (Frontend)
   - User enters email and license number
   - Frontend validates input
   - Submits POST request to `/api/verify`

2. **Request processing** (Backend)
   - Middleware adds request ID
   - Middleware logs request
   - Validation middleware checks input
   - Handler receives request

3. **Service layer** (Backend)
   - Creates verification request in database
   - Submits to provider (async)
   - Returns request ID immediately

4. **Provider processing** (Backend)
   - Mock provider simulates verification
   - Equifax provider calls external API (when implemented)
   - Returns result

5. **Result storage** (Backend)
   - Service saves result to database
   - Updates request status

6. **Status polling** (Frontend)
   - Frontend polls `/api/verify/:id` every 2 seconds
   - Displays status updates
   - Shows final result when complete

### Error Handling Flow

```
Error occurs
    │
    ├─> Service Layer
    │   └─> Creates AppError with type and details
    │       └─> Logs error to verification_error_logs table
    │
    ├─> Handler Layer
    │   └─> Converts AppError to ErrorResponse DTO
    │       └─> Sets appropriate HTTP status code
    │
    └─> Frontend
        └─> Displays user-friendly error message
        └─> Offers retry option if applicable
```

## Database Schema

### verification_requests

Stores verification request metadata.

```sql
CREATE TABLE verification_requests (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    license_number TEXT NOT NULL,
    input_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);
```

**Indexes**:
- `idx_verification_requests_email`: Quick lookup by email
- `idx_verification_requests_status`: Filter by status
- `idx_verification_requests_created_at`: Time-based queries

### verification_results

Stores verification outcomes.

```sql
CREATE TABLE verification_results (
    id UUID PRIMARY KEY,
    verification_request_id UUID UNIQUE REFERENCES verification_requests(id),
    approved BOOLEAN NOT NULL,
    response_data JSONB,
    provider_status VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);
```

### verification_error_logs

Stores error information for debugging and retry logic.

```sql
CREATE TABLE verification_error_logs (
    id UUID PRIMARY KEY,
    verification_request_id UUID REFERENCES verification_requests(id),
    error_type VARCHAR(100) NOT NULL,
    error_message TEXT NOT NULL,
    error_details JSONB,
    retryable BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);
```

## Configuration Management

Configuration is loaded from environment variables using the `godotenv` package.

**Configuration Categories**:

1. **Server Config**: Port, host
2. **Database Config**: Connection parameters
3. **Equifax Config**: API credentials and endpoints
4. **JWT Config**: Authentication settings
5. **Logging Config**: Level and format
6. **CORS Config**: Allowed origins and methods

**Loading Process**:
1. Attempt to load `.env` file
2. Read environment variables
3. Apply defaults for missing values
4. Validate required fields
5. Return config struct

## Security Features

### Current Implementation

1. **Input Validation**: All inputs validated before processing
2. **Error Sanitization**: Internal errors not exposed to clients
3. **Request ID Tracking**: Every request tracked for audit
4. **Structured Logging**: All operations logged securely
5. **CORS Protection**: Only allowed origins can access API
6. **Panic Recovery**: Graceful handling of unexpected errors

### Future Enhancements

1. **JWT Authentication**: Token-based API authentication
2. **Rate Limiting**: Prevent abuse and DoS attacks
3. **Data Encryption**: Encrypt license numbers at rest
4. **HTTPS Only**: Enforce SSL/TLS
5. **API Key Rotation**: Regular credential rotation
6. **Audit Logging**: Comprehensive audit trail

## Provider Interface

The Provider interface allows easy swapping between different verification providers:

```go
type Provider interface {
    Verify(ctx context.Context, email, licenseNumber string) (*VerificationResult, error)
    GetStatus(ctx context.Context, requestID string) (*VerificationResult, error)
    Name() string
}
```

**Implementations**:

1. **MockProvider**: For development and testing
   - Simulates verification with configurable approval rate
   - No external dependencies
   - Fast response times

2. **EquifaxProvider**: For production (to be implemented)
   - Integrates with Equifax Work Number API
   - Handles authentication and API calls
   - Implements proper error handling and retry logic

## API Design Principles

1. **RESTful**: Standard HTTP methods and status codes
2. **Stateless**: No server-side session management
3. **Idempotent**: Safe to retry GET operations
4. **Versioned**: API version in URL path (future)
5. **Documented**: Comprehensive API documentation
6. **Consistent**: Standardized request/response formats

## Scalability Considerations

### Current Architecture

- Single server instance
- Direct database connections
- Synchronous processing (with async background tasks)

### Future Enhancements

1. **Horizontal Scaling**: Multiple API instances behind load balancer
2. **Message Queue**: Decouple verification processing (e.g., RabbitMQ, Redis)
3. **Caching**: Cache verification results (Redis)
4. **Database**: Connection pooling and read replicas
5. **Monitoring**: Prometheus metrics and Grafana dashboards
6. **Distributed Tracing**: OpenTelemetry for request tracking

## Testing Strategy

### Unit Tests

- Test individual functions and methods
- Mock external dependencies
- Focus on business logic

### Integration Tests

- Test API endpoints end-to-end
- Use test database
- Verify request/response formats

### Load Tests

- Simulate high traffic
- Identify bottlenecks
- Verify error handling under load

## Deployment

### Development

```bash
# Install dependencies
go mod download

# Run migrations
psql -d swiftverify -f database/migrations/001_create_verification_tables.sql

# Start server
go run cmd/server/main.go
```

### Production

1. Build binary: `go build -o bin/server cmd/server/main.go`
2. Set environment variables
3. Run migrations
4. Start server with monitoring
5. Configure reverse proxy (nginx)
6. Enable HTTPS

## Monitoring and Observability

### Logging

- Structured JSON logs
- Request ID tracking
- Configurable log levels
- No PII in logs

### Metrics (Future)

- Request count and duration
- Success/failure rates
- Provider response times
- Database query performance

### Alerts (Future)

- High error rates
- Slow response times
- Provider failures
- Database connection issues

## Disaster Recovery

### Backup Strategy

1. **Database**: Daily automated backups
2. **Configuration**: Version controlled
3. **Logs**: Centralized log storage

### Recovery Procedures

1. Restore database from backup
2. Redeploy application
3. Verify configuration
4. Run health checks
5. Resume operations

## Future Enhancements

1. **Real-time Updates**: WebSocket for status updates instead of polling
2. **Multi-provider Support**: Support multiple verification providers
3. **Batch Processing**: Verify multiple licenses at once
4. **Admin Dashboard**: Monitor and manage verifications
5. **Analytics**: Approval rates, processing times, error patterns
6. **Mobile App**: Native mobile application
7. **Email Notifications**: Notify users of verification results
