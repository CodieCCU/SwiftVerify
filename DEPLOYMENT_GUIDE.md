# SwiftVerify Deployment Guide for Community Centers

This guide provides instructions for deploying SwiftVerify in community outreach centers, homeless shelters, and other shared environments.

## Table of Contents
1. [Overview](#overview)
2. [System Requirements](#system-requirements)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Security Best Practices](#security-best-practices)
6. [Kiosk Mode Setup](#kiosk-mode-setup)
7. [Staff Training](#staff-training)
8. [Troubleshooting](#troubleshooting)

## Overview

SwiftVerify enables secure identity verification for housing applications in community settings, providing:
- Multi-factor authentication for enhanced security
- Staff-assisted mode for users needing help
- Automatic session clearing for privacy on shared devices
- Cross-platform compatibility (Windows, macOS, Linux, iOS, Android)
- Encrypted data transmission and storage

## System Requirements

### Minimum Requirements
- **Operating System**: 
  - Desktop: Windows 10+, macOS 10.14+, or Ubuntu 18.04+
  - Tablet: iOS 13+ or Android 8+
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 500MB free space
- **Internet**: 5 Mbps minimum (for video calls if needed)

### Recommended Setup
- Dedicated device or kiosk terminal
- Privacy screen or divider for confidential information
- Ethernet connection for stability (Wi-Fi as backup)
- Uninterruptible power supply (UPS)

## Installation

### Option 1: Web Application (Recommended)
1. Open a web browser on the device
2. Navigate to: `https://swiftverify.example.com`
3. Bookmark the page for easy access
4. (Optional) Install as PWA:
   - Chrome: Click menu → "Install SwiftVerify"
   - Safari: Share → "Add to Home Screen"

### Option 2: Server Deployment

#### Backend Server
```bash
# Clone repository
git clone https://github.com/CodieCCU/SwiftVerify.git
cd SwiftVerify

# Install Go dependencies
go mod download

# Generate SSL certificates (for production)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout server.key -out server.crt

# Set environment variables
export USE_HTTPS=true
export JWT_SECRET="your-secure-random-secret-here"
export PORT=8080

# Run server
go run cmd/server/main.go
```

#### Frontend Application
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=https://localhost:8080/api" > .env

# Build for production
npm run build

# Serve with a web server (e.g., nginx)
```

## Configuration

### Environment Variables

Create a `.env` file with the following:

```bash
# Backend Configuration
USE_HTTPS=true
TLS_CERT=/path/to/server.crt
TLS_KEY=/path/to/server.key
JWT_SECRET=your-very-long-random-secret-key
PORT=8080

# Database (if using PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=swiftverify
DB_USER=swiftverify_user
DB_PASSWORD=secure_password

# Frontend Configuration
VITE_API_URL=https://your-server.com/api
```

### Database Setup (PostgreSQL)

```bash
# Create database
createdb swiftverify

# Run schema
psql swiftverify < database/schema.sql

# Verify tables
psql swiftverify -c "\dt"
```

## Security Best Practices

### 1. SSL/TLS Certificate
- **Production**: Use certificates from a trusted CA (Let's Encrypt, DigiCert)
- **Development**: Self-signed certificates are acceptable

```bash
# Let's Encrypt (recommended for production)
sudo certbot certonly --standalone -d swiftverify.example.com
```

### 2. Firewall Configuration
```bash
# Allow only HTTPS traffic
sudo ufw allow 443/tcp
sudo ufw enable
```

### 3. Regular Updates
```bash
# Update system packages weekly
sudo apt update && sudo apt upgrade -y

# Update SwiftVerify monthly
git pull origin main
go mod download
npm install
```

### 4. User Data Protection
- Enable automatic session timeout (15 minutes)
- Clear browser data after each user session
- Use privacy screens in public areas
- Enable audit logging for compliance

### 5. Access Control
- Create separate accounts for staff and administrators
- Use strong passwords (minimum 12 characters)
- Enable MFA for all accounts
- Review audit logs weekly

## Kiosk Mode Setup

### Windows
1. Install Chrome browser
2. Create a shortcut with kiosk flag:
   ```
   "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk https://swiftverify.example.com
   ```
3. Set shortcut to run at startup
4. Enable Windows auto-login for kiosk account
5. Configure group policies to restrict access

### macOS
1. Install Chrome browser
2. Create shell script (`/usr/local/bin/swiftverify-kiosk.sh`):
   ```bash
   #!/bin/bash
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
     --kiosk https://swiftverify.example.com
   ```
3. Make executable: `chmod +x /usr/local/bin/swiftverify-kiosk.sh`
4. Add to login items in System Preferences

### Linux (Ubuntu)
1. Install Chrome:
   ```bash
   wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
   sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
   sudo apt update
   sudo apt install google-chrome-stable
   ```

2. Create kiosk user:
   ```bash
   sudo adduser kiosk
   ```

3. Configure auto-start:
   ```bash
   mkdir -p ~/.config/autostart
   cat > ~/.config/autostart/swiftverify.desktop <<EOF
   [Desktop Entry]
   Type=Application
   Name=SwiftVerify Kiosk
   Exec=google-chrome --kiosk https://swiftverify.example.com
   EOF
   ```

### Tablet Setup (iPad/Android)
1. Install Chrome or Safari
2. Navigate to SwiftVerify URL
3. Add to Home Screen for app-like experience
4. Enable Guided Access (iOS) or Screen Pinning (Android)

## Staff Training

### Essential Training Topics

1. **Privacy and Confidentiality**
   - Never share client information
   - Use privacy screens
   - Clear session data between clients
   - Report security incidents immediately

2. **Assisting Clients**
   - Explain the verification process
   - Help with document scanning/upload
   - Respect client privacy - let them enter sensitive info
   - Troubleshoot common issues

3. **System Operation**
   - Starting and ending sessions
   - Using staff-assisted mode
   - Uploading documents
   - Handling errors

4. **Emergency Procedures**
   - System down: Use backup internet/device
   - Technical issues: Contact IT support
   - Client concerns: Escalate to supervisor
   - Data breach: Follow incident response plan

### Quick Reference Card

```
┌─────────────────────────────────────────┐
│   SwiftVerify Quick Reference Guide     │
├─────────────────────────────────────────┤
│ 1. Start: Open browser → SwiftVerify    │
│ 2. Login with staff credentials         │
│ 3. Choose: Self-Service or Staff-Assist │
│ 4. Help client with verification        │
│ 5. Upload documents if needed           │
│ 6. Clear session: Click "Clear Data"    │
│ 7. Support: 1-800-VERIFY-HELP           │
└─────────────────────────────────────────┘
```

## Troubleshooting

### Common Issues

#### Cannot Connect to Server
```
Symptoms: "Cannot connect" or "Server unavailable"
Solutions:
1. Check internet connection
2. Verify server is running: curl https://swiftverify.example.com/api/health
3. Check firewall settings
4. Restart server if needed
```

#### MFA Code Not Working
```
Symptoms: "Invalid MFA code" error
Solutions:
1. Verify code was entered correctly
2. Check if code expired (codes valid for 5 minutes)
3. Request new code
4. Verify system time is correct (sync with NTP)
```

#### Document Upload Fails
```
Symptoms: Upload times out or fails
Solutions:
1. Check file size (max 10MB)
2. Verify file format (PDF, JPEG, PNG only)
3. Check internet speed
4. Try smaller file or compress PDF
```

#### Session Timeout
```
Symptoms: User logged out unexpectedly
Solutions:
1. Normal after 15 minutes of inactivity (security feature)
2. Save work frequently
3. Re-login to continue
```

### Log Files

Access logs for troubleshooting:

```bash
# Backend logs
tail -f /var/log/swiftverify/server.log

# Nginx logs (if using)
tail -f /var/log/nginx/error.log

# Audit logs
psql swiftverify -c "SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 20;"
```

## Support

### Contact Information
- **Technical Support**: support@swiftverify.com
- **Phone**: 1-800-VERIFY-HELP
- **Hours**: Monday-Friday, 8am-6pm PST
- **Emergency**: 24/7 hotline for critical issues

### Resources
- User Manual: https://docs.swiftverify.com
- Video Tutorials: https://training.swiftverify.com
- Community Forum: https://community.swiftverify.com
- GitHub Issues: https://github.com/CodieCCU/SwiftVerify/issues

## Compliance

SwiftVerify complies with:
- Fair Housing Act (FHA)
- General Data Protection Regulation (GDPR)
- California Consumer Privacy Act (CCPA)
- Health Insurance Portability and Accountability Act (HIPAA) guidelines
- Americans with Disabilities Act (ADA) accessibility standards

For compliance documentation and audit reports, contact: compliance@swiftverify.com
