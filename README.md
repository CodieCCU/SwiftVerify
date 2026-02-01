# SwiftVerify

## Project Overview
SwiftVerify is a comprehensive and secure identity verification platform designed specifically for housing applications. The system enables remote, cross-platform verification with enhanced security features, making it accessible to vulnerable populations through community outreach centers and shelters.

## Key Features

### 🔒 **Security & Compliance**
- **SSL/TLS Encryption**: End-to-end encryption for all data transmission
- **Multi-Factor Authentication (MFA)**: Additional security layer with 2FA support
- **JWT-based Authentication**: Secure token-based session management
- **Audit Logging**: Comprehensive activity tracking for compliance and security
- **Data Privacy**: GDPR, CCPA, and FHA compliant

### 💻 **Cross-Platform Compatibility**
- **Desktop Support**: Windows, macOS, and Linux
- **Mobile Support**: iOS and Android tablets/phones
- **Progressive Web App (PWA)**: Install as standalone app on any device
- **Browser Independent**: Works in Chrome, Firefox, Safari, and Edge
- **Responsive Design**: Optimized for all screen sizes

### 🤝 **Community Outreach Features**
- **Staff-Assisted Mode**: Counselors can help users while maintaining privacy
- **Kiosk Mode**: Designed for shared devices in shelters and community centers
- **Session Privacy**: Automatic data clearing between users
- **Touch-Friendly UI**: Optimized for tablets in public spaces

### 💰 **Security Deposit Alternatives**
- **Income Verification**: Upload proof of income for low-deposit programs
- **Document Upload**: Support for pay stubs, bank statements, tax returns
- **Low-Deposit Mode**: Special processing for reduced security deposit programs
- **Financial Assessment**: AI-assisted verification for expedited processing

### 📱 **User-Friendly Interface**
- **Intuitive Design**: Simple, clean interface for all users
- **Accessibility**: WCAG compliant for users with disabilities
- **Multiple Input Methods**: Manual entry or document scanning
- **Real-time Feedback**: Instant validation and error messages
- **Multi-language Support**: (Coming soon)

## Architecture

### Backend (Go)
- RESTful API with Gorilla Mux router
- WebSocket support for real-time updates
- PostgreSQL database with PostGIS for location services
- Secure file upload handling
- JWT authentication middleware

### Frontend (React)
- Single Page Application (SPA) with React Router
- Axios for API communication
- PWA with offline capability
- Responsive CSS for all devices
- Service Worker for caching

## Installation

### Prerequisites
- Go 1.18 or higher
- Node.js 16 or higher
- PostgreSQL 13+ with PostGIS extension
- SSL certificate (for production)

### Backend Setup

```bash
# Clone repository
git clone https://github.com/CodieCCU/SwiftVerify.git
cd SwiftVerify

# Install Go dependencies
go mod download

# Set up environment variables
export USE_HTTPS=true
export JWT_SECRET="your-secure-secret-key"
export PORT=8080

# Generate SSL certificates (development)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout server.key -out server.crt

# Set up database
createdb swiftverify
psql swiftverify < database/schema.sql

# Run server
go run cmd/server/main.go
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:8080/api" > .env

# Run development server
npm run dev

# Build for production
npm run build
```

## Usage

### For End Users
1. Access SwiftVerify through your web browser or installed PWA
2. Log in with your credentials (MFA required)
3. Choose verification method:
   - **Self-Service**: Complete verification independently
   - **Staff-Assisted**: Get help from a counselor
4. Upload income documents if applying for low-deposit programs
5. Complete identity verification with driver's license
6. Receive instant verification results

### For Community Centers
1. Set up dedicated kiosk or tablet
2. Configure for automatic login (staff credentials)
3. Enable privacy mode and automatic session clearing
4. Train staff on assisting users
5. Monitor audit logs for compliance

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed setup instructions.

## API Endpoints

### Authentication
- `POST /api/login` - User login with username/password
- `POST /api/mfa/verify` - Verify MFA code
- `POST /api/logout` - End user session

### Verification
- `POST /api/verify` - Submit verification request
- `POST /api/upload` - Upload supporting documents
- `GET /api/audit/logs` - Retrieve audit logs (admin)

### Health
- `GET /api/health` - Server health check

### WebSocket
- `GET /api/ws` - WebSocket connection for real-time updates

## Security Best Practices

### For Production Deployment
1. **Use valid SSL/TLS certificates** from a trusted CA (Let's Encrypt recommended)
2. **Set strong JWT secret** (minimum 32 characters, random)
3. **Enable firewall** to restrict access to necessary ports only
4. **Regular updates** of dependencies and system packages
5. **Database encryption** at rest and in transit
6. **Regular security audits** and penetration testing
7. **Monitor audit logs** for suspicious activity
8. **Implement rate limiting** to prevent abuse
9. **Use environment variables** for sensitive configuration
10. **Regular backups** of database and user data

### For Community Deployments
- Use privacy screens on public devices
- Clear browser data between sessions
- Enable automatic timeout (15 minutes)
- Train staff on privacy protocols
- Regular security awareness training
- Incident response plan in place

## Testing

```bash
# Backend tests (when implemented)
go test ./...

# Frontend tests (when implemented)
cd frontend
npm test
```

## Contributing
We welcome contributions from the community! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Compliance

SwiftVerify complies with:
- **Fair Housing Act (FHA)**: No discrimination in housing applications
- **GDPR**: European data protection regulations
- **CCPA**: California consumer privacy rights
- **WCAG 2.1 Level AA**: Web accessibility standards
- **SOC 2 Type II**: Security and availability controls

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

### Documentation
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Detailed setup instructions
- [API Documentation](docs/API.md) - REST API reference (coming soon)
- [User Manual](docs/USER_MANUAL.md) - End user guide (coming soon)

### Contact
- **Email**: support@swiftverify.com
- **Phone**: 1-800-VERIFY-HELP
- **Website**: https://swiftverify.com
- **GitHub Issues**: https://github.com/CodieCCU/SwiftVerify/issues

### Community
- **Forum**: https://community.swiftverify.com
- **Slack**: https://swiftverify.slack.com
- **Twitter**: @SwiftVerify

## Roadmap

### Upcoming Features
- [ ] Multi-language support (Spanish, Mandarin, Vietnamese)
- [ ] Biometric authentication (fingerprint, face ID)
- [ ] Integration with major housing platforms
- [ ] Mobile native apps (iOS/Android)
- [ ] Advanced analytics dashboard
- [ ] API for third-party integrations
- [ ] Blockchain-based verification (experimental)
- [ ] Video call support for remote assistance

## Acknowledgments

Special thanks to:
- Community outreach organizations for their valuable feedback
- Housing advocacy groups for their support
- Open source community for the amazing tools and libraries

## Current Date and Time
2026-02-01 17:09:19 UTC

