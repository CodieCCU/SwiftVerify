# SwiftVerify - Equifax Integration Setup

This document provides setup instructions for running the SwiftVerify system with the newly implemented backend infrastructure.

## Overview

SwiftVerify is now equipped with a complete backend infrastructure ready for Equifax Work Number API integration. The system includes:

- ✅ RESTful API endpoints for verification requests
- ✅ Database schema for storing verification data
- ✅ Mock provider for testing without Equifax credentials
- ✅ Structured logging and error handling
- ✅ Configuration management via environment variables
- ✅ Frontend integration with backend endpoints

## Quick Start

### Prerequisites

- Go 1.18 or higher
- Node.js 16 or higher
- PostgreSQL 12 or higher (optional for initial testing)

### 1. Clone the Repository

```bash
git clone https://github.com/CodieCCU/SwiftVerify.git
cd SwiftVerify
```

### 2. Backend Setup

#### Install Go Dependencies

```bash
go mod download
```

#### Configure Environment (Optional for Testing)

```bash
cp .env.example .env
```

For initial testing, you can run without database or Equifax credentials. The system will use the mock provider.

#### Run Backend Server

```bash
# Without database (using defaults)
go run cmd/server/main.go

# With custom configuration
# Edit .env first, then:
go run cmd/server/main.go
```

The server will start on `http://localhost:8080`

### 3. Frontend Setup

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Run Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Database Setup (Optional)

If you want to persist verification data:

```bash
# Create database
createdb swiftverify

# Run initial schema
psql -d swiftverify -f database/schema.sql

# Run verification tables migration
psql -d swiftverify -f database/migrations/001_create_verification_tables.sql
```

Update `.env` with your database credentials:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=swiftverify
DB_USER=postgres
DB_PASSWORD=your_password
```

## Testing the System

### 1. Manual API Testing

#### Submit Verification Request

```bash
curl -X POST http://localhost:8080/api/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "license_number": "DL123456789",
    "input_method": "manual"
  }'
```

Response:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "email": "test@example.com",
  "created_at": "2026-02-02T18:30:00Z",
  "updated_at": "2026-02-02T18:30:00Z"
}
```

#### Check Verification Status

```bash
curl http://localhost:8080/api/verify/550e8400-e29b-41d4-a716-446655440000
```

Response:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "email": "test@example.com",
  "approved": true,
  "result": {
    "provider": "mock",
    "status": "approved",
    "message": "Verification successful"
  },
  "created_at": "2026-02-02T18:30:00Z",
  "updated_at": "2026-02-02T18:30:05Z"
}
```

### 2. Frontend Testing

1. Navigate to `http://localhost:5173`
2. Login (use any credentials for demo)
3. Navigate to the driver's license page
4. Fill in email and license number
5. Submit the form
6. Watch the processing screen (it now polls the backend!)
7. See the result page

### 3. Unit Tests

```bash
# Run all tests
go test ./...

# Run specific package tests
go test ./internal/services/verification -v

# Run with coverage
go test ./... -cover
```

## Project Structure

```
SwiftVerify/
├── cmd/
│   └── server/
│       └── main.go                 # Application entry point
├── internal/
│   ├── config/
│   │   └── config.go              # Configuration management
│   ├── database/
│   │   └── db.go                  # Database connection
│   ├── errors/
│   │   └── errors.go              # Error types and handling
│   ├── handlers/
│   │   └── verification.go        # HTTP handlers
│   ├── logger/
│   │   └── logger.go              # Structured logging
│   ├── middleware/
│   │   ├── middleware.go          # Request ID, logging, recovery
│   │   └── validation.go          # Input validation
│   ├── models/
│   │   └── verification.go        # Domain models
│   └── services/
│       └── verification/
│           ├── service.go         # Business logic
│           ├── repository.go      # Data access
│           ├── mock_provider.go   # Mock implementation
│           └── service_test.go    # Unit tests
├── pkg/
│   └── dto/
│       └── verification.go        # Data transfer objects
├── database/
│   ├── schema.sql                 # Initial database schema
│   └── migrations/
│       └── 001_create_verification_tables.sql
├── docs/
│   ├── ARCHITECTURE.md            # System architecture
│   ├── CONFIGURATION.md           # Configuration guide
│   ├── EQUIFAX_SETUP.md          # Equifax integration guide
│   └── api/
│       └── API_DOCUMENTATION.md   # API documentation
├── frontend/
│   └── src/
│       └── pages/
│           └── VerificationProcessing.jsx  # Updated component
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
└── go.mod                         # Go dependencies
```

