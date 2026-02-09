# AWS SES Email Integration - Quick Start Guide

This guide helps you quickly set up and use the AWS SES email integration in SwiftVerify.

## 📋 Overview

SwiftVerify now includes production-ready email notifications using AWS Simple Email Service (SES). All placeholder email functions have been replaced with real AWS SES integration.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This installs the AWS SDK for SES and all other required dependencies.

### 2. Configure AWS Credentials

#### For Development (Local Testing)

Create a `.env.local` file in the `frontend` directory:

```bash
# Copy the example file
cp .env.example .env.local

# Edit with your AWS credentials
VITE_AWS_SES_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=your_access_key_here
VITE_AWS_SECRET_ACCESS_KEY=your_secret_key_here
VITE_AWS_SES_FROM_EMAIL=noreply@swift-verify.org
VITE_AWS_SES_REPLY_TO=support@swift-verify.org
```

#### For Production (Vercel)

Add environment variables in Vercel dashboard:
1. Go to your project → Settings → Environment Variables
2. Add each variable listed above
3. Deploy your changes

### 3. Verify Setup

Start the development server:

```bash
npm run dev
```

Check the browser console for:
```
✅ AWS SES Client initialized successfully
```

If you see this warning, credentials are not configured (emails will be simulated):
```
⚠️  AWS credentials not configured. Email sending will be simulated.
```

## 📧 Available Email Functions

### Send Denial Email
```javascript
import { sendDenialEmail } from './services/email';

await sendDenialEmail({
  email: 'applicant@example.com',
  reason: 'Income does not meet 3x rent requirement',
  applicationId: 'APP-2024-001',
  landlordEmail: 'landlord@example.com', // Optional, for CC
});
```

### Send Approval Email
```javascript
import { sendApprovalEmail } from './services/email';

await sendApprovalEmail({
  email: 'applicant@example.com',
  applicationId: 'APP-2024-001',
  propertyAddress: '123 Main St, Boise, ID 83702', // Optional
  leaseLink: 'https://swift-verify.org/lease-sign?id=APP-2024-001', // Optional
  landlordName: 'John Smith Properties', // Optional
});
```

### Send Waiver Email
```javascript
import { sendWaiverEmail } from './services/email';

await sendWaiverEmail({
  email: 'applicant@example.com',
  waiverAmount: 150.00,
  applicationId: 'APP-2024-001',
  landlordName: 'ABC Property Management', // Optional
  propertyAddress: '456 Elm St, Boise, ID 83702', // Optional
});
```

### Send Gap Pay Email
```javascript
import { sendGapPayEmail } from './services/email';

await sendGapPayEmail({
  email: 'applicant@example.com',
  gapAmount: 300.00,
  applicationId: 'APP-2024-001',
  monthlyRent: 1500.00, // Optional
  propertyAddress: '789 Oak Ave, Boise, ID 83702', // Optional
});
```

### Send Landlord Alert
```javascript
import { sendLandlordAlertEmail } from './services/email';

await sendLandlordAlertEmail({
  landlordEmail: 'landlord@example.com',
  applicantName: 'Jane Doe',
  propertyAddress: '123 Main St, Boise, ID 83702',
  applicationId: 'APP-2024-001',
  dashboardLink: 'https://swift-verify.org/landlord/dashboard', // Optional
});
```

### Send Account Created Email
```javascript
import { sendAccountCreatedEmail } from './services/email';

await sendAccountCreatedEmail({
  email: 'user@example.com',
  temporaryPassword: 'TempPass123!',
  dashboardLink: 'https://swift-verify.org/login', // Optional
});
```

## 📚 Documentation

- **[AWS SES Setup Guide](./docs/AWS_SES_SETUP.md)** - Complete AWS setup instructions
- **[Configuration Guide](./docs/AWS_SES_CONFIG.md)** - Environment configuration
- **[Email Templates Guide](./docs/EMAIL_TEMPLATES.md)** - Customize email designs
- **[Troubleshooting Guide](./docs/AWS_SES_TROUBLESHOOTING.md)** - Common issues and solutions
- **[Security Summary](./docs/SECURITY_SUMMARY.md)** - Security analysis and recommendations

## ✨ Features

### ✅ Production-Ready
- Real AWS SES integration (no more placeholders!)
- Comprehensive error handling
- Automatic retry logic (3 attempts with exponential backoff)
- Detailed logging for debugging

### ✅ Professional Email Templates
- Responsive HTML design
- SwiftVerify branding
- Legal disclaimers included
- Plain text fallback
- CAN-SPAM compliant

### ✅ Legal Compliance
- **Denial emails** include proper Equifax disclaimers
- **All emails** include unsubscribe links
- **Privacy notices** about SSN storage
- **30-day appeal window** information

