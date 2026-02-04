# SwiftVerify - Comprehensive Tenant Screening System

## Overview

SwiftVerify is a powerful tenant screening platform with multi-stage verification, landlord control, and comprehensive background checking capabilities. The system ensures compliance, fairness, and thorough tenant evaluation through a 5-stage automated workflow with landlord oversight.

## Key Features

### 🔐 Multi-Stage Verification Workflow
1. **Identity Verification** - Driver's license and email validation
2. **Employment Verification** - Equifax Work Number integration (mock)
3. **Background Checks** - Criminal record and credit screening
4. **Landlord Review** - Manual review of flagged applications
5. **Final Decision** - Reconciled automated and manual decisions

### 👨‍💼 Landlord Dashboard & Control
- View all tenant applications in real-time
- Review applications with background check flags
- Approve or deny with documented reasoning
- Analytics and reporting dashboard
- Customizable screening policies (coming soon)

### 🛡️ Criminal Record Handling
- **Automatic Flagging** - Applications with criminal records require landlord review
- **No Auto-Approval Bypass** - Flagged results cannot auto-approve without landlord review
- **Audit Trail** - All decisions are logged with reasoning
- **FCRA Compliance** - Built-in safeguards for fair screening practices

### 📊 Audit Trail & Appeals
- Complete application history logging
- Documented decision reasoning
- Appeal submission process
- Landlord response workflow

## Technology Stack

### Backend
- **Language**: Go 1.18+
- **Framework**: Gorilla Mux (REST API routing)
- **Database**: PostgreSQL with PostGIS
- **Authentication**: JWT tokens
- **APIs**: RESTful endpoints

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Installation

### Prerequisites
- Go 1.18 or higher
- Node.js 16+ and npm
- PostgreSQL 12+ (optional - system works with mock data)

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/CodieCCU/SwiftVerify.git
cd SwiftVerify
```

2. Install Go dependencies:
```bash
go mod download
```

3. (Optional) Set up PostgreSQL database:
```bash
# Create database
createdb swiftverify

# Run schema
psql swiftverify < database/schema.sql
```

4. Set environment variables (optional):
```bash
export DATABASE_URL="postgres://user:password@localhost/swiftverify?sslmode=disable"
export PORT=8080
```

5. Build and run the server:
```bash
go build -o server ./cmd/server
./server
```

The server will start on http://localhost:8080

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

4. Or build for production:
```bash
npm run build
npm run preview
```

The frontend will be available at http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (tenant/landlord)
- `POST /api/auth/login` - User login (returns JWT token)

### Applications
- `POST /api/applications` - Submit rental application
- `GET /api/applications/:id` - Get application details
- `POST /api/applications/:id/status` - Update application status

### Verification Services
- `POST /api/verification/equifax` - Employment verification
- `POST /api/verification/background-check` - Run background check

### Landlord Endpoints (Requires Authentication)
- `GET /api/landlord/applications` - Get all applications for review
- `POST /api/landlord/applications/:id/review` - Submit landlord review
- `POST /api/landlord/applications/:id/override` - Override automated decision
- `GET /api/landlord/analytics` - Get application analytics
- `POST /api/landlord/policies` - Create screening policy
- `GET /api/landlord/policies` - Get screening policies

### Appeals
- `POST /api/applications/:id/appeal` - Submit appeal
- `GET /api/applications/:id/appeals` - Get appeals for application

### System
- `GET /health` - Health check endpoint
- `/ws` - WebSocket endpoint (legacy)

## User Roles & Access

### Tenant
- Submit verification applications
- View application status
- Submit appeals if denied

**Default Login**: Any username/password combination
**Example**: username: `tenant@test.com`, password: `password`

### Landlord
- Review all applications
- Approve/deny with reasoning
- View analytics dashboard
- Manage screening policies

**Demo Login**: 
- Username: `landlord@swiftverify.com`
- Password: `landlord123`

### Admin
- Full system access
- All permissions

**Admin Login**:
- Username: `ADMINSWIFTVERIFYCODIE`
- Password: `Marine@781227@@@`

## Workflow Examples

### Tenant Application Process

1. **Login** as tenant
2. **Navigate** to home page → Click "Start Verification"
3. **Enter** email and driver's license number
4. **Wait** for multi-stage verification:
   - Identity verification (automated)
   - Employment verification (automated - mock Equifax)
   - Background check (automated - random results)
   - Landlord review (if flags raised)
   - Final decision
5. **View** result with detailed status

### Landlord Review Process

1. **Login** as landlord (`landlord@swiftverify.com` / `landlord123`)
2. **Dashboard** shows all applications
3. **Click "Review"** on pending applications
4. **View** application details including:
   - Applicant information
   - Verification stages completed
   - Background check flags
5. **Enter reasoning** (optional but recommended)
6. **Approve or Deny** the application
7. **View analytics** on dashboard

## Approval Decision Logic

The system implements the following decision flow:

```
IF automated_approval == true AND background_check_flags_found == true:
   REQUIRE landlord_manual_review = true
   SET status = "PENDING_LANDLORD_REVIEW"
   
IF landlord_policy matches disqualifying_criteria:
   DEFAULT status = "DENIED"
   REQUIRE landlord_approval_to_override = true
   
IF automated_denial == true AND landlord_wants_to_approve:
   ALLOW override WITH documented_reasoning
   AUDIT_LOG approval_override_details
```

This ensures:
- ✅ Automated approvals never bypass landlord judgment for flagged issues
- ✅ Criminal records always require manual review
- ✅ Landlords can override automated decisions
- ✅ All decisions are documented and auditable

## Database Schema

Key tables:
- `users` - User accounts (tenants, landlords, admins)
- `applications` - Rental applications with workflow status
- `identity_verifications` - Identity check results
- `employment_verifications` - Employment/income verification
- `background_checks` - Criminal and credit check results
- `screening_policies` - Landlord screening criteria
- `landlord_reviews` - Manual review decisions
- `application_audit_log` - Complete audit trail
- `appeals` - Tenant appeal submissions

## Security Features

- 🔒 JWT-based authentication
- 🔐 Password hashing with bcrypt
- 🛡️ CORS protection
- 📝 Audit logging for all critical actions
- 🔑 Role-based access control
- 🚫 SQL injection protection via parameterized queries

## Mock Data & Testing

The system works without a database connection using mock data:
- Random approval/denial simulation
- Mock employment data
- Simulated background check results
- In-memory application storage

This allows for easy testing and demonstration.

## Future Enhancements

- [ ] Real Equifax Work Number API integration
- [ ] Real background check service integration (e.g., Checkr, Sterling)
- [ ] Email notifications for status updates
- [ ] Document upload for appeals
- [ ] Advanced screening policy configuration UI
- [ ] Multi-property management
- [ ] Tenant application history
- [ ] Credit score integration
- [ ] Mobile app support

## Compliance & Legal

This system is designed to support compliance with:
- **FCRA** (Fair Credit Reporting Act)
- **Fair Housing Act**
- **State and local tenant screening laws**

⚠️ **Important**: Consult with legal counsel to ensure your use of this system complies with all applicable laws and regulations in your jurisdiction.

## Support

For questions or issues:
- Email: support@swiftverify.com
- GitHub Issues: https://github.com/CodieCCU/SwiftVerify/issues

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please see CONTRIBUTING.md for guidelines.

---

**Built with ❤️ for fair and efficient tenant screening**
