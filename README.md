# SwiftVerify

## Project Overview
SwiftVerify is a powerful and flexible verification library and platform designed to streamline and standardize the verification processes in applications. The platform includes comprehensive data lifecycle management for sensitive information, ensuring compliance with FCRA and GDPR regulations.

## Features
- **Fast and efficient**: Optimized for performance with minimal overhead.
- **Easy to integrate**: Simple API to get started quickly.
- **Comprehensive documentation**: Clear examples and usage instructions.
- **Data Lifecycle Management**: Automated 30-day retention and deletion for driver's license data
- **Immutable Audit Logging**: Complete audit trail for compliance
- **Email Notifications**: Automated notifications for data deletion
- **Admin Dashboard**: Real-time monitoring and reporting
- **AES-256 Encryption**: Secure encryption for sensitive data

## Architecture

SwiftVerify consists of two main components:

### Backend (Go)
- RESTful API server with WebSocket support
- PostgreSQL database with automated data lifecycle management
- AES-256-GCM encryption for sensitive data
- Immutable audit logging system
- Email notification service

### Frontend (React)
- Driver's license verification interface
- Admin dashboard for monitoring
- Real-time status updates

## Installation

### Prerequisites
- Go 1.18 or higher
- PostgreSQL 12+ with pg_cron extension
- Node.js 16+ and npm

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/CodieCCU/SwiftVerify.git
cd SwiftVerify
```

2. Set up the database:
```bash
# Install PostgreSQL and pg_cron
# See database/README.md for detailed instructions

# Create database and run migrations
createdb swiftverify
psql -U postgres -d swiftverify -f database/schema.sql
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Install dependencies and run:
```bash
go mod download
go run cmd/server/main.go
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Data Lifecycle Management

SwiftVerify implements a comprehensive data lifecycle management system for driver's license data:

### Key Features
- **Automatic Deletion**: Data automatically deleted 30 days after creation
- **Audit Logging**: Immutable logs of all operations (CREATED, DELETED, NOTIFICATION_SENT)
- **Email Notifications**: Tenants notified when their data is deleted
- **Compliance**: FCRA and GDPR compliant data handling
- **Encryption**: AES-256-GCM encryption for sensitive data
- **Monitoring**: Admin dashboard with real-time statistics

For detailed documentation, see [DATA_LIFECYCLE_MANAGEMENT.md](DATA_LIFECYCLE_MANAGEMENT.md)

## API Endpoints

### Driver's License Management
- `POST /api/drivers-license` - Create new driver's license record
- `GET /api/audit-logs` - Retrieve audit logs (admin)
- `GET /api/deletion-reports` - Generate deletion reports
- `GET /api/deletion-job-logs` - Get deletion job logs
- `POST /api/process-notifications` - Process pending notifications

### WebSocket
- `WS /ws` - WebSocket connection for real-time updates

## Usage

### Basic Example

```javascript
// Submit driver's license for verification
const response = await fetch('http://localhost:8080/api/drivers-license', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    license_number: 'DL123456789'
  })
});

const result = await response.json();
console.log('Record created:', result.record_reference_id);
console.log('Expires on:', result.expiration_date);
```

### Admin Monitoring

Access the admin dashboard at `http://localhost:5173/admin` to:
- View deletion statistics
- Monitor deletion job execution
- Process pending notifications
- Review audit logs

## Testing

### Run Unit Tests
```bash
go test ./...
```

### Run Integration Tests
```bash
./test_integration.sh
```

### Manual Database Testing
```bash
psql -U postgres -d swiftverify -f database/test_queries.sql
```

## Configuration

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `ENCRYPTION_KEY` - 64-character hex string for AES-256 encryption
- `PORT` - Server port (default: 8080)

See `.env.example` for a complete configuration template.

## Security

SwiftVerify implements multiple security layers:

1. **Data Encryption**: AES-256-GCM for sensitive data at rest
2. **Hashed Identifiers**: Record IDs are hashed for privacy
3. **Audit Trail**: Immutable logs prevent tampering
4. **Automated Deletion**: Minimizes data exposure risk
5. **HTTPS Ready**: Configure TLS for production

## Compliance

The system is designed to comply with:
- **FCRA** (Fair Credit Reporting Act)
- **GDPR** (General Data Protection Regulation)
- Data retention and deletion requirements
- Right to be forgotten
- Data minimization principles

## Contributing
We welcome contributions from the community. Please check out our [contributing guidelines](CONTRIBUTING.md) for more information.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
For questions or support, please reach out to [support@swiftverify.com](mailto:support@swiftverify.com).

## Documentation

- [Data Lifecycle Management](DATA_LIFECYCLE_MANAGEMENT.md) - Comprehensive guide to the lifecycle management system
- [Database Setup](database/README.md) - Database installation and configuration guide
- [API Documentation](docs/API.md) - Detailed API reference (coming soon)

## Current Date and Time
2026-02-01 16:05:00 UTC