### ✅ Developer-Friendly
- Simulation mode (works without AWS credentials)
- TypeScript-style JSDoc comments
- Comprehensive error messages
- Environment-based configuration

## 🔒 Security

- ✅ No credentials in code
- ✅ Environment variables for all secrets
- ✅ `.env.local` is gitignored
- ✅ Separate dev/prod credentials
- ✅ IAM user with minimal permissions
- ✅ No security vulnerabilities found

See [SECURITY_SUMMARY.md](./docs/SECURITY_SUMMARY.md) for full security analysis.

## 🧪 Testing

### Development Mode (No AWS Credentials)

Without AWS credentials, emails are simulated:

```javascript
// No credentials needed for UI development
// Set VITE_AWS_ACCESS_KEY_ID and VITE_AWS_SECRET_ACCESS_KEY to empty or omit them

// Output:
⚠️  AWS credentials not configured. Email sending will be simulated.
🔄 Simulating email send (no AWS credentials configured)
```

This is useful for:
- Frontend development
- UI/UX testing
- Quick prototyping

### With AWS Credentials

Set up AWS SES and use real email sending:

```javascript
// Configure .env.local with real credentials
VITE_AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
VITE_AWS_SECRET_ACCESS_KEY=wJalrXUt...

// Output:
✅ AWS SES Client initialized successfully
📧 AWS SES - Sending Denial Email
Recipient: test@example.com
✅ Email sent successfully via AWS SES
Message ID: 01000181234567890abc...
```

### Testing Email Templates

Preview email templates in browser console:

```javascript
const { denialEmailTemplate } = await import('/src/utils/emailTemplates.js');

const html = denialEmailTemplate({
  reason: 'Test reason',
  applicationId: 'TEST-123',
  appealDeadline: 'March 15, 2024'
});

console.log(html);
```

## 📊 Monitoring

### AWS Console
- **SES Dashboard** - View sending statistics
- **CloudWatch** - Monitor logs and metrics
- **SNS** - Set up bounce/complaint notifications

### Application Logs
All email sends are logged:
```javascript
📧 AWS SES - Sending Denial Email
Recipient: applicant@example.com
Application ID: APP-2024-001
✅ Email sent successfully via AWS SES
Message ID: 01000181234567890abc...
```

Failures are also logged:
```javascript
❌ Failed to send denial email: Email address is not verified
```

## 🚨 Troubleshooting

### Common Issues

**Problem:** "Email address is not verified"
- **Solution:** Verify sender email in AWS SES console
- See [Troubleshooting Guide](./docs/AWS_SES_TROUBLESHOOTING.md#authentication-errors)

**Problem:** Emails going to spam
- **Solution:** Set up SPF and DKIM records
- See [Troubleshooting Guide](./docs/AWS_SES_TROUBLESHOOTING.md#spam-issues)

**Problem:** Rate limiting errors
- **Solution:** Request production access or implement rate limiting
- See [Troubleshooting Guide](./docs/AWS_SES_TROUBLESHOOTING.md#rate-limiting-issues)

**Problem:** Environment variables not loading
- **Solution:** Ensure file is named `.env.local` and restart dev server
- See [Troubleshooting Guide](./docs/AWS_SES_TROUBLESHOOTING.md#configuration-problems)

## 🎯 Next Steps

1. **Set Up AWS SES** - Follow [AWS SES Setup Guide](./docs/AWS_SES_SETUP.md)
2. **Configure Environment** - Follow [Configuration Guide](./docs/AWS_SES_CONFIG.md)
3. **Customize Templates** - Follow [Email Templates Guide](./docs/EMAIL_TEMPLATES.md)
4. **Deploy to Production** - Use production checklist in [Configuration Guide](./docs/AWS_SES_CONFIG.md#production-deployment-checklist)

## 💡 Best Practices

1. **Use Separate Credentials** for dev/staging/production
2. **Monitor Bounce Rates** (keep under 5%)
3. **Monitor Complaint Rates** (keep under 0.1%)
4. **Test Templates** in multiple email clients
5. **Set Up CloudWatch Alerts** for failed sends
6. **Rotate Access Keys** regularly
7. **Never Commit Credentials** to git

## 📞 Support

- **Documentation Issues:** Open a GitHub issue
- **AWS SES Questions:** See [AWS SES Documentation](https://docs.aws.amazon.com/ses/)
- **SwiftVerify Support:** support@swift-verify.org

## 📄 License

This integration is part of the SwiftVerify application. See LICENSE file for details.

---

**Status:** ✅ Production Ready
**Last Updated:** 2026-02-09
**Version:** 1.0.0
