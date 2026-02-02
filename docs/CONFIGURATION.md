# Configuration Guide

## Overview

SwiftVerify uses environment variables for configuration management. This provides flexibility and security by keeping sensitive credentials separate from the codebase.

## Quick Start

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your configuration values

3. Start the server:
   ```bash
   go run cmd/server/main.go
   ```

## Environment Variables

### Server Configuration

#### SERVER_PORT
- **Description**: Port number the server listens on
- **Type**: String (number)
- **Default**: `8080`
- **Example**: `SERVER_PORT=8080`

#### SERVER_HOST
- **Description**: Host address the server binds to
- **Type**: String
- **Default**: `localhost`
- **Example**: `SERVER_HOST=0.0.0.0` (for all interfaces)

### Database Configuration

#### DB_HOST
- **Description**: PostgreSQL database host
- **Type**: String
- **Default**: `localhost`
- **Required**: No (app can run without database for testing)
- **Example**: `DB_HOST=localhost`

#### DB_PORT
- **Description**: PostgreSQL database port
- **Type**: String (number)
- **Default**: `5432`
- **Example**: `DB_PORT=5432`

#### DB_NAME
- **Description**: Database name
- **Type**: String
- **Default**: `swiftverify`
- **Example**: `DB_NAME=swiftverify`

#### DB_USER
- **Description**: Database user
- **Type**: String
- **Default**: `postgres`
- **Example**: `DB_USER=swiftverify_user`

#### DB_PASSWORD
- **Description**: Database password
- **Type**: String
- **Default**: Empty (app will run without DB if empty)
- **Required**: Yes (for production)
- **Example**: `DB_PASSWORD=secure_password_here`
- **Security**: Never commit this value

#### DB_SSL_MODE
- **Description**: PostgreSQL SSL mode
- **Type**: String
- **Default**: `disable`
- **Options**: `disable`, `require`, `verify-ca`, `verify-full`
- **Example**: `DB_SSL_MODE=require` (recommended for production)

### Equifax API Configuration

#### EQUIFAX_API_URL
- **Description**: Equifax Work Number API base URL
- **Type**: String (URL)
- **Required**: Yes (for production)
- **Default**: `https://api.equifax.com/business/trendeddata/v1`
- **Example**: `EQUIFAX_API_URL=https://sandbox.api.equifax.com/v1`

#### EQUIFAX_API_KEY
- **Description**: Equifax API key
- **Type**: String
- **Required**: Yes (for production)
- **Default**: Empty
- **Example**: `EQUIFAX_API_KEY=your_api_key_here`
- **Security**: Never commit this value
- **How to Obtain**: From Equifax Developer Portal

#### EQUIFAX_CLIENT_ID
- **Description**: Equifax OAuth2 client ID
- **Type**: String
- **Required**: Yes (for production)
- **Default**: Empty
- **Example**: `EQUIFAX_CLIENT_ID=your_client_id_here`
- **Security**: Never commit this value
- **How to Obtain**: From Equifax Developer Portal

#### EQUIFAX_CLIENT_SECRET
- **Description**: Equifax OAuth2 client secret
- **Type**: String
- **Required**: Yes (for production)
- **Default**: Empty
- **Example**: `EQUIFAX_CLIENT_SECRET=your_client_secret_here`
- **Security**: Never commit this value
- **How to Obtain**: From Equifax Developer Portal

#### EQUIFAX_TIMEOUT_SECONDS
- **Description**: Timeout for Equifax API requests
- **Type**: Integer
- **Default**: `30`
- **Example**: `EQUIFAX_TIMEOUT_SECONDS=60`

#### EQUIFAX_ENVIRONMENT
- **Description**: Equifax environment to use
- **Type**: String
- **Default**: `sandbox`
- **Options**: `sandbox`, `production`
- **Example**: `EQUIFAX_ENVIRONMENT=production`

### JWT Configuration

#### JWT_SECRET
- **Description**: Secret key for signing JWT tokens
- **Type**: String
- **Required**: Yes (for production)
- **Default**: Empty
- **Example**: `JWT_SECRET=your_long_random_secret_here`
- **Security**: Never commit this value, use a long random string
- **How to Generate**: `openssl rand -base64 32`

#### JWT_EXPIRATION_HOURS
- **Description**: JWT token expiration time
- **Type**: Integer (hours)
- **Default**: `24`
- **Example**: `JWT_EXPIRATION_HOURS=48`

### Logging Configuration

#### LOG_LEVEL
- **Description**: Minimum log level to output
- **Type**: String
- **Default**: `info`
- **Options**: `debug`, `info`, `warn`, `error`, `fatal`, `panic`
- **Example**: `LOG_LEVEL=debug` (for development)
- **Example**: `LOG_LEVEL=warn` (for production)

#### LOG_FORMAT
- **Description**: Log output format
- **Type**: String
- **Default**: `json`
- **Options**: `json`, `text`
- **Example**: `LOG_FORMAT=text` (more readable for development)
- **Example**: `LOG_FORMAT=json` (better for production log aggregation)

### CORS Configuration

