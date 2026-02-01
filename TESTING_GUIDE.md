# Testing Guide for Landlord Dashboard and Secure Reapplication Links

This guide provides step-by-step instructions for testing the new landlord features.

## Prerequisites

### Option 1: Testing WITHOUT Database (Limited)
- Only the UI and basic API structure can be tested
- Database-dependent features will show errors (expected)
- Good for UI/UX review

### Option 2: Testing WITH Database (Full Functionality)
- Requires PostgreSQL installation
- Full functionality can be tested
- Recommended for comprehensive testing

## Setting up the Database (Option 2)

1. Install PostgreSQL (if not already installed):
```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql
```

2. Create the database:
```bash
sudo -u postgres psql
CREATE DATABASE swiftverify;
CREATE USER swiftverify_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE swiftverify TO swiftverify_user;
\q
```

3. Enable PostGIS extension and create schema:
```bash
psql -U swiftverify_user -d swiftverify -f database/schema.sql
```

4. Load sample data:
```bash
psql -U swiftverify_user -d swiftverify -f database/sample_data.sql
```

5. Set the DATABASE_URL environment variable:
```bash
export DATABASE_URL="postgres://swiftverify_user:your_password@localhost/swiftverify?sslmode=disable"
```

## Running the Application

### Start the Backend
```bash
cd cmd/server
go run main.go
```

The server will start on port 8080. You should see:
- `Server starting on :8080` (with or without database)
- If database is not connected: `Warning: Database connection failed...`

### Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend will start on port 3000.

## Test Scenarios

### Scenario 1: Landlord Login and Dashboard Access

1. Open browser to http://localhost:3000
2. You should see the login page with demo account information
3. Enter credentials:
   - Username: `landlord1` (or any username containing "landlord")
   - Password: `password` (any password works in demo mode)
4. Click "Login"
5. You should be redirected to the Landlord Dashboard

**Expected Result:**
- Dashboard displays with navigation bar
- Table showing tenant applications (if database is connected)
- Privacy notice at the bottom
- "Refresh" button is visible

### Scenario 2: Viewing Application Details

With database connected, you should see sample applications:

**Verify the following:**
1. Application status badges (Approved=green, Denied=red, Pending=orange)
2. Property and unit information is visible
3. Rent and utilities amounts are displayed correctly
4. Application dates are shown
5. Tenant email is masked (e.g., "j***@example.com")
6. **Sensitive data is NOT shown** (no SSN, DL numbers, or addresses)

### Scenario 3: Creating a Reapplication Link

1. Find a denied application in the dashboard
2. Click "Send Reapply Link" button
3. A modal should appear with:
   - Property and unit information pre-filled
   - Email input field
4. Enter tenant email: `bob.johnson@example.com`
5. Click "Generate Link"
6. Link should be generated and displayed
7. Click "Copy Link" to copy to clipboard

**Expected Result:**
- Link format: `http://localhost:3000/reapply?token=...`
- Expiration notice shows "7 days"
- One-time use notice is shown
- Link is copyable

### Scenario 4: Tenant Reapplication Flow

1. Copy the reapplication link from Scenario 3
2. Open link in new browser tab/incognito window
3. You should see the Reapplication page

**Verify the following:**
- Token validation happens automatically
- Unit information is displayed (unit number, rent, utilities, bed/bath)
- Email field is pre-filled and read-only
- Form has fields for:
  - Driver's License Number
  - Social Security Number
  - Current Address
- Security notice is visible at bottom

4. Fill in the form:
   - Driver's License: `DL123456`
   - SSN: `123-45-6789`
   - Address: `100 Test St, Boise, ID`
5. Click "Submit Application"

**Expected Result:**
- Success page appears with checkmark
- "Application Submitted!" message
- "Continue to Login" button

### Scenario 5: Token Security - Expired Token

Test with the expired token from sample data:

1. Open: `http://localhost:3000/reapply?token=sample-token-def456-expired-token-12345678901234567890`
2. Should see error: "This link has expired or has already been used"

### Scenario 6: Token Security - Already Used Token

1. Use a token that was already used in Scenario 4
2. Try to open the same link again
3. Should see error: "This link has expired or has already been used"

### Scenario 7: Token Security - Invalid Token

1. Open: `http://localhost:3000/reapply?token=invalid-token-123`
2. Should see error: "Invalid or expired link"

### Scenario 8: Email Mismatch Protection

1. Create a new reapplication link for `alice.williams@example.com`
2. On the reapplication page, try to change the email field (it should be read-only)
3. Even if you modify it via browser dev tools, submission should fail with "Email does not match the invitation"

## API Testing (With Database)

### Test Landlord Applications Endpoint
```bash
curl http://localhost:8080/api/landlord/applications?landlord_id=1
```

Expected: JSON array of applications with masked emails and no sensitive data

### Test Create Reapplication Link
```bash
curl -X POST http://localhost:8080/api/landlord/reapplication-link \
  -H "Content-Type: application/json" \
  -d '{
    "landlord_id": 1,
    "unit_id": 2,
    "tenant_email": "test@example.com"
  }'
```

Expected: JSON with token and expiration date

### Test Token Validation
```bash
curl http://localhost:8080/api/landlord/token/YOUR_TOKEN_HERE/validate
```

Expected: JSON with valid=true and unit information

## Security Checklist

Verify these security features:

- [ ] Tenant SSN is never visible to landlords
- [ ] Driver's License numbers are never visible to landlords
- [ ] Tenant addresses are never visible to landlords
- [ ] Email addresses are masked in the dashboard
- [ ] Tokens expire after 7 days
- [ ] Tokens can only be used once
- [ ] Token validation checks expiration
- [ ] Token validation checks usage status
- [ ] Email must match token for submission
- [ ] All sensitive data is stored with "encrypted:" prefix
- [ ] Activity logs capture token generation and usage
- [ ] CORS is enabled for frontend-backend communication

## UI/UX Checklist

- [ ] Login page clearly indicates landlord vs tenant accounts
- [ ] Dashboard is responsive and clean
- [ ] Application status colors are intuitive (green/red/orange)
- [ ] Modal for link creation is user-friendly
- [ ] Copy link button provides feedback
- [ ] Reapplication page is clear and easy to fill out
- [ ] Success/error messages are informative
- [ ] Privacy notices are visible and clear
- [ ] All forms have proper validation
- [ ] Loading states are shown where appropriate

## Known Limitations (Expected Behavior)

1. **Without Database:**
   - Dashboard will show "No applications found"
   - Link creation will work but won't persist
   - Token validation will fail

2. **Email Integration:**
   - Email templates are created but not sent automatically
   - In production, integrate with an email service (SendGrid, SES, etc.)

3. **Authentication:**
   - Currently uses simple mock authentication
   - In production, implement proper JWT/OAuth authentication

4. **Encryption:**
   - Currently using simple "encrypted:" prefix
   - In production, use proper encryption (AES-256, etc.)

## Troubleshooting

**Problem:** Dashboard shows no applications
- **Solution:** Check database connection and ensure sample data is loaded

**Problem:** Cannot create reapplication links
- **Solution:** Verify backend is running and database is connected

**Problem:** Frontend not connecting to backend
- **Solution:** Check CORS settings and ensure backend is on port 8080

**Problem:** Token validation always fails
- **Solution:** Ensure database is connected and tokens exist in reapplication_tokens table
