# SwiftVerify API Documentation

## Overview

The SwiftVerify API provides endpoints for driver's license verification through the Equifax Work Number integration. This documentation describes the available endpoints, request/response formats, and error handling.

## Base URL

```
http://localhost:8080/api
```

## Authentication

Currently, the API does not require authentication. JWT authentication will be added in future releases.

## Common Headers

All requests should include:

```
Content-Type: application/json
```

All responses will include:

```
Content-Type: application/json
X-Request-ID: <unique-request-id>
```

## Endpoints

### 1. Submit Verification Request

Submit a new driver's license verification request.

**Endpoint:** `POST /api/verify`

**Request Body:**

```json
{
  "email": "user@example.com",
  "license_number": "DL123456789",
  "input_method": "manual"
}
```

**Request Fields:**

- `email` (string, required): Email address of the user
- `license_number` (string, required for manual): Driver's license number
- `input_method` (string, required): Input method, either "manual" or "scan"

**Response (201 Created):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "email": "user@example.com",
  "created_at": "2026-02-02T18:30:00Z",
  "updated_at": "2026-02-02T18:30:00Z"
}
```

**Response Fields:**

- `id` (string): Unique verification request ID (UUID)
- `status` (string): Current status - "pending", "processing", "completed", or "failed"
- `email` (string): Email address
- `created_at` (string): ISO 8601 timestamp
- `updated_at` (string): ISO 8601 timestamp

**Error Response (400 Bad Request):**

```json
{
  "error": {
    "type": "VALIDATION_ERROR",
    "message": "Invalid email address",
    "details": {
      "field": "email"
    }
  },
  "request_id": "550e8400-e29b-41d4-a716-446655440001",
  "timestamp": "2026-02-02T18:30:00Z"
}
```

---

### 2. Get Verification Status

Retrieve the current status and result of a verification request.

**Endpoint:** `GET /api/verify/:id`

**Path Parameters:**

- `id` (string, required): Verification request ID

**Response (200 OK):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "email": "user@example.com",
  "approved": true,
  "result": {
    "provider": "mock",
    "request_id": "eq-123456",
    "timestamp": "2026-02-02T18:30:05Z",
    "verification_id": "ver-789012",
    "status": "approved",
    "message": "Verification successful"
  },
  "created_at": "2026-02-02T18:30:00Z",
  "updated_at": "2026-02-02T18:30:05Z"
}
```

**Response Fields:**

- `id` (string): Verification request ID
- `status` (string): Current status
- `email` (string): Email address
- `approved` (boolean): Approval status (present when status is "completed")
- `result` (object): Detailed verification result (present when status is "completed")
- `error` (object): Error details (present when status is "failed")
- `created_at` (string): ISO 8601 timestamp
- `updated_at` (string): ISO 8601 timestamp

**Error Response (404 Not Found):**

```json
{
  "error": {
    "type": "NOT_FOUND",
    "message": "Verification request not found"
  },
  "request_id": "550e8400-e29b-41d4-a716-446655440001",
  "timestamp": "2026-02-02T18:30:00Z"
}
```

---

### 3. Retry Failed Verification

Retry a failed verification request.

**Endpoint:** `POST /api/verify/:id/retry`

**Path Parameters:**

- `id` (string, required): Verification request ID

**Request Body (Optional):**

```json
{
  "reason": "User requested retry"
}
```

**Response (200 OK):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "message": "Verification retry initiated"
}
```

**Error Response (404 Not Found):**

```json
{
  "error": {
    "type": "NOT_FOUND",
    "message": "Verification request not found"
  },
  "request_id": "550e8400-e29b-41d4-a716-446655440001",
  "timestamp": "2026-02-02T18:30:00Z"
}
```

---

### 4. Health Check

Check the health status of the API.

**Endpoint:** `GET /health`

**Response (200 OK):**

```json
{
  "status": "ok",
  "timestamp": "2026-02-02T18:30:00Z",
  "version": "1.0.0"
}
```

---

## Error Types

The API uses standardized error types:

- `VALIDATION_ERROR`: Invalid request data
- `NOT_FOUND`: Resource not found
- `INTERNAL_ERROR`: Internal server error
- `UNAUTHORIZED`: Authentication required or failed
- `VERIFICATION_FAILED`: Verification failed
- `VERIFICATION_TIMEOUT`: Verification timed out
- `EQUIFAX_API_ERROR`: Error from Equifax API
- `DATABASE_ERROR`: Database error

## Status Codes

- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `408 Request Timeout`: Request timed out
- `422 Unprocessable Entity`: Verification failed
- `500 Internal Server Error`: Server error

## Request ID Tracking

Every request is assigned a unique request ID (UUID) for debugging purposes. This ID is:

- Returned in the `X-Request-ID` response header
- Included in error responses as `request_id`
- Logged on the server for troubleshooting

You can provide your own request ID by including it in the request headers:

```
X-Request-ID: your-custom-request-id
```

## Rate Limiting

Rate limiting is currently disabled but will be enabled in production:

- Default: 60 requests per minute per IP
- Exceeded rate limit returns `429 Too Many Requests`

## CORS

The API supports Cross-Origin Resource Sharing (CORS) for the following origins:

- `http://localhost:5173` (Vite development server)
- `http://localhost:3000` (Alternative development server)

## Polling Recommendations

For checking verification status:

1. Submit verification request and receive `id`
2. Poll `GET /api/verify/:id` every 2-3 seconds
3. Stop polling when `status` is "completed" or "failed"
4. Maximum polling duration: 60 seconds
5. Implement exponential backoff if needed

## Example Usage

### Submit and Poll Verification

```javascript
// Submit verification
const submitResponse = await fetch('http://localhost:8080/api/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    license_number: 'DL123456789',
    input_method: 'manual'
  })
});

const { id } = await submitResponse.json();

// Poll for status
const pollInterval = setInterval(async () => {
  const statusResponse = await fetch(`http://localhost:8080/api/verify/${id}`);
  const data = await statusResponse.json();
  
  if (data.status === 'completed' || data.status === 'failed') {
    clearInterval(pollInterval);
    console.log('Verification complete:', data);
  }
}, 2000);
```

## Testing

For testing purposes, the API currently uses a mock verification provider with a 70% approval rate. This will be replaced with the actual Equifax integration in production.
