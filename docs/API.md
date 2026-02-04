# SwiftVerify API Documentation

## Overview
SwiftVerify provides a RESTful API for tenant screening **WITHOUT CREDIT CHECKS**. All endpoints focus exclusively on identity verification, employment verification, and optional background checks.

**Base URL:** `http://localhost:8080`

**⚠️ IMPORTANT:** This API does NOT and will NEVER provide credit check endpoints. Any attempt to add credit check functionality violates the core mission and legal agreements.

---

## Authentication
*(To be implemented in production)*
- JWT-based authentication
- Session management for landlords
- Tenant authentication for application submission

---

## Landlord Agreement Endpoints

### Accept Landlord Agreement
**Endpoint:** `POST /api/landlord/agreement/accept`

**Purpose:** Record landlord's acceptance of NO CREDIT CHECK agreement

**Request Body:**
```json
{
  "landlordName": "John Smith",
  "landlordEmail": "john@propertymanagement.com",
  "propertyManagementCompany": "Smith Properties LLC",
  "acknowledgments": {
    "readAndUnderstand": true,
    "noCreditCheckSystem": true,
    "withoutCreditEvaluation": true,
    "willNotConductCreditChecks": true,
    "beforeAndAfter": true,
    "accountTermination": true,
    "rentalDecisionCriteria": true,
    "fairHousingCompliance": true
  },
  "legalAcknowledgment": true,
  "signature": "John Smith",
  "timestamp": "2026-02-04T19:30:00Z"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Agreement accepted successfully",
  "agreementId": 123,
  "acceptedAt": "2026-02-04T19:30:00Z"
}
```

**Validation:**
- All acknowledgments must be `true`
- Signature cannot be empty
- Email must be valid format

**Compliance Logging:**
- Records IP address, timestamp, signature
- Stored in `landlord_agreements` table
- Logged to `compliance_audit_log`

---

### Get Agreement Status
**Endpoint:** `GET /api/landlord/agreement/status`

**Purpose:** Check if landlord has signed the NO CREDIT CHECK agreement

**Response:** `200 OK`
```json
{
  "hasSigned": true,
  "agreementVersion": "1.0",
  "signedAt": "2026-02-03T15:20:00Z",
  "canAccessPlatform": true
}
```

**Use Case:**
- Gateway check before allowing access to landlord dashboard
- Verify agreement is current before accepting new applications

---

## Tenant Application Endpoints

### Create Tenant Application
**Endpoint:** `POST /api/applications`

**Purpose:** Submit a new tenant rental application (NO CREDIT CHECK)

**Request Body:**
```json
{
  "tenantId": 456,
  "landlordId": 123,
  "propertyId": 789
}
```

**Response:** `201 Created`
```json
{
  "id": 1001,
  "tenantId": 456,
  "landlordId": 123,
  "propertyId": 789,
  "status": "SUBMITTED",
  "identityVerification": {
    "verified": false
  },
  "employmentVerification": {
    "verified": false
  },
  "backgroundCheck": {
    "requested": false,
    "completed": false
  },
  "createdAt": "2026-02-04T19:30:00Z",
  "updatedAt": "2026-02-04T19:30:00Z"
}
```

**Workflow Status:**
- `SUBMITTED` → Initial state
- NO CREDIT CHECK stage exists

---

### Get Applications
**Endpoint:** `GET /api/applications`

**Purpose:** Retrieve list of tenant applications for a landlord

**Query Parameters:**
- `status` (optional): Filter by status
- `page` (optional): Pagination
- `limit` (optional): Results per page

**Response:** `200 OK`
```json
[
  {
    "id": 1001,
    "tenantId": 456,
    "landlordId": 123,
    "propertyId": 789,
    "status": "EMPLOYMENT_VERIFIED",
    "identityVerification": {
      "verified": true,
      "fullName": "Jane Doe",
      "driverLicenseState": "ID"
    },
    "employmentVerification": {
      "verified": true,
      "employerName": "Tech Corp Inc",
      "monthlyIncome": 5500
    },
    "backgroundCheck": {
      "requested": false,
      "completed": false
    },
    "createdAt": "2026-02-03T10:00:00Z",
    "updatedAt": "2026-02-04T14:30:00Z"
  }
]
```

**Data Included:**
- ✅ Identity verification details
- ✅ Employment and income data
- ✅ Background check results (if requested)
- ❌ NO credit scores
- ❌ NO credit reports
- ❌ NO credit history

---

## Verification Endpoints

### Verify Identity
**Endpoint:** `POST /api/verification/identity`

**Purpose:** Verify tenant identity using driver's license (NO CREDIT CHECK)

**Request Body:**
```json
{
  "applicationId": 1001,
  "driverLicenseNumber": "A1234567",
  "driverLicenseState": "ID",
  "dateOfBirth": "1990-05-15",
  "fullName": "Jane Doe",
  "address": "123 Main St, Boise, ID 83702"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "verified": true,
  "message": "Identity verified successfully - NO CREDIT CHECK performed",
  "status": "IDENTITY_VERIFIED"
}
```

**Verification Process:**
- Validates driver's license with state DMV APIs
- Updates application status to `IDENTITY_VERIFIED`
- Stores verification timestamp
- NO credit bureau contact

---

### Verify Employment
**Endpoint:** `POST /api/verification/employment`

**Purpose:** Verify employment and income via Equifax Work Number (NO CREDIT CHECK)

