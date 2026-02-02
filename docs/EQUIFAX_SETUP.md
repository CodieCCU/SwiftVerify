# Equifax Work Number Integration Setup Guide

## Overview

This guide explains how to integrate the Equifax Work Number API with SwiftVerify once you have obtained the necessary credentials and access.

## Prerequisites

1. **Equifax Developer Account**: Sign up at [https://developer.equifax.com/](https://developer.equifax.com/)
2. **API Credentials**: Obtain from Equifax:
   - Client ID
   - Client Secret
   - API Key
3. **Environment Access**: Determine if you'll be using sandbox or production

## Step 1: Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Edit `.env` and fill in your Equifax credentials:

```bash
# Equifax Work Number API Configuration
EQUIFAX_API_URL=https://api.equifax.com/business/trendeddata/v1
EQUIFAX_API_KEY=your_actual_api_key_here
EQUIFAX_CLIENT_ID=your_actual_client_id_here
EQUIFAX_CLIENT_SECRET=your_actual_client_secret_here
EQUIFAX_TIMEOUT_SECONDS=30
EQUIFAX_ENVIRONMENT=sandbox  # or "production"
```

3. **IMPORTANT**: Never commit `.env` to version control. The `.gitignore` file is already configured to exclude it.

## Step 2: Database Setup

1. Ensure PostgreSQL is installed and running
2. Create the database:

```bash
createdb swiftverify
```

3. Run the migrations:

```bash
psql -d swiftverify -f database/schema.sql
psql -d swiftverify -f database/migrations/001_create_verification_tables.sql
```

4. Update database credentials in `.env`:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=swiftverify
DB_USER=postgres
DB_PASSWORD=your_database_password
DB_SSL_MODE=disable  # or "require" for production
```

## Step 3: Implement Equifax Provider

Create a new file `internal/services/verification/equifax_provider.go`:

```go
package verification

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/CodieCCU/SwiftVerify/internal/config"
	"github.com/CodieCCU/SwiftVerify/internal/logger"
	"github.com/CodieCCU/SwiftVerify/internal/models"
)

// EquifaxProvider implements the Provider interface for Equifax Work Number API
type EquifaxProvider struct {
	config     *config.EquifaxConfig
	httpClient *http.Client
	apiToken   string
}

// NewEquifaxProvider creates a new Equifax provider
func NewEquifaxProvider(cfg *config.EquifaxConfig) (*EquifaxProvider, error) {
	provider := &EquifaxProvider{
		config: cfg,
		httpClient: &http.Client{
			Timeout: cfg.Timeout,
		},
	}

	// Authenticate and get token
	if err := provider.authenticate(); err != nil {
		return nil, fmt.Errorf("failed to authenticate with Equifax: %w", err)
	}

	return provider, nil
}

