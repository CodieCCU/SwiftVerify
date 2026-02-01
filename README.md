# SwiftVerify

## Project Overview
SwiftVerify is a powerful and flexible verification library built in Swift, designed to streamline and standardize the verification processes in Swift applications.

## Features
- **Fast and efficient**: Optimized for performance with minimal overhead.
- **Easy to integrate**: Simple API to get started quickly.
- **Comprehensive documentation**: Clear examples and usage instructions.
- **Immutable Logging System**: FCRA, GDPR, and CCPA compliant audit logging with tamper-proof storage.

## New: Immutable Logging System

SwiftVerify now includes a comprehensive immutable logging system designed for regulatory compliance. See [LOGGING.md](LOGGING.md) for detailed documentation.

### Key Features
- ✅ Append-only, immutable log storage
- ✅ SHA-256 hash chain for integrity verification
- ✅ Automatic sensitive data masking
- ✅ CSV and JSON export for analysis
- ✅ Real-time monitoring and alerting
- ✅ FCRA, GDPR, and CCPA compliant
- ✅ Frontend and backend comprehensive logging

See [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for complete implementation details.

## Installation
- You can add SwiftVerify to your project using Swift Package Manager. Add the following line to your `Package.swift` file:
  ```swift
  .package(url: "https://github.com/CodieCCU/SwiftVerify.git", from: "1.0.0")
  ```

## Usage
To get started, import SwiftVerify in your Swift files:
```swift
import SwiftVerify
```

### Example
Here's a quick example of how to use SwiftVerify:
```swift
let verification = Verification()
verification.validate(input: "example@example.com")
```  

### Backend Server
The Go backend server provides WebSocket support and comprehensive logging:
```bash
# Build and run the server
cd cmd/server
go build
./server
```

The server provides the following endpoints:
- `GET /health` - Health check with uptime
- `GET /ws` - WebSocket endpoint for real-time communication
- `POST /api/logs` - Log ingestion endpoint (for frontend)
- `GET /api/logs/export?format=csv` - Export logs as CSV
- `GET /api/logs/export?format=json` - Export logs as JSON

### Frontend Application
The React frontend includes comprehensive logging integration:
```bash
# Install dependencies and run
cd frontend
npm install
npm run dev
```

Configure the backend API URL in `.env`:
```
VITE_API_BASE_URL=http://localhost:8080
```

## Contributing
We welcome contributions from the community. Please check out our [contributing guidelines](CONTRIBUTING.md) for more information.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
For questions or support, please reach out to [support@swiftverify.com](mailto:support@swiftverify.com).

## Current Date and Time
2026-02-01 15:10:00 UTC