## Key Features

### Backend

- **RESTful API**: Standard HTTP endpoints with proper status codes
- **Mock Provider**: 70% approval rate for testing without Equifax
- **Error Handling**: Centralized error types and standardized responses
- **Logging**: Structured JSON logging with request ID tracking
- **Middleware**: Request ID, logging, validation, recovery, CORS
- **Database Ready**: PostgreSQL schema with proper indexes
- **Configuration**: Environment variable based configuration

### Frontend

- **Backend Integration**: Calls actual API endpoints instead of mocking
- **Polling Mechanism**: Checks verification status every 2 seconds
- **Error Handling**: Displays backend error messages
- **User Feedback**: Loading states and error screens

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/verify` | Submit verification request |
| GET | `/api/verify/:id` | Get verification status |
| POST | `/api/verify/:id/retry` | Retry failed verification |
| GET | `/health` | Health check |

See [API Documentation](docs/api/API_DOCUMENTATION.md) for detailed request/response formats.

## Configuration

Configuration is managed via environment variables. See `.env.example` for all available options.

**Key Variables**:

- `SERVER_PORT`: Server port (default: 8080)
- `LOG_LEVEL`: Logging level (debug, info, warn, error)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: Database connection
- `EQUIFAX_*`: Equifax API credentials (required for production)

See [Configuration Guide](docs/CONFIGURATION.md) for complete documentation.

## Next Steps

### For Development

1. ✅ System is ready for local development and testing
2. ✅ Mock provider allows testing without Equifax credentials
3. ✅ All infrastructure is in place

### For Equifax Integration

1. Obtain Equifax Work Number API credentials
2. Implement `EquifaxProvider` following the guide in [docs/EQUIFAX_SETUP.md](docs/EQUIFAX_SETUP.md)
3. Update `main.go` to use `EquifaxProvider` instead of `MockProvider`
4. Test with sandbox environment
5. Deploy to production with production credentials

See [Equifax Setup Guide](docs/EQUIFAX_SETUP.md) for detailed integration steps.

## Documentation

- [API Documentation](docs/api/API_DOCUMENTATION.md) - Complete API reference
- [Architecture](docs/ARCHITECTURE.md) - System architecture and design
- [Configuration](docs/CONFIGURATION.md) - Configuration guide
- [Equifax Setup](docs/EQUIFAX_SETUP.md) - Equifax integration guide

## Troubleshooting

### Backend won't start

- Check Go version: `go version` (requires 1.18+)
- Install dependencies: `go mod download`
- Check port availability: `lsof -i :8080`

### Frontend won't start

- Check Node version: `node --version` (requires 16+)
- Install dependencies: `npm install`
- Check port availability: `lsof -i :5173`

### Database connection fails

- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env`
- For testing, you can run without database (just don't set `DB_PASSWORD`)

### API returns errors

- Check server logs for details
- Verify request format matches API documentation
- Check that server is running on correct port

## Contributing

Please ensure:

1. All tests pass: `go test ./...`
2. Code follows Go conventions: `go fmt ./...`
3. Documentation is updated for any changes
4. No sensitive data in commits

## Security

- Never commit `.env` file or credentials
- Use strong passwords and secrets
- Enable SSL in production (`DB_SSL_MODE=require`)
- Rotate API keys regularly
- See [Equifax Setup Guide](docs/EQUIFAX_SETUP.md) for security best practices

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:

- Open an issue on GitHub
- Email: support@swiftverify.com
- Documentation: See `docs/` directory
