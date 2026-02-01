# SwiftVerify Testing & Validation Guide

## Overview
This guide provides comprehensive testing procedures for SwiftVerify, covering functional, security, and accessibility testing.

## 1. Local Development Testing

### 1.1 Backend Testing

#### Start Backend Server
```bash
cd /path/to/SwiftVerify
export USE_HTTPS=false  # For local testing
export JWT_SECRET=test-secret-key
export PORT=8080
go run cmd/server/main.go
```

#### Test Health Endpoint
```bash
curl http://localhost:8080/api/health
# Expected: {"status":"healthy","timestamp":"...","version":"1.0.0"}
```

#### Test Login (No MFA for simple test)
```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'
```

#### Test MFA Flow
```bash
# Step 1: Login (returns MFA session)
SESSION=$(curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}' \
  | jq -r '.mfaSessionId')

# Step 2: Verify MFA (use code 123456 in demo mode)
curl -X POST http://localhost:8080/api/mfa/verify \
  -H "Content-Type: application/json" \
  -H "X-MFA-Session: $SESSION" \
  -d '{"code":"123456"}'
```

### 1.2 Frontend Testing

#### Start Development Server
```bash
cd frontend
npm install
npm run dev
```

#### Manual Testing Checklist
- [ ] Login page loads correctly
- [ ] Username and password fields accept input
- [ ] Login with valid credentials shows MFA screen
- [ ] MFA code validation works (use 123456)
- [ ] Navigation to Home page after successful login
- [ ] All navigation buttons work
- [ ] Document upload page accepts files
- [ ] Staff-assisted mode page displays correctly
- [ ] Logout clears session

## 2. Security Testing

### 2.1 SSL/TLS Testing

#### Generate Test Certificates
```bash
# Generate self-signed certificate for testing
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout test-server.key -out test-server.crt \
  -subj "/C=US/ST=State/L=City/O=SwiftVerify/CN=localhost"
```

#### Test HTTPS Connection
```bash
export USE_HTTPS=true
export TLS_CERT=./test-server.crt
export TLS_KEY=./test-server.key
go run cmd/server/main.go

# In another terminal:
curl -k https://localhost:8080/api/health
```

### 2.2 Authentication Testing

#### Test Invalid Credentials
```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"invalid","password":"wrong"}' \
  -w "\nHTTP Status: %{http_code}\n"
# Expected: HTTP Status: 401
```

#### Test Missing Authorization Header
```bash
curl http://localhost:8080/api/verify \
  -w "\nHTTP Status: %{http_code}\n"
# Expected: HTTP Status: 401
```

#### Test Invalid JWT Token
```bash
curl http://localhost:8080/api/verify \
  -H "Authorization: Bearer invalid_token" \
  -w "\nHTTP Status: %{http_code}\n"
# Expected: HTTP Status: 401
```

### 2.3 File Upload Security Testing

#### Test Oversized File
```bash
# Create 11MB file (exceeds 10MB limit)
dd if=/dev/zero of=large_file.pdf bs=1M count=11

# Try to upload
TOKEN="your_jwt_token_here"
curl -X POST http://localhost:8080/api/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "document=@large_file.pdf" \
  -w "\nHTTP Status: %{http_code}\n"
# Expected: HTTP Status: 400
```

#### Test Invalid File Type
```bash
# Create executable file
echo "#!/bin/bash\necho 'test'" > test.sh

# Try to upload
curl -X POST http://localhost:8080/api/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "document=@test.sh" \
  -w "\nHTTP Status: %{http_code}\n"
# Expected: Should be rejected (implementation needed)
```

## 3. Cross-Platform Testing

### 3.1 Desktop Browsers

#### Chrome/Chromium
- [ ] Windows 10/11
- [ ] macOS (latest)
- [ ] Ubuntu Linux

#### Firefox
- [ ] Windows 10/11
- [ ] macOS (latest)
- [ ] Ubuntu Linux

#### Safari
- [ ] macOS (latest)
- [ ] iPad OS

#### Edge
- [ ] Windows 10/11

