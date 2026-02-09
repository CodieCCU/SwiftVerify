# AWS SES Setup Guide

This guide will walk you through setting up Amazon Simple Email Service (SES) for the SwiftVerify application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [AWS Account Setup](#aws-account-setup)
3. [Email Verification](#email-verification)
4. [IAM User Creation](#iam-user-creation)
5. [SES Sandbox vs Production](#ses-sandbox-vs-production)
6. [Testing in Sandbox](#testing-in-sandbox)
7. [Moving to Production](#moving-to-production)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, you'll need:

- An AWS account (create one at [aws.amazon.com](https://aws.amazon.com))
- Access to the email addresses you want to verify
- Domain ownership (optional, but recommended for production)

## AWS Account Setup

### Step 1: Sign in to AWS Console

1. Go to [AWS Console](https://console.aws.amazon.com)
2. Sign in with your AWS account credentials
3. Navigate to the SES console by searching for "SES" in the services search bar

### Step 2: Select Your Region

**Important:** Choose the region closest to your users for better performance.

- Recommended: `us-east-1` (N. Virginia)
- Alternative: `us-west-2` (Oregon)

**Note:** Once you verify emails in a region, they only work in that region. If you change regions, you'll need to verify again.

## Email Verification

### Verify Sender Email Address

In SES Sandbox mode, you must verify both sender and recipient email addresses.

1. In the SES console, go to **Configuration** → **Verified identities**
2. Click **Create identity**
3. Select **Email address**
4. Enter your sender email (e.g., `noreply@swift-verify.org`)
5. Click **Create identity**
6. Check the inbox of the email you just entered
7. Click the verification link in the email from AWS
8. Return to the SES console to confirm the status is "Verified"

### Verify Reply-To Email Address

Repeat the above process for your reply-to address (e.g., `support@swift-verify.org`).

### Verify Test Recipient Emails (Sandbox Only)

While in Sandbox mode, you must also verify any recipient email addresses:

1. Follow the same process as above for each test recipient
2. This is only needed for testing in Sandbox mode
3. Production mode allows sending to any verified recipient

## IAM User Creation

For security, create a dedicated IAM user for SES operations instead of using your root credentials.

### Step 1: Create IAM User

1. Go to **IAM** service in AWS Console
2. Click **Users** → **Add users**
3. Enter username: `swiftverify-ses-user`
4. Select **Access key - Programmatic access**
5. Click **Next: Permissions**

### Step 2: Attach Permissions

1. Click **Attach existing policies directly**
2. Search for and select `AmazonSESFullAccess`
3. Click **Next: Tags** (optional, skip if you don't need tags)
4. Click **Next: Review**
5. Click **Create user**

### Step 3: Save Credentials

**⚠️ CRITICAL: Save these credentials immediately. You cannot retrieve the secret key later.**

1. Copy the **Access key ID**
2. Copy the **Secret access key**
3. Store them in a secure password manager
4. **Never commit these to git or share them publicly**

Example credentials (DO NOT use these):
```
Access Key ID: AKIAIOSFODNN7EXAMPLE
Secret Access Key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

## SES Sandbox vs Production

### Sandbox Mode (Default)

When you first create an AWS account, SES is in **Sandbox mode** with these limitations:

- ✅ Can send emails to verified addresses only
- ✅ Maximum 200 emails per 24-hour period
- ✅ Maximum 1 email per second
- ❌ Cannot send to unverified recipients
- ❌ Not suitable for production use

### Production Mode

To send emails to any recipient, you must request production access:

- ✅ Can send to any email address
- ✅ Higher sending limits (starts at 50,000/day)
- ✅ Suitable for production use

## Testing in Sandbox

### Step 1: Verify Test Emails

Verify at least one test recipient email address using the process described in [Email Verification](#email-verification).

### Step 2: Configure Environment Variables

Create a `.env.local` file in the `frontend` directory:

```bash
VITE_AWS_SES_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=your_access_key_id_here
VITE_AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
VITE_AWS_SES_FROM_EMAIL=noreply@swift-verify.org
VITE_AWS_SES_REPLY_TO=support@swift-verify.org
```

**Important:** Ensure `.env.local` is in your `.gitignore` file.

### Step 3: Run the Application

```bash
cd frontend
npm install
npm run dev
```

### Step 4: Test Email Sending

1. Trigger an email action in the application (e.g., deny an application)
2. Check the browser console for logs
3. Verify the email was received in the recipient's inbox
4. Check for any errors in the console

### Expected Console Output

```
📧 Preparing to send email via AWS SES
To: test@example.com
Subject: SwiftVerify Application Decision - Action Required
From: noreply@swift-verify.org
Reply-To: support@swift-verify.org
✅ Email sent successfully via AWS SES
Message ID: 01000181234567890abc...
```

## Moving to Production

### Step 1: Request Production Access

1. In the SES console, go to **Account dashboard**
2. Under **Sending statistics**, click **Request production access**
3. Fill out the request form:
   - **Mail type**: Transactional
   - **Website URL**: https://www.swift-verify.org
   - **Use case description**: 
     ```
     SwiftVerify is a rental application verification platform that sends 
     transactional emails to tenants and landlords. We send:
     - Application approval/denial notifications
     - Lease signing invitations
     - Account creation emails
     - Application status updates
     
     All recipients have opted in to receive these emails as part of their 
     rental application process. We comply with CAN-SPAM regulations and 
     include unsubscribe links in all emails.
     ```
   - **Additional contacts**: Add compliance email
   - **Acknowledge** that you have processes to handle bounces and complaints
4. Click **Submit request**

### Step 2: Wait for Approval

- AWS typically reviews requests within 24-48 hours
- You'll receive an email notification when approved or if they need more information
- If denied, they'll provide reasons and you can resubmit with more details

### Step 3: Domain Verification (Recommended)

Instead of individual email addresses, verify your entire domain:

1. Go to **Configuration** → **Verified identities**
2. Click **Create identity**
3. Select **Domain**
4. Enter your domain: `swift-verify.org`
5. Enable **DKIM signing**
6. Click **Create identity**
7. Add the DNS records shown to your domain's DNS settings
8. Wait for verification (can take up to 72 hours)

### Step 4: Set Up DKIM and SPF

**DKIM (DomainKeys Identified Mail):**
- Automatically configured when you verify a domain
- Adds cryptographic signature to emails
- Improves deliverability

**SPF (Sender Policy Framework):**

Add this TXT record to your domain's DNS:

```
v=spf1 include:amazonses.com ~all
```

### Step 5: Configure Bounce and Complaint Handling

1. In SES console, go to **Configuration sets**
2. Create a new configuration set
3. Add SNS topics for:
   - Bounces
   - Complaints
   - Deliveries (optional)
4. Update your code to use the configuration set

### Step 6: Increase Sending Limits (If Needed)

If you need to send more than the default limits:

1. Go to **Account dashboard**
2. Click **Request sending limit increase**
3. Provide business justification
4. Specify desired limits

## Troubleshooting

### Problem: Email Not Received

**Check:**
- ✅ Is the sender email verified in SES?
- ✅ Is the recipient email verified (Sandbox mode)?
- ✅ Check spam/junk folders
- ✅ Look for bounce notifications in SES console

**Solution:**
- Verify all email addresses
- Check SES sending statistics for errors
- Review CloudWatch logs

### Problem: "Email address is not verified"

**Error Message:**
```
MessageRejected: Email address is not verified. The following identities 
failed the check in region US-EAST-1: noreply@swift-verify.org
```

**Solution:**
1. Go to SES console → Verified identities
2. Verify the email address or domain
3. Check your email for verification link
4. Wait until status shows "Verified"

### Problem: "Daily sending quota exceeded"

**Solution:**
- You're in Sandbox mode with 200 emails/day limit
- Request production access
- Or use verified test emails for development

### Problem: Invalid AWS Credentials

**Error Message:**
```
The security token included in the request is invalid
```

**Solution:**
- Check that Access Key ID and Secret Access Key are correct
- Ensure there are no extra spaces in environment variables
- Verify the IAM user has SES permissions
- Try creating new access keys

### Problem: Emails Going to Spam

**Solutions:**
1. Set up DKIM and SPF records
2. Verify your domain (not just email)
3. Use a consistent "From" address
4. Include unsubscribe links
5. Monitor bounce and complaint rates
6. Maintain good sender reputation

### Problem: Rate Limiting

**Error Message:**
```
Throttling: Maximum sending rate exceeded
```

**Solution:**
- Sandbox: Limited to 1 email/second
- Implement retry logic with exponential backoff
- Request production access for higher limits
- Use SES configuration sets with sending pools

## Next Steps

- [Configuration Guide](./AWS_SES_CONFIG.md) - Set up environment variables
- [Email Templates Guide](./EMAIL_TEMPLATES.md) - Customize email designs
- [Troubleshooting Guide](./AWS_SES_TROUBLESHOOTING.md) - Common issues and solutions

## Security Best Practices

1. **Never commit AWS credentials to git**
2. **Use IAM users with minimal permissions**
3. **Rotate access keys regularly**
4. **Enable MFA on your AWS account**
5. **Monitor SES usage for unusual activity**
6. **Use environment variables for all credentials**
7. **Implement proper error handling**
8. **Log email sending for audit trail**

## Support

- AWS SES Documentation: https://docs.aws.amazon.com/ses/
- AWS Support: https://console.aws.amazon.com/support/
- SwiftVerify Support: support@swiftverify.com
