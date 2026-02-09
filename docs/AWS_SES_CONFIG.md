# AWS SES Configuration Guide

This guide covers how to configure AWS SES for SwiftVerify in different environments (development, staging, production).

## Table of Contents

1. [Environment Variables](#environment-variables)
2. [Frontend Configuration](#frontend-configuration)
3. [Backend Configuration](#backend-configuration-optional)
4. [Vercel Deployment](#vercel-deployment)
5. [Local Development](#local-development)
6. [Production Deployment Checklist](#production-deployment-checklist)

## Environment Variables

### Required Variables

SwiftVerify uses these environment variables for AWS SES integration:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_AWS_SES_REGION` | AWS region for SES | `us-east-1` | Yes |
| `VITE_AWS_ACCESS_KEY_ID` | AWS IAM access key ID | `AKIAIOSFODNN7EXAMPLE` | Yes |
| `VITE_AWS_SECRET_ACCESS_KEY` | AWS IAM secret access key | `wJalrXUt...` | Yes |
| `VITE_AWS_SES_FROM_EMAIL` | Sender email address | `noreply@swift-verify.org` | Yes |
| `VITE_AWS_SES_REPLY_TO` | Reply-to email address | `support@swift-verify.org` | Yes |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_APP_URL` | Application URL | `https://www.swift-verify.org` |
| `VITE_SUPPORT_EMAIL` | Support contact email | `support@swiftverify.com` |

## Frontend Configuration

### Step 1: Copy Environment Template

```bash
cd frontend
cp .env.example .env.local
```

### Step 2: Edit .env.local

Open `.env.local` and update with your actual values:

```bash
# AWS SES Configuration
VITE_AWS_SES_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
VITE_AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
VITE_AWS_SES_FROM_EMAIL=noreply@swift-verify.org
VITE_AWS_SES_REPLY_TO=support@swift-verify.org

# Application Settings
VITE_APP_URL=https://www.swift-verify.org
VITE_SUPPORT_EMAIL=support@swiftverify.com
```

**⚠️ Important:**
- Never commit `.env.local` to git
- Ensure `.env.local` is in `.gitignore`
- Use different credentials for development and production

### Step 3: Verify .gitignore

Ensure `.env.local` is ignored:

```bash
# .gitignore should contain:
.env
.env.local
.env.*.local
```

### Step 4: Install Dependencies

```bash
npm install
```

This will install the AWS SDK for SES (`@aws-sdk/client-ses`).

### Step 5: Test Configuration

Start the development server:

```bash
npm run dev
```

Check the browser console for initialization messages:

```
✅ AWS SES Client initialized successfully
```

If you see this warning, credentials are not configured (emails will be simulated):

```
⚠️  AWS credentials not configured. Email sending will be simulated.
```

## Backend Configuration (Optional)

If you're implementing backend email routes, create a `.env` file in the backend directory.

### Step 1: Create .env File

```bash
cd backend
touch .env
```

### Step 2: Add Configuration

```bash
# AWS SES Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_SES_FROM_EMAIL=noreply@swift-verify.org
AWS_SES_REPLY_TO=support@swift-verify.org

# Application URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8080

# Email Settings
EMAIL_RETRY_ATTEMPTS=3
EMAIL_RETRY_DELAY_MS=2000
```

### Step 3: Load Environment Variables

In your backend code (Node.js example):

```javascript
import dotenv from 'dotenv';
dotenv.config();

const sesConfig = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};
```

## Vercel Deployment

### Step 1: Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_AWS_SES_REGION` | `us-east-1` | Production, Preview, Development |
| `VITE_AWS_ACCESS_KEY_ID` | Your production access key | Production |
| `VITE_AWS_SECRET_ACCESS_KEY` | Your production secret key | Production |
| `VITE_AWS_SES_FROM_EMAIL` | `noreply@swift-verify.org` | Production, Preview |
| `VITE_AWS_SES_REPLY_TO` | `support@swift-verify.org` | Production, Preview |

**Important:**
- Use different AWS credentials for Preview and Production
- Consider using AWS SES Sandbox for Preview deployments
- Enable encryption for sensitive variables

### Step 2: Verify Deployment

After deployment, check the Vercel deployment logs:

```
✅ Build successful
✅ Environment variables loaded
```

### Step 3: Test in Production

1. Trigger an email action in your production app
2. Verify the email is sent
3. Check AWS SES console for sending statistics
4. Monitor CloudWatch logs for errors

## Local Development

### Development vs Production Credentials

Use separate AWS accounts or IAM users for development and production:

**Development:**
- Use AWS SES Sandbox mode
- Verify test email addresses
- Lower sending limits (200/day)
- Test credentials in `.env.local`

**Production:**
- Use AWS SES Production mode
- Domain verification
- Higher sending limits
- Production credentials in Vercel

### Testing Email Sending Locally

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Verify initialization:**
   Check browser console for:
   ```
   ✅ AWS SES Client initialized successfully
   ```

3. **Trigger an email:**
   - Use the application UI to trigger an email
   - Or use the browser console:
     ```javascript
     import { sendDenialEmail } from './services/email';
     await sendDenialEmail({
       email: 'verified-test@example.com',
       reason: 'Test denial',
       applicationId: 'TEST-123',
     });
     ```

4. **Check console output:**
   ```
   📧 AWS SES - Sending Denial Email
   Recipient: verified-test@example.com
   Application ID: TEST-123
   📧 Preparing to send email via AWS SES
   To: verified-test@example.com
   Subject: SwiftVerify Application Decision - Action Required
   ✅ Email sent successfully via AWS SES
   Message ID: 01000181234567890abc...
   ```

5. **Verify email received:**
   - Check recipient inbox
   - Check spam/junk folders
   - Verify email formatting and links

### Simulated Email Mode

If AWS credentials are not configured, emails will be simulated:

```
⚠️  AWS credentials not configured. Email sending will be simulated.
🔄 Simulating email send (no AWS credentials configured)
Email content: { to: 'test@example.com', subject: '...', htmlBody: '...' }
```

This is useful for:
- Frontend development without AWS setup
- UI/UX testing
- Quick prototyping

## Production Deployment Checklist

### Pre-Deployment

- [ ] AWS SES is in Production mode (not Sandbox)
- [ ] Domain is verified in AWS SES
- [ ] DKIM and SPF records are configured
- [ ] Production IAM user created with minimal permissions
- [ ] Bounce and complaint handling configured
- [ ] Sending limits are adequate for your volume
- [ ] All email templates tested and approved
- [ ] Legal disclaimers reviewed by legal team
- [ ] CAN-SPAM compliance verified

### Environment Variables

- [ ] Production credentials set in Vercel
- [ ] Separate credentials for Preview environment
- [ ] All required variables present
- [ ] No test/development credentials in production
- [ ] Credentials encrypted in Vercel
- [ ] `.env.local` is in `.gitignore`
- [ ] No credentials committed to git

### Testing

- [ ] Send test emails to verified addresses
- [ ] Test all email types (denial, approval, waiver, gap pay)
- [ ] Verify email formatting in multiple clients (Gmail, Outlook, Apple Mail)
- [ ] Test on mobile devices
- [ ] Verify all links work correctly
- [ ] Check spam score (use mail-tester.com)
- [ ] Test unsubscribe functionality
- [ ] Verify bounce handling
- [ ] Test retry logic

### Monitoring

- [ ] CloudWatch logs configured
- [ ] SNS notifications for bounces/complaints
- [ ] Dashboard for email statistics
- [ ] Alerts for failed sends
- [ ] Regular review of sending metrics
- [ ] Monitor bounce/complaint rates

### Security

- [ ] Access keys rotated recently
- [ ] IAM permissions follow least privilege
- [ ] MFA enabled on AWS account
- [ ] No credentials in client-side code
- [ ] Environment variables encrypted
- [ ] Regular security audits

### Documentation

- [ ] Team trained on email system
- [ ] Runbook for common issues
- [ ] Contact information for AWS support
- [ ] Escalation procedures documented
- [ ] Template customization guide shared

## Configuration Examples

### Development Configuration

```bash
# frontend/.env.local
VITE_AWS_SES_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=AKIA_DEV_EXAMPLE
VITE_AWS_SECRET_ACCESS_KEY=dev_secret_key_example
VITE_AWS_SES_FROM_EMAIL=dev-noreply@swift-verify.org
VITE_AWS_SES_REPLY_TO=dev-support@swift-verify.org
VITE_APP_URL=http://localhost:3000
```

### Staging Configuration

```bash
# Vercel Environment Variables (Preview)
VITE_AWS_SES_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=AKIA_STAGING_EXAMPLE
VITE_AWS_SECRET_ACCESS_KEY=staging_secret_key_example
VITE_AWS_SES_FROM_EMAIL=staging-noreply@swift-verify.org
VITE_AWS_SES_REPLY_TO=staging-support@swift-verify.org
VITE_APP_URL=https://staging.swift-verify.org
```

### Production Configuration

```bash
# Vercel Environment Variables (Production)
VITE_AWS_SES_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=AKIA_PROD_EXAMPLE
VITE_AWS_SECRET_ACCESS_KEY=prod_secret_key_example
VITE_AWS_SES_FROM_EMAIL=noreply@swift-verify.org
VITE_AWS_SES_REPLY_TO=support@swift-verify.org
VITE_APP_URL=https://www.swift-verify.org
```

## Troubleshooting Configuration

### Problem: Environment Variables Not Loading

**Check:**
1. File is named `.env.local` (not `.env.local.txt`)
2. File is in the `frontend` directory
3. Variables start with `VITE_` prefix
4. Server was restarted after adding variables

**Solution:**
```bash
# Restart the dev server
npm run dev
```

### Problem: AWS Credentials Invalid

**Check:**
1. No extra spaces in credentials
2. Correct Access Key ID and Secret Access Key
3. IAM user has SES permissions
4. Credentials are for the correct AWS account

**Solution:**
```bash
# Test credentials with AWS CLI
aws sts get-caller-identity --profile swiftverify
```

### Problem: Wrong Region

**Symptoms:**
- Email addresses verified but still getting errors
- Emails not sending

**Solution:**
- Ensure `VITE_AWS_SES_REGION` matches where you verified emails
- Re-verify emails in the correct region

## Next Steps

- [Email Templates Guide](./EMAIL_TEMPLATES.md) - Customize email designs
- [Troubleshooting Guide](./AWS_SES_TROUBLESHOOTING.md) - Common issues

## Support

For configuration help:
- Check AWS SES Documentation: https://docs.aws.amazon.com/ses/
- Contact SwiftVerify Support: support@swiftverify.com
