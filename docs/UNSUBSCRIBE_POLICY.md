# SwiftVerify Unsubscribe Policy

## Overview

SwiftVerify provides an **IMMEDIATE** email unsubscribe mechanism that processes requests in less than 1 second and permanently logs all actions for compliance and audit purposes.

## Key Features

### 1. Immediate Processing
- Unsubscribe requests are processed **immediately** upon receipt
- No confirmation emails required
- No delays or waiting periods
- User is removed from mailing list in < 1 second

### 2. Prominent Unsubscribe Button
Every email sent by SwiftVerify includes:
- Large, red "UNSUBSCRIBE IMMEDIATELY" button
- Placed at **both** the top (before content) and bottom of email
- Clear, contrasting color (#dc3545 - Bootstrap danger red)
- Mobile-responsive and clickable on all devices
- Unique unsubscribe token per recipient

### 3. Legal Disclosure
Every email includes:
```
Unsubscribe from SwiftVerify emails: Your unsubscribe request is processed IMMEDIATELY. 
This action is permanently logged and audited at SwiftVerify, LLC.
```

### 4. Unique Security Tokens
- Each email includes a unique HMAC-SHA256 token
- Tokens expire after 90 days
- Token includes email hash to prevent manipulation
- One-time use for security

### 5. Immutable Audit Trail
Every unsubscribe is logged with:
- Timestamp (microsecond precision)
- User email address
- IP address of requester
- User agent (browser/device)
- Optional unsubscribe reason
- Cannot be deleted or modified

## Unsubscribe Process

### For Users

1. **Click Unsubscribe Button** in any SwiftVerify email
2. **Verify Action** on confirmation page
3. **Optional:** Provide reason for unsubscribing
4. **Click "Unsubscribe Immediately"**
5. **Receive Confirmation** - process complete

### Technical Flow

```
User clicks unsubscribe link
  ↓
Token is verified
  ↓
Unsubscribe page loads
  ↓
User confirms action
  ↓
POST /api/email/unsubscribe/:token
  ↓
Email added to unsubscribe list IMMEDIATELY
  ↓
Audit log entry created (immutable)
  ↓
200 OK response with confirmation
  ↓
Future emails to this user are SKIPPED
```

## Email Types Covered

All SwiftVerify emails include unsubscribe:
1. **Denial Emails** - Application updates
2. **Approval Emails** - Application approvals
3. **Waiver Emails** - Waiver form requirements
4. **Gap Pay Emails** - Gap payment coverage
5. **Landlord Alerts** - Property management alerts

## Re-subscription Policy

### User-Initiated
Once unsubscribed, users **cannot** resubscribe themselves. This prevents:
- Accidental re-subscription
- Unauthorized re-subscription by third parties
- Compliance violations

### Admin Re-subscription
Only system administrators can re-subscribe a user:
1. Must have valid business reason
2. Must be documented in removal_notes
3. Action is logged in audit trail
4. Requires admin_user_id

## Compliance

### CAN-SPAM Act
✅ Clear identification of message as advertisement
✅ Unsubscribe option in every email
✅ Unsubscribe processed within 10 days (ours: IMMEDIATE)
✅ Physical address in footer
✅ Clear subject line
✅ Honor opt-out list

### GDPR (if applicable)
✅ Right to be forgotten
✅ Unsubscribe logged immediately
✅ Data deletion request handling
✅ Audit trail for compliance

### State Laws
✅ Compliant with Idaho state laws
✅ Compliant with California privacy laws
✅ Transparent data handling

## Audit Logging

### What is Logged
- Action type: `email_unsubscribe`
- Email address
- Timestamp (UTC, microsecond precision)
- IP address
- User agent
- Unsubscribe reason (if provided)
- Admin user ID (if admin-initiated)

### Log Retention
- Audit logs retained for **7 years** (2,555 days)
- Logs are **immutable** - cannot be modified or deleted
- Monthly audit reports generated
- Logs encrypted at rest

### Access Control
- Audit logs accessible only to:
  - System administrators
  - Compliance officers
  - Legal team (upon request)
- All access is logged

## Email Queue Behavior

### Pre-Send Check
Before sending ANY email:
1. Check if recipient is in unsubscribe list
2. If YES:
   - Skip email send
   - Log attempted send to unsubscribed user
   - Mark email as "skipped" with reason
3. If NO:
   - Proceed with send
   - Log successful send

### Retry Logic
- Failed emails retry up to 3 times
- 5-minute delay between retries
- Unsubscribe check performed before EACH retry
- If user unsubscribes during retry window, email is skipped

## Privacy & Data Retention

### Data Stored
- Email address (hashed and plain text)
- Unsubscribe timestamp
- IP address
- User agent
- Unsubscribe reason (optional)

### Data Retention
- Unsubscribe records: Indefinite (compliance requirement)
- Audit logs: 7 years minimum
- Email logs: 1 year

### Data Access
Users can request:
- Copy of their unsubscribe record
- Copy of audit logs related to their email
- Deletion of personal data (except compliance records)

## API Endpoints

### Public Endpoints
- `POST /api/email/unsubscribe/:token` - Process unsubscribe
- `GET /api/email/unsubscribe/verify/:token` - Verify token

### Admin Endpoints (Authentication Required)
- `POST /api/admin/unsubscribe/list` - List all unsubscribes
- `POST /api/admin/unsubscribe/audit` - View audit logs

## Support & Contact

For questions about unsubscribe or privacy:
- **Email:** support@swift-verify.org
- **Website:** https://swift-verify.org
- **Address:** SwiftVerify, LLC, Boise, Idaho

## Monthly Audit Reports

SwiftVerify generates monthly audit reports containing:
- Total unsubscribe requests
- Unsubscribe rate by email type
- Failed unsubscribe attempts
- Admin-initiated re-subscriptions
- Compliance status

Reports are available to:
- Executive team
- Compliance officers
- Legal team

## Changes to This Policy

This unsubscribe policy may be updated from time to time. Changes will be:
- Posted on our website
- Emailed to users (if applicable)
- Logged in audit trail

Last Updated: 2026-02-09
Version: 1.0