**Request Body:**
```json
{
  "applicationId": 1001,
  "employerName": "Tech Corp Inc",
  "employerContact": "+1-555-0100",
  "monthlyIncome": 5500,
  "employmentStartDate": "2020-03-01"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "verified": true,
  "employmentStatus": "active",
  "monthlyIncome": 5500,
  "message": "Employment verified via Equifax Work Number - NO CREDIT CHECK performed",
  "status": "EMPLOYMENT_VERIFIED"
}
```

**Verification Process:**
- Queries Equifax Work Number (employment/income verification service)
- Updates application status to `EMPLOYMENT_VERIFIED`
- Stores income and employer details
- **DOES NOT** use Equifax credit bureau services
- **DOES NOT** pull credit reports

---

### Request Background Check
**Endpoint:** `POST /api/verification/background-check`

**Purpose:** Request criminal background check (NO CREDIT CHECK)

**Request Body:**
```json
{
  "applicationId": 1001
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "requested": true,
  "message": "Background check requested - NO CREDIT CHECK included",
  "estimatedCompletionTime": "24-48 hours"
}
```

**Background Check Includes:**
- Criminal record searches (national and state)
- Sex offender registry checks
- Outstanding warrants
- Compliance with Fair Housing Act

**Background Check EXCLUDES:**
- ❌ Credit reports
- ❌ Credit scores
- ❌ Payment histories
- ❌ Bankruptcy records (as credit information)

---

## Decision Endpoints

### Make Application Decision
**Endpoint:** `POST /api/applications/decision`

**Purpose:** Landlord makes final approval or denial decision

**Request Body:**
```json
{
  "applicationId": 1001,
  "decision": "APPROVED",
  "reason": "Strong income verification and clean background check"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "decision": "APPROVED",
  "decisionDate": "2026-02-04T19:30:00Z",
  "message": "Decision recorded - based on identity, employment, and background verification (NO CREDIT CHECK)"
}
```

**Valid Decisions:**
- `APPROVED`
- `DENIED`

**Decision Criteria:**
- ✅ Identity verification results
- ✅ Employment and income verification
- ✅ Background check results (if requested)
- ✅ Landlord's non-credit screening policies
- ❌ NOT based on credit scores or credit history

**Compliance Logging:**
- Records decision with `basedOnCreditCheck: false` flag
- Tracks landlord ID and timestamp
- Available for audit if agreement violation is alleged

---

## Application Status Workflow

```
SUBMITTED
    ↓
IDENTITY_VERIFIED
    ↓
EMPLOYMENT_VERIFIED
    ↓
BACKGROUND_CHECKED (if landlord requests)
    ↓
LANDLORD_REVIEW_REQUIRED (if background flags exist)
    ↓
FINAL_DECISION
    ↓
APPROVED or DENIED
```

**NO CREDIT_CHECK STATUS EXISTS AT ANY POINT**

---

## PROHIBITED Endpoints

The following endpoints **DO NOT EXIST** and **WILL NEVER BE IMPLEMENTED:**

### ❌ Credit Check Endpoint
```
POST /api/verification/credit-check
```
**Will return:** `404 Not Found` (endpoint does not exist)

### ❌ Credit Policies
```
GET/POST /api/landlord/credit-policies
```
**Will return:** `404 Not Found` (endpoint does not exist)

### ❌ Any Credit-Related Endpoint
Any endpoint containing:
- `credit`
- `credit-score`
- `credit-report`
- `credit-bureau`
- `fico`
- `vantagescore`

**These violate SwiftVerify's core mission and landlord agreements.**

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request body",
  "details": "Missing required field: signature"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Valid authentication token required"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Landlord agreement must be signed before accessing this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "message": "Application with ID 1001 not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## Compliance & Audit Trail

All API calls are logged to the `compliance_audit_log` table:

**Logged Events:**
- `landlord_agreement_accepted`
- `application_created`
- `identity_verified`
- `employment_verified`
- `background_check_requested`
- `application_decision`
- `credit_check_attempt` (CRITICAL - triggers alert)

**Event Severity Levels:**
- `INFO` - Normal operations
- `WARNING` - Unusual activity
- `CRITICAL` - Policy violations (e.g., credit check attempts)

**Audit Data:**
```json
{
  "landlordId": 123,
  "eventType": "employment_verified",
  "eventDescription": "Employment verified via Equifax Work Number",
  "severity": "INFO",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "additionalData": {
    "applicationId": 1001,
    "noCreditCheck": true
  },
  "createdAt": "2026-02-04T19:30:00Z"
}
```

---

## Rate Limiting
*(To be implemented in production)*
- 100 requests per minute per API key
- 1000 requests per hour per landlord account
- Prevents abuse and ensures fair usage

---

## CORS Policy
*(Production configuration)*
- Allowed origins: `https://swiftverify.com`
- Allowed methods: `GET, POST, PUT, DELETE, OPTIONS`
- Credentials: Allowed

---

## Versioning
- Current API version: `v1`
- Version included in URL: `/api/v1/...` (future)
- Backward compatibility maintained

---

## Security Best Practices

1. **HTTPS Only** - All API calls must use HTTPS in production
2. **Authentication** - JWT tokens with expiration
3. **Input Validation** - All inputs sanitized and validated
4. **SQL Injection Prevention** - Parameterized queries only
5. **XSS Prevention** - Output encoding
6. **CSRF Protection** - CSRF tokens for state-changing operations
7. **Audit Logging** - All actions logged with timestamp and IP

---

## Support

**API Questions:** api-support@swiftverify.com  
**Compliance Questions:** compliance@swiftverify.com  
**Bug Reports:** bugs@swiftverify.com

---

**SwiftVerify API - NO CREDIT CHECK Tenant Screening**

*Verification without discrimination. Approval based on current financial capacity.*