#### CORS_ALLOWED_ORIGINS
- **Description**: Comma-separated list of allowed CORS origins
- **Type**: String (comma-separated URLs)
- **Default**: `http://localhost:5173,http://localhost:3000`
- **Example**: `CORS_ALLOWED_ORIGINS=https://swiftverify.com,https://app.swiftverify.com`

#### CORS_ALLOWED_METHODS
- **Description**: Comma-separated list of allowed HTTP methods
- **Type**: String (comma-separated)
- **Default**: `GET,POST,PUT,DELETE,OPTIONS`
- **Example**: `CORS_ALLOWED_METHODS=GET,POST,DELETE`

#### CORS_ALLOWED_HEADERS
- **Description**: Comma-separated list of allowed HTTP headers
- **Type**: String (comma-separated)
- **Default**: `Content-Type,Authorization`
- **Example**: `CORS_ALLOWED_HEADERS=Content-Type,Authorization,X-Request-ID`

## Configuration Validation

The application validates required configuration on startup:

**Required for Production**:
- `EQUIFAX_API_URL`
- `EQUIFAX_API_KEY`
- `EQUIFAX_CLIENT_ID`
- `EQUIFAX_CLIENT_SECRET`
- `JWT_SECRET`
- `DB_PASSWORD`

**Currently Disabled**: Configuration validation is commented out in `main.go` to allow running without Equifax credentials during development. Uncomment when ready for production.

## Configuration by Environment

### Development

```bash
# Minimal configuration for local development
SERVER_PORT=8080
LOG_LEVEL=debug
LOG_FORMAT=text
DB_PASSWORD=dev_password
EQUIFAX_ENVIRONMENT=sandbox
```

### Staging

```bash
# Configuration for staging environment
SERVER_PORT=8080
SERVER_HOST=0.0.0.0
DB_HOST=staging-db.example.com
DB_PASSWORD=${DB_PASSWORD}  # From secrets manager
DB_SSL_MODE=require
EQUIFAX_ENVIRONMENT=sandbox
EQUIFAX_API_KEY=${EQUIFAX_SANDBOX_KEY}
EQUIFAX_CLIENT_ID=${EQUIFAX_SANDBOX_CLIENT_ID}
EQUIFAX_CLIENT_SECRET=${EQUIFAX_SANDBOX_CLIENT_SECRET}
JWT_SECRET=${JWT_SECRET}
LOG_LEVEL=info
LOG_FORMAT=json
CORS_ALLOWED_ORIGINS=https://staging.swiftverify.com
```

### Production

```bash
# Configuration for production environment
SERVER_PORT=8080
SERVER_HOST=0.0.0.0
DB_HOST=prod-db.example.com
DB_PORT=5432
DB_SSL_MODE=require
DB_PASSWORD=${DB_PASSWORD}  # From secrets manager
EQUIFAX_ENVIRONMENT=production
EQUIFAX_API_URL=https://api.equifax.com/business/trendeddata/v1
EQUIFAX_API_KEY=${EQUIFAX_PROD_KEY}
EQUIFAX_CLIENT_ID=${EQUIFAX_PROD_CLIENT_ID}
EQUIFAX_CLIENT_SECRET=${EQUIFAX_PROD_CLIENT_SECRET}
JWT_SECRET=${JWT_SECRET}
LOG_LEVEL=warn
LOG_FORMAT=json
CORS_ALLOWED_ORIGINS=https://swiftverify.com
```

## Security Best Practices

1. **Never Commit Secrets**: The `.gitignore` file excludes `.env` files
2. **Use Secret Management**: In production, use AWS Secrets Manager, HashiCorp Vault, etc.
3. **Rotate Credentials**: Regularly rotate API keys and secrets
4. **Principle of Least Privilege**: Use database users with minimal required permissions
5. **Environment Isolation**: Use separate credentials for dev, staging, and production
6. **Audit Access**: Log who accesses sensitive configuration
7. **Encrypt at Rest**: Use encryption for configuration files in production

## Testing Configuration

For testing, you can override configuration programmatically:

```go
import "github.com/CodieCCU/SwiftVerify/internal/config"

// Create test configuration
testConfig := &config.Config{
    Server: config.ServerConfig{
        Port: "8081",
        Host: "localhost",
    },
    // ... other config
}
```

## Troubleshooting

### "Configuration validation failed"

**Problem**: Missing required environment variables

**Solution**: Check that all required variables are set in `.env`:
- EQUIFAX_API_URL
- EQUIFAX_API_KEY
- EQUIFAX_CLIENT_ID
- EQUIFAX_CLIENT_SECRET
- JWT_SECRET
- DB_PASSWORD

### "Failed to connect to database"

**Problem**: Database connection parameters incorrect

**Solution**:
1. Verify PostgreSQL is running: `pg_isready`
2. Check DB_HOST, DB_PORT, DB_USER, DB_PASSWORD
3. Ensure database exists: `createdb swiftverify`
4. Check network connectivity

### Configuration not loading

**Problem**: `.env` file not found or not loaded

**Solution**:
1. Ensure `.env` is in the project root directory
2. Check file permissions: `chmod 600 .env`
3. Verify environment variables: `printenv | grep EQUIFAX`

## Additional Resources

- [Environment Variables Best Practices](https://12factor.net/config)
- [Equifax Developer Portal](https://developer.equifax.com/)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)
