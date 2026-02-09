# AWS SES Troubleshooting Guide

This guide covers common issues with AWS SES email integration and their solutions.

## Table of Contents

1. [Email Not Received](#email-not-received)
2. [Authentication Errors](#authentication-errors)
3. [Rate Limiting Issues](#rate-limiting-issues)
4. [Bounce Handling](#bounce-handling)
5. [Complaint Handling](#complaint-handling)
6. [Spam Issues](#spam-issues)
7. [Configuration Problems](#configuration-problems)
8. [Development Issues](#development-issues)

## Email Not Received

### Problem: Emails Not Arriving

**Symptoms:**
- Function returns success
- No error messages
- Email never arrives in inbox

**Possible Causes:**

1. **Email in Spam/Junk Folder**
   - Check spam folder
   - Check quarantine (corporate email)
   
   **Solution:**
   - Add sender to safe senders list
   - Configure SPF and DKIM records
   - Improve email content (avoid spam trigger words)

2. **Email Bounced**
   
   **Check:**
   ```javascript
   // Check AWS SES console
   // Navigation: SES > Reputation > Bounces
   ```
   
   **Solution:**
   - Verify recipient email address is correct
   - Check for typos in email address
   - Verify recipient server is accepting emails

3. **Still in SES Sandbox Mode**
   
   **Check:**
   ```javascript
   // AWS Console > SES > Account dashboard
   // Look for: "Your account is currently in the sandbox"
   ```
   
   **Solution:**
   - Verify recipient email in SES console
   - Or request production access

4. **Wrong Region**
   
   **Check:**
   ```javascript
   console.log('Region:', import.meta.env.VITE_AWS_SES_REGION);
   // Emails must be verified in this region
   ```
   
   **Solution:**
   - Verify emails in the same region as `VITE_AWS_SES_REGION`
   - Or update region to match verified emails

### Problem: Email Delayed

**Symptoms:**
- Emails arrive 10-30 minutes late
- Intermittent delays

**Possible Causes:**

1. **Recipient Server Issues**
   - Check recipient email server status
   - Greylisting by recipient server
   
2. **SES Queue Backlog**
   - High sending volume
   - Rate limiting
   
   **Solution:**
   - Implement exponential backoff
   - Monitor CloudWatch metrics
   - Request higher sending limits

## Authentication Errors

### Error: "The security token included in the request is invalid"

**Full Error:**
```
UnrecognizedClientException: The security token included in the request is invalid.
```

**Causes:**
1. Incorrect Access Key ID or Secret Access Key
2. Spaces in environment variables
3. Wrong AWS account
4. IAM user deleted or credentials rotated

**Solutions:**

```bash
# 1. Check environment variables
echo $VITE_AWS_ACCESS_KEY_ID
echo $VITE_AWS_SECRET_ACCESS_KEY

# 2. Verify no extra spaces
# Open .env.local and check:
VITE_AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE  # ❌ No space before
# VITE_AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE # ✅ Correct

# 3. Test credentials with AWS CLI
aws sts get-caller-identity --profile swiftverify

# 4. Create new access keys
# AWS Console > IAM > Users > swiftverify-ses-user > Security credentials > Create access key
```

### Error: "User is not authorized to perform: ses:SendEmail"

**Full Error:**
```
AccessDeniedException: User: arn:aws:iam::123456789:user/swiftverify-ses-user 
is not authorized to perform: ses:SendEmail
```

**Cause:**
IAM user lacks SES permissions

**Solution:**

1. **Attach SES Policy:**
   ```bash
   # AWS Console > IAM > Users > swiftverify-ses-user > Permissions
   # Attach policy: AmazonSESFullAccess
   ```

2. **Or Create Custom Policy:**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "ses:SendEmail",
           "ses:SendRawEmail"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

### Error: "Email address is not verified"

**Full Error:**
```
MessageRejected: Email address is not verified. The following identities 
failed the check in region US-EAST-1: noreply@swift-verify.org
```

**Cause:**
Sender email not verified in SES

**Solution:**

```bash
# 1. Go to SES Console
# AWS Console > Amazon SES > Configuration > Verified identities

# 2. Click "Create identity"

# 3. Choose "Email address"

# 4. Enter: noreply@swift-verify.org

# 5. Click "Create identity"

# 6. Check email inbox for verification link

# 7. Click link to verify

# 8. Confirm status is "Verified" in console
```

## Rate Limiting Issues

### Error: "Maximum sending rate exceeded"

**Full Error:**
```
Throttling: Maximum sending rate exceeded.
```

**Causes:**
- Sandbox mode: 1 email/second limit
- Production: Exceeded your sending rate
- Burst sending too many emails

**Solutions:**

1. **Implement Rate Limiting:**
   ```javascript
   // Add delay between emails
   const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
   
   for (const email of emails) {
     await sendEmail(email);
     await delay(1000); // 1 second delay
   }
   ```

2. **Use Batch Sending:**
   ```javascript
   // Send in batches with delays
   const batchSize = 10;
   for (let i = 0; i < emails.length; i += batchSize) {
     const batch = emails.slice(i, i + batchSize);
     await Promise.all(batch.map(e => sendEmail(e)));
     await delay(10000); // 10 second delay between batches
   }
   ```

3. **Request Higher Limits:**
   ```bash
   # AWS Console > SES > Account dashboard > Request sending limit increase
   # Justify: "Need to send X emails/second for application notifications"
   ```

### Error: "Daily sending quota exceeded"

**Full Error:**
```
Throttling: Daily message quota exceeded.
```

**Current Limits:**
- Sandbox: 200 emails/day
- Production: 50,000+ emails/day (varies)

**Solutions:**

1. **Check Current Quota:**
   ```bash
   # AWS Console > SES > Account dashboard > Sending statistics
   ```

2. **Request Production Access:**
   - See [AWS SES Setup Guide](./AWS_SES_SETUP.md#moving-to-production)

3. **Implement Queuing:**
   ```javascript
   // Queue emails for next day if quota exceeded
   if (error.code === 'Throttling') {
     await queueForLater(emailParams);
   }
   ```

## Bounce Handling

### Understanding Bounces

**Hard Bounce:**
- Permanent delivery failure
- Invalid email address
- Domain doesn't exist
- **Action:** Remove from mailing list

**Soft Bounce:**
- Temporary delivery failure
- Mailbox full
- Server temporarily unavailable
- **Action:** Retry later

### Monitoring Bounces

**AWS Console:**
```bash
# SES > Reputation > Bounces
# Look for bounce rate (keep under 5%)
```

**CloudWatch Metrics:**
```bash
# CloudWatch > Metrics > SES
# Monitor: Bounces, Rejects, Delivery
```

### Implementing Bounce Handling

```javascript
// 1. Set up SNS Topic for bounces
// AWS Console > SES > Configuration sets > Create configuration set

// 2. Add bounce handling in code
export const handleBounce = async (bounceNotification) => {
  const { bounceType, bouncedRecipients } = bounceNotification;
  
  if (bounceType === 'Permanent') {
    // Remove from database
    for (const recipient of bouncedRecipients) {
      await removeEmailFromList(recipient.emailAddress);
      console.log('Removed bounced email:', recipient.emailAddress);
    }
  } else if (bounceType === 'Transient') {
    // Retry later
    for (const recipient of bouncedRecipients) {
      await queueForRetry(recipient.emailAddress);
    }
  }
};
```

## Complaint Handling

### Understanding Complaints

**Complaint:**
- Recipient marked email as spam
- Serious issue - affects sender reputation
- **Target:** Keep complaint rate under 0.1%

### Monitoring Complaints

```bash
# AWS Console > SES > Reputation > Complaints
# Check complaint rate regularly
```

### Implementing Complaint Handling

```javascript
export const handleComplaint = async (complaintNotification) => {
  const { complainedRecipients } = complaintNotification;
  
  for (const recipient of complainedRecipients) {
    // Immediately unsubscribe
    await unsubscribeEmail(recipient.emailAddress);
    
    // Log for review
    console.error('Complaint received from:', recipient.emailAddress);
    
    // Notify admin
    await notifyAdmin({
      type: 'COMPLAINT',
      email: recipient.emailAddress,
      timestamp: new Date(),
    });
  }
};
```

### Reducing Complaints

1. **Include Unsubscribe Link:**
   ```javascript
   <a href="${EXTERNAL_LINKS.COMPANY_WEBSITE}/unsubscribe?email=${email}">
     Unsubscribe
   </a>
   ```

2. **Clear Sender Identification:**
   ```javascript
   From: SwiftVerify <noreply@swift-verify.org>
   ```

3. **Relevant Content:**
   - Only send transactional emails
   - Don't send marketing without consent
   - Ensure emails are expected

## Spam Issues

### Problem: Emails Going to Spam

**Causes:**
1. Missing SPF/DKIM records
2. Low sender reputation
3. Spam trigger words in content
4. High bounce/complaint rate
5. Unverified domain

**Solutions:**

1. **Set Up SPF Record:**
   ```dns
   ; Add to DNS
   swift-verify.org. IN TXT "v=spf1 include:amazonses.com ~all"
   ```

2. **Enable DKIM:**
   ```bash
   # AWS Console > SES > Verified identities > swift-verify.org
   # Enable DKIM
   # Add provided DNS records to your domain
   ```

3. **Verify Domain:**
   ```bash
   # AWS Console > SES > Verified identities > Create identity
   # Choose "Domain" instead of "Email address"
   # Follow DNS verification steps
   ```

4. **Test Spam Score:**
   ```bash
   # Visit: https://www.mail-tester.com/
   # Send test email to provided address
   # Review score and recommendations
   # Aim for 8+/10
   ```

5. **Avoid Spam Trigger Words:**
   - ❌ FREE, URGENT, LIMITED TIME, ACT NOW
   - ❌ All caps subject lines
   - ❌ Excessive exclamation marks!!!
   - ✅ Clear, professional language

6. **Monitor Sender Reputation:**
   ```bash
   # AWS Console > SES > Reputation
   # Keep bounce rate < 5%
   # Keep complaint rate < 0.1%
   ```

## Configuration Problems

### Problem: Environment Variables Not Loading

**Symptoms:**
```
⚠️  AWS credentials not configured. Email sending will be simulated.
```

**Solutions:**

1. **Check File Name:**
   ```bash
   # File must be named exactly:
   .env.local  # ✅ Correct
   # NOT:
   env.local   # ❌ Missing dot
   .env.local.txt  # ❌ Extra extension
   ```

2. **Check File Location:**
   ```bash
   # File must be in frontend directory
   /home/runner/work/SwiftVerify/SwiftVerify/frontend/.env.local  # ✅ Correct
   ```

3. **Check Variable Prefix:**
   ```bash
   # Vite requires VITE_ prefix
   VITE_AWS_ACCESS_KEY_ID=xxx  # ✅ Correct
   AWS_ACCESS_KEY_ID=xxx       # ❌ Missing VITE_ prefix
   ```

4. **Restart Dev Server:**
   ```bash
   # Environment variables only load on startup
   npm run dev
   ```

5. **Check for Spaces:**
   ```bash
   # No spaces around =
   VITE_AWS_ACCESS_KEY_ID=xxx  # ✅ Correct
   VITE_AWS_ACCESS_KEY_ID = xxx  # ❌ Spaces
   ```

### Problem: Wrong Region Error

**Symptoms:**
- Emails verified but still getting errors
- "Email address is not verified" despite verification

**Solution:**

```bash
# 1. Check current region in code
console.log('Region:', import.meta.env.VITE_AWS_SES_REGION);

# 2. Check region where emails are verified
# AWS Console > SES (check region dropdown in top-right)

# 3. Either:
# a) Re-verify emails in code's region
# b) Update VITE_AWS_SES_REGION to match verified region

# 4. Ensure consistency
VITE_AWS_SES_REGION=us-east-1  # Must match SES console region
```

## Development Issues

### Problem: Cannot Test Without AWS Credentials

**Solution:**

The code automatically simulates email sending when credentials are missing:

```javascript
// No credentials needed for local development
// Just don't set VITE_AWS_ACCESS_KEY_ID and VITE_AWS_SECRET_ACCESS_KEY

// Output:
⚠️  AWS credentials not configured. Email sending will be simulated.
🔄 Simulating email send (no AWS credentials configured)
Email content: { to: 'test@example.com', subject: '...', htmlBody: '...' }
```

This allows:
- Frontend development without AWS setup
- UI/UX testing
- Quick prototyping

### Problem: Testing Email Templates

**Solution:**

1. **Browser Console:**
   ```javascript
   // Import template
   const { denialEmailTemplate } = await import('/src/utils/emailTemplates.js');
   
   // Generate HTML
   const html = denialEmailTemplate({
     reason: 'Test reason',
     applicationId: 'TEST-123',
     appealDeadline: 'March 15, 2024'
   });
   
   // View in console
   console.log(html);
   ```

2. **Save to File:**
   ```javascript
   // Create test page
   const html = denialEmailTemplate({ /* params */ });
   const blob = new Blob([html], { type: 'text/html' });
   const url = URL.createObjectURL(blob);
   window.open(url);
   ```

3. **Use Online Tools:**
   - [Litmus](https://litmus.com)
   - [Email on Acid](https://www.emailonacid.com)
   - [Mailtrap](https://mailtrap.io)

## Error Codes Reference

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `MessageRejected` | Email rejected by SES | Check email address verification |
| `MailFromDomainNotVerified` | Domain not verified | Verify domain in SES console |
| `ConfigurationSetDoesNotExist` | Invalid config set | Check configuration set name |
| `InvalidParameterValue` | Invalid parameter | Check email parameters |
| `AccountSendingPausedException` | Account suspended | Contact AWS Support |
| `Throttling` | Rate limit exceeded | Implement rate limiting |
| `ServiceUnavailable` | AWS service issue | Retry with backoff |

## Getting Help

### Before Contacting Support

1. **Check AWS Service Health:**
   - https://status.aws.amazon.com/

2. **Review CloudWatch Logs:**
   ```bash
   # AWS Console > CloudWatch > Logs
   # Look for SES-related errors
   ```

3. **Check SES Reputation:**
   ```bash
   # AWS Console > SES > Reputation
   # Look for warnings or suspension notices
   ```

4. **Test with AWS CLI:**
   ```bash
   aws ses send-email \
     --from noreply@swift-verify.org \
     --destination ToAddresses=test@example.com \
     --message Subject={Data="Test"},Body={Text={Data="Test"}}
   ```

### Contact Information

- **AWS Support:** https://console.aws.amazon.com/support/
- **AWS SES Documentation:** https://docs.aws.amazon.com/ses/
- **SwiftVerify Support:** support@swiftverify.com
- **Emergency Issues:** Call AWS Support (Premium Support required)

## Additional Resources

- [AWS SES Setup Guide](./AWS_SES_SETUP.md)
- [Configuration Guide](./AWS_SES_CONFIG.md)
- [Email Templates Guide](./EMAIL_TEMPLATES.md)
- [AWS SES Best Practices](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/best-practices.html)
- [AWS SES FAQs](https://aws.amazon.com/ses/faqs/)