### 3.2 Mobile Devices

#### iOS
- [ ] iPhone (iOS 15+) - Safari
- [ ] iPhone (iOS 15+) - Chrome
- [ ] iPad (iPadOS 15+) - Safari

#### Android
- [ ] Android 10+ - Chrome
- [ ] Android 10+ - Firefox
- [ ] Samsung Internet Browser

### 3.3 Responsive Testing

#### Test Breakpoints
```javascript
// Desktop: 1920x1080
// Laptop: 1366x768
// Tablet (landscape): 1024x768
// Tablet (portrait): 768x1024
// Mobile (large): 414x896
// Mobile (small): 375x667
```

## 4. Accessibility Testing

### 4.1 Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals
- [ ] Arrow keys work in dropdowns
- [ ] Focus indicators visible

### 4.2 Screen Reader Testing

#### NVDA (Windows)
```
1. Open NVDA
2. Navigate to login page
3. Verify all form labels are read correctly
4. Verify error messages are announced
5. Verify navigation structure is logical
```

#### VoiceOver (macOS/iOS)
```
1. Activate VoiceOver (Cmd+F5)
2. Test all pages for proper announcements
3. Verify images have alt text
4. Verify form controls have labels
```

### 4.3 Color Contrast
- [ ] All text meets WCAG AA (4.5:1 for normal text)
- [ ] UI components meet WCAG AA (3:1)
- [ ] Focus indicators are visible
- [ ] Error states use more than just color

### 4.4 WCAG Compliance Tools
```bash
# Install axe-core for automated testing
npm install -D @axe-core/cli

# Run accessibility audit
npx @axe-core/cli http://localhost:5173
```

## 5. Performance Testing

### 5.1 Load Time Testing

#### Lighthouse Audit
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse http://localhost:5173 \
  --output html \
  --output-path ./lighthouse-report.html

# Target scores:
# Performance: 90+
# Accessibility: 95+
# Best Practices: 90+
# SEO: 90+
```

### 5.2 Backend Load Testing

#### Using Apache Bench
```bash
# Install ab (Apache Bench)
sudo apt install apache2-utils

# Test login endpoint (100 requests, 10 concurrent)
ab -n 100 -c 10 -p login.json -T application/json \
  http://localhost:8080/api/login

# login.json content:
# {"username":"testuser","password":"testpass"}
```

#### Using k6 (Recommended)
```bash
# Install k6
sudo apt install k6

# Create test script (load-test.js):
cat > load-test.js << 'EOF'
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up
    { duration: '1m', target: 20 },   // Stay at 20 users
    { duration: '30s', target: 0 },   // Ramp down
  ],
};

export default function() {
  let response = http.get('http://localhost:8080/api/health');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
}
EOF

# Run load test
k6 run load-test.js
```

## 6. Database Testing

### 6.1 Schema Validation
```bash
# Connect to database
psql swiftverify

# Verify all tables exist
\dt

# Verify indexes
\di

# Check user table structure
\d users

# Test data insertion
INSERT INTO users (username, email, password_hash, role) 
VALUES ('testuser', 'test@example.com', 'hashed_password', 'user');

# Verify audit log triggers (if implemented)
SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 5;
```

### 6.2 Data Encryption Testing
```sql
-- Verify password is hashed (not plain text)
SELECT username, password_hash FROM users WHERE username = 'testuser';
-- Should see bcrypt hash, not plain password

-- Verify sensitive data is encrypted
SELECT * FROM verification_requests LIMIT 1;
-- License numbers should be encrypted if implemented
```

## 7. Integration Testing

### 7.1 Full User Flow Test
```bash
# Automated test script
cat > test-flow.sh << 'EOF'
#!/bin/bash
set -e

echo "Testing full user flow..."

# 1. Health check
echo "1. Health check..."
curl -f http://localhost:8080/api/health > /dev/null
echo "✓ Server healthy"

# 2. Login
echo "2. Testing login..."
RESPONSE=$(curl -s -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}')