// authenticate obtains an API token from Equifax
func (e *EquifaxProvider) authenticate() error {
	// TODO: Implement OAuth2 authentication flow
	// This is a placeholder - implement according to Equifax's authentication requirements
	
	req, err := http.NewRequest("POST", e.config.APIURL+"/oauth/token", nil)
	if err != nil {
		return err
	}

	req.SetBasicAuth(e.config.ClientID, e.config.ClientSecret)
	req.Header.Set("Content-Type", "application/json")

	resp, err := e.httpClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("authentication failed with status: %d", resp.StatusCode)
	}

	var tokenResp struct {
		AccessToken string `json:"access_token"`
		ExpiresIn   int    `json:"expires_in"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
		return err
	}

	e.apiToken = tokenResp.AccessToken
	return nil
}

// Verify submits a verification request to Equifax
func (e *EquifaxProvider) Verify(ctx context.Context, email, licenseNumber string) (*VerificationResult, error) {
	logger.WithFields(map[string]interface{}{
		"email":    email,
		"provider": "equifax",
	}).Info("Submitting verification to Equifax")

	// TODO: Implement actual Equifax API call
	// This is a placeholder - implement according to Equifax's API specification
	
	// Create request payload
	payload := map[string]interface{}{
		"email":          email,
		"licenseNumber":  licenseNumber,
		"requestTime":    time.Now().Format(time.RFC3339),
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(ctx, "POST", e.config.APIURL+"/verify", bytes.NewReader(payloadBytes))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+e.apiToken)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-API-Key", e.config.APIKey)

	resp, err := e.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return nil, fmt.Errorf("equifax API error (status %d): %s", resp.StatusCode, string(body))
	}

	// Parse response
	var equifaxResp struct {
		RequestID string `json:"request_id"`
		Status    string `json:"status"`
		Approved  bool   `json:"approved"`
		Data      map[string]interface{} `json:"data"`
	}

	if err := json.Unmarshal(body, &equifaxResp); err != nil {
		return nil, err
	}

	result := &VerificationResult{
		RequestID:      equifaxResp.RequestID,
		Status:         equifaxResp.Status,
		Approved:       equifaxResp.Approved,
		ResponseData:   models.JSONB(equifaxResp.Data),
		ProviderStatus: equifaxResp.Status,
		Timestamp:      time.Now(),
	}

	logger.WithFields(map[string]interface{}{
		"email":      email,
		"approved":   result.Approved,
		"request_id": result.RequestID,
		"provider":   "equifax",
	}).Info("Equifax verification completed")

	return result, nil
}

// GetStatus retrieves the status of a verification request
func (e *EquifaxProvider) GetStatus(ctx context.Context, requestID string) (*VerificationResult, error) {
	logger.WithFields(map[string]interface{}{
		"request_id": requestID,
		"provider":   "equifax",
	}).Info("Checking Equifax verification status")

	// TODO: Implement actual Equifax status check
	// This is a placeholder
	
	req, err := http.NewRequestWithContext(ctx, "GET", e.config.APIURL+"/verify/"+requestID, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+e.apiToken)
	req.Header.Set("X-API-Key", e.config.APIKey)

	resp, err := e.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// Parse and return result
	// Implementation depends on Equifax API specification
	
	return nil, nil
}

// Name returns the name of the provider
func (e *EquifaxProvider) Name() string {
	return "Equifax Work Number"
}
```

## Step 4: Update main.go to Use Equifax Provider

In `cmd/server/main.go`, replace the mock provider initialization:

```go
// Replace this:
provider := verification.NewMockProvider(0.7)

// With this:
provider, err := verification.NewEquifaxProvider(&cfg.Equifax)
if err != nil {
	logger.Errorf("Failed to initialize Equifax provider: %v", err)
	logger.Warn("Falling back to mock provider")
	provider = verification.NewMockProvider(0.7)
}
```

## Step 5: Test the Integration

1. Start the server:

```bash
go run cmd/server/main.go
```

2. Submit a test verification:

```bash
curl -X POST http://localhost:8080/api/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "license_number": "DL123456789",
    "input_method": "manual"
  }'
```

3. Check the status:

```bash
curl http://localhost:8080/api/verify/<verification-id>
```

## Step 6: Monitor and Debug

1. Check logs for any errors:
   - Logs are output to stdout in JSON format
   - Each request has a unique `request_id` for tracking

2. Common issues:
   - **Authentication failures**: Verify credentials in `.env`
   - **Network errors**: Check firewall and network connectivity
   - **API errors**: Review Equifax API documentation for error codes

## Security Considerations

### Production Checklist

1. **Environment Variables**:
   - Never commit `.env` or credentials to version control
   - Use environment variable injection in production (e.g., Kubernetes secrets)

2. **Database**:
   - Enable SSL mode: `DB_SSL_MODE=require`
   - Use strong passwords
   - Encrypt sensitive data (license numbers) at rest
   - Implement regular backups

3. **API Security**:
   - Enable JWT authentication
   - Implement rate limiting
   - Use HTTPS only
   - Validate all inputs
   - Implement proper CORS policies

4. **Logging**:
   - Never log sensitive data (license numbers, credentials)
   - Log all verification attempts (without PII)
   - Monitor for suspicious activity

5. **Error Handling**:
   - Don't expose internal errors to clients
   - Log detailed errors server-side
   - Return generic error messages to clients

## Equifax API Documentation

Refer to the official Equifax Work Number API documentation:

- **Developer Portal**: [https://developer.equifax.com/](https://developer.equifax.com/)
- **API Reference**: Available after signing up
- **Support**: Contact Equifax developer support for integration questions

## Fallback Strategy

The system is designed to gracefully handle Equifax API failures:

1. **Automatic Retry**: Failed verifications can be retried using the `/api/verify/:id/retry` endpoint
2. **Error Logging**: All errors are logged in the `verification_error_logs` table
3. **Mock Provider Fallback**: For testing, the system can fall back to the mock provider

## Next Steps

1. Obtain Equifax credentials
2. Implement the Equifax provider according to their API specification
3. Add unit and integration tests
4. Perform load testing
5. Deploy to staging environment
6. Obtain Equifax production credentials
7. Deploy to production

## Support

For questions about this integration:

- **Technical Issues**: Open an issue in the GitHub repository
- **Equifax API**: Contact Equifax developer support
- **Security Concerns**: Email security@swiftverify.com
