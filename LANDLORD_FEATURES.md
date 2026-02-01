# Landlord Dashboard and Secure Reapplication Links

This document describes the new features added to SwiftVerify for landlords and property managers.

## Features

### 1. Landlord Dashboard
The landlord dashboard provides a comprehensive view of tenant applications while protecting sensitive tenant information.

**Key Features:**
- View all tenant applications for your properties
- Filter by application status (pending, approved, denied)
- See unit information including rent and utilities
- Masked tenant email addresses to protect privacy
- Generate secure reapplication links for denied applicants

**Privacy Protection:**
- Sensitive information (SSN, Driver's License, Personal Addresses) is encrypted and NOT displayed
- Only high-level application data is shown
- Tenant email addresses are partially masked (e.g., "j***@example.com")

### 2. Secure Reapplication Links
Landlords can send secure, unique links to tenants who were previously denied before the property adopted SwiftVerify.

**Security Features:**
- Each link is cryptographically unique
- Links expire after 7 days
- One-time use enforcement
- Email validation to prevent unauthorized access
- All activity is logged for audit purposes

**How to Create a Link:**
1. Log in to the Landlord Dashboard
2. Find the denied application
3. Click "Send Reapply Link"
4. Enter the tenant's email address
5. Copy and send the generated link to the tenant

### 3. Tenant Reapplication Flow
Tenants receive a secure link that allows them to reapply for a unit.

**Process:**
1. Tenant clicks the secure link received via email
2. System validates the token (checks expiration and usage)
3. Pre-filled unit information is displayed
4. Tenant completes the application form
5. Token is marked as used after successful submission

## API Endpoints

### Landlord Endpoints
- `GET /api/landlord/applications?landlord_id={id}` - Get all applications for a landlord
- `POST /api/landlord/reapplication-link` - Create a secure reapplication link
- `GET /api/landlord/token/{token}/validate` - Validate a reapplication token

### Application Endpoints
- `POST /api/applications` - Submit a tenant application (with or without token)

## Database Schema

### New Tables
- `landlords` - Landlord/property manager accounts
- `properties` - Property information
- `units` - Individual rental units
- `applications` - Tenant applications (with encrypted sensitive data)
- `reapplication_tokens` - Secure reapplication tokens
- `activity_logs` - Audit trail for all token and application activities

## Email Templates

Email templates are provided in the `templates/email/` directory:
- `landlord_link_confirmation.html` - Sent to landlords when a link is created
- `tenant_reapplication_invitation.html` - Sent to tenants with the reapplication link

## Security Considerations

1. **Data Encryption**: All sensitive tenant data (SSN, DL, addresses) is encrypted before storage
2. **Token Security**: Tokens use UUID + random bytes for uniqueness
3. **One-Time Use**: Tokens are marked as used after submission
4. **Expiration**: All tokens expire after 7 days
5. **Email Validation**: Tenant email must match the token
6. **Audit Logging**: All token generation, views, and usage is logged
7. **Privacy Protection**: Landlords never see sensitive tenant information

## Testing

### Demo Accounts
- **Landlord**: Login with username containing "landlord" (e.g., "landlord1")
- **Tenant**: Login with any username without "landlord"

### Test Flow
1. Login as a landlord
2. View the dashboard (will be empty without database)
3. Create a reapplication link
4. Copy the link
5. Open the link in a new browser/incognito window
6. Complete the reapplication form
7. Verify the application is submitted successfully

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (default: `postgres://localhost/swiftverify?sslmode=disable`)

## Running the Application

### Backend (Go)
```bash
cd cmd/server
go run main.go
```

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

## Future Enhancements
- Email integration (currently templates only)
- SMS notifications
- Batch link generation
- Advanced filtering and search
- Application status updates
- Document upload for applications