MFA_SESSION=$(echo $RESPONSE | jq -r '.mfaSessionId')
echo "✓ MFA session created: $MFA_SESSION"

# 3. MFA verification
echo "3. Testing MFA verification..."
TOKEN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/mfa/verify \
  -H "Content-Type: application/json" \
  -H "X-MFA-Session: $MFA_SESSION" \
  -d '{"code":"123456"}')

TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.token')
echo "✓ JWT token received"

# 4. Authenticated request
echo "4. Testing authenticated request..."
curl -f -X POST http://localhost:8080/api/verify \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","licenseNumber":"TEST123","inputMethod":"manual","staffAssisted":false,"lowDepositMode":false}' \
  > /dev/null
echo "✓ Verification request successful"

# 5. Logout
echo "5. Testing logout..."
curl -f -X POST http://localhost:8080/api/logout \
  -H "Authorization: Bearer $TOKEN" > /dev/null
echo "✓ Logout successful"

echo ""
echo "All tests passed! ✓"
EOF

chmod +x test-flow.sh
./test-flow.sh
```

## 8. PWA Testing

### 8.1 Manifest Validation
```bash
# Validate manifest
curl http://localhost:5173/manifest.json | jq .

# Check for required fields:
# - name
# - short_name
# - start_url
# - display
# - icons
```

### 8.2 Service Worker Testing
```javascript
// In browser console:
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Active service workers:', registrations.length);
  registrations.forEach(reg => {
    console.log('Scope:', reg.scope);
    console.log('State:', reg.active?.state);
  });
});
```

### 8.3 Offline Testing
1. Open application in browser
2. Open DevTools → Application → Service Workers
3. Check "Offline" checkbox
4. Refresh page
5. Verify basic UI still loads from cache

## 9. Community Deployment Testing

### 9.1 Kiosk Mode Testing
- [ ] Browser launches in kiosk mode (fullscreen, no UI)
- [ ] Users cannot exit to desktop
- [ ] Session clears on logout
- [ ] Privacy mode enabled
- [ ] Auto-logout after inactivity

### 9.2 Shared Device Testing
- [ ] Login as User A, complete workflow, logout
- [ ] Verify no User A data remains (localStorage, sessionStorage)
- [ ] Login as User B, verify clean session
- [ ] Use "Clear Session Data" button
- [ ] Verify all data cleared

## 10. Compliance Testing

### 10.1 GDPR Compliance
- [ ] Privacy policy accessible
- [ ] Cookie consent (if cookies used)
- [ ] Data export functionality
- [ ] Data deletion functionality
- [ ] Right to be forgotten implemented

### 10.2 ADA Compliance
- [ ] All forms have labels
- [ ] Error messages are descriptive
- [ ] Keyboard navigation works
- [ ] Color contrast meets standards
- [ ] Alt text on images
- [ ] ARIA labels where needed

## Test Reports

### Generate Test Report
```bash
# Create test report directory
mkdir -p test-reports

# Run all tests and capture output
./test-flow.sh 2>&1 | tee test-reports/integration-$(date +%Y%m%d).log
lighthouse http://localhost:5173 --output json --output-path test-reports/lighthouse-$(date +%Y%m%d).json
```

## Continuous Integration

### GitHub Actions Example
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Go
        uses: actions/setup-go@v2
        with:
          go-version: 1.18
      - name: Run tests
        run: go test ./...
      - name: Run frontend tests
        run: |
          cd frontend
          npm install
          npm test
```

## Success Criteria

### All Tests Must Pass
- ✓ All API endpoints return correct status codes
- ✓ Authentication and MFA work correctly
- ✓ File uploads are validated and secure
- ✓ Cross-browser compatibility verified
- ✓ Accessibility score > 95
- ✓ Performance score > 90
- ✓ No security vulnerabilities found
- ✓ Database operations work correctly
- ✓ PWA installs and works offline
- ✓ Kiosk mode functions properly

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
lsof -ti:8080 | xargs kill -9
```

**Database connection failed:**
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

**NPM install fails:**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

**Last Updated:** February 1, 2026
