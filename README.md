# SwiftVerify - NO CREDIT CHECK Tenant Screening

## Project Overview
SwiftVerify is a **NO CREDIT CHECK** tenant screening platform that provides a "Path to Yes" for prospective tenants with poor or no credit history who can demonstrate stable employment and income.

## Core Mission
SwiftVerify exists to make housing accessible by removing credit barriers. We believe current financial stability matters more than past credit mistakes.

## How It Works

### For Tenants
SwiftVerify approves or denies rental applications based **ONLY** on:
1. ✅ **Identity Verification** - Driver's license validation
2. ✅ **Employment & Income Verification** - Via Equifax Work Number
3. ✅ **Criminal Background Screening** - Optional, per landlord policy

**We NEVER check your credit score or credit history.**

### For Landlords
Landlords using SwiftVerify must sign a binding **NO CREDIT CHECK Agreement** that:
- Prohibits them from conducting credit checks on SwiftVerify tenants
- Ensures they base decisions solely on verified identity, employment, and background
- Protects both landlords and tenants under FCRA and Fair Housing laws
- Violation results in account termination

## Key Features
- **Fast and efficient**: Get approved in minutes, not days
- **NO CREDIT CHECK**: Your credit score doesn't matter
- **Path to Yes**: Focused on current financial stability, not past credit mistakes  
- **Legal Protection**: Landlords avoid FCRA compliance burdens
- **Fair Housing**: Reduces disparate impact from credit-based screening
- **Comprehensive audit trail**: Full compliance logging for legal defense

## Application Workflow

```
SUBMITTED 
  → IDENTITY_VERIFIED 
  → EMPLOYMENT_VERIFIED 
  → BACKGROUND_CHECKED (if landlord requires)
  → LANDLORD_REVIEW_REQUIRED (if background flags found)
  → FINAL_DECISION (Landlord approves/denies)
  → APPROVED/DENIED

NO CREDIT CHECK STAGE AT ANY POINT
```

## Architecture

### Frontend (React + Vite)
- **Landing Page**: Prominent NO CREDIT CHECK messaging
- **Tenant Application**: Identity and employment verification flow
- **Landlord Agreement**: Required before platform access
- **Landlord Dashboard**: Review applications without credit data

### Backend (Go)
- WebSocket server for real-time verification
- REST API endpoints for identity, employment, and background checks
- **NO credit check endpoints** - these are explicitly prohibited

### Database (PostgreSQL)
- User and tenant application data
- Landlord agreement tracking with digital signatures
- Compliance audit logs
- **NO credit-related data stored**

## Installation

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
go run cmd/server/main.go
```

### Database
```bash
psql -U your_user -d your_database -f database/schema.sql
```

## Legal Compliance

### What We DON'T Do
- ❌ Credit checks or credit score evaluations
- ❌ Credit bureau inquiries (Equifax, Experian, TransUnion)
- ❌ Credit history analysis
- ❌ Consumer reports as defined by FCRA

### What We DO
- ✅ Identity verification via driver's license
- ✅ Employment verification via Equifax Work Number
- ✅ Income verification
- ✅ Criminal background checks (optional)
- ✅ Landlord agreement enforcement
- ✅ Compliance audit trails

## Documentation
- [Agreement Terms](docs/AgreementTerms.md) - Complete NO CREDIT CHECK legal agreement
- [API Documentation](docs/API.md) - Available endpoints (identity, employment, background only)

## Contributing
We welcome contributions that align with our NO CREDIT CHECK mission. Please ensure:
- No credit check functionality is introduced
- All changes maintain compliance with the NO CREDIT CHECK policy
- Code follows existing patterns for identity, employment, and background verification only

See [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
- **General Support**: [support@swiftverify.com](mailto:support@swiftverify.com)
- **Legal Questions**: [legal@swiftverify.com](mailto:legal@swiftverify.com)
- **Compliance**: [compliance@swiftverify.com](mailto:compliance@swiftverify.com)

---

**SwiftVerify: Your Path to Yes - NO CREDIT CHECK**

*Approved based on who you are today, not your credit history.*
