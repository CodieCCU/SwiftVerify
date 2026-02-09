# AWS SES Setup Guide for SwiftVerify

## Overview

This guide provides complete instructions for setting up Amazon Simple Email Service (AWS SES) for SwiftVerify's email infrastructure, including unsubscribe management and compliance logging.

## Prerequisites

- AWS Account with billing enabled
- Domain ownership verification (swift-verify.org)
- AWS CLI installed (optional but recommended)
- Access to DNS management for domain

## Step 1: Create AWS Account & Configure IAM

### 1.1 Create IAM User for SES

```bash
# Create IAM user for SES
aws iam create-user --user-name swiftverify-ses

# Create access key
aws iam create-access-key --user-name swiftverify-ses
```

Save the Access Key ID and Secret Access Key - you'll need these later.

### 1.2 Attach SES Permissions

Create a policy file `ses-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail",
        "ses:GetSendQuota",
        "ses:GetSendStatistics"
      ],
      "Resource": "*"
    }
  ]
}
```

Apply the policy:

```bash
aws iam put-user-policy --user-name swiftverify-ses \
  --policy-name SESAccess --policy-document file://ses-policy.json
```

## Step 2: Verify Domain

### 2.1 Add Domain to SES

```bash
aws ses verify-domain-identity --domain swift-verify.org --region us-west-2
```

This will return a verification token.

### 2.2 Add DNS TXT Record

Add the following TXT record to your DNS:

```
_amazonses.swift-verify.org TXT "verification-token-from-step-2.1"
```

### 2.3 Wait for Verification

Check verification status:

```bash
aws ses get-identity-verification-attributes \
  --identities swift-verify.org --region us-west-2
```

Wait until status shows `Success`.

## Step 3: Configure DKIM

DKIM (DomainKeys Identified Mail) improves email deliverability.

### 3.1 Enable DKIM

```bash
aws ses verify-domain-dkim --domain swift-verify.org --region us-west-2
```

This returns 3 DKIM tokens.

### 3.2 Add DKIM CNAME Records

Add these CNAME records to your DNS:

```
token1._domainkey.swift-verify.org CNAME token1.dkim.amazonses.com
token2._domainkey.swift-verify.org CNAME token2.dkim.amazonses.com
token3._domainkey.swift-verify.org CNAME token3.dkim.amazonses.com
```

## Step 4: Set Up SPF Record

Add SPF record to your DNS:

```
swift-verify.org TXT "v=spf1 include:amazonses.com ~all"
```

## Step 5: Configure DMARC

Add DMARC record to your DNS:

```
_dmarc.swift-verify.org TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@swift-verify.org"
```

## Step 6: Request Production Access

By default, SES is in sandbox mode (can only send to verified emails).

### 6.1 Request Production Access

1. Go to AWS SES Console
2. Click "Account Dashboard"
3. Click "Request production access"
4. Fill out the form:
   - **Mail Type:** Transactional
   - **Website URL:** https://swift-verify.org
   - **Use Case Description:**
     ```
     SwiftVerify is a rental verification platform that sends transactional 
     emails to tenants and landlords. Email types include:
     - Application status updates (approval/denial)
     - Waiver notifications
     - Gap payment coverage notifications
     - Landlord alerts
     
     All emails include prominent unsubscribe buttons and comply with 
     CAN-SPAM Act requirements. We maintain an immediate unsubscribe 
     mechanism and comprehensive audit logging.
     ```
   - **Compliance:** Explain your unsubscribe and compliance measures
   - **Expected Volume:** Start with 1,000 emails/day

5. Submit request
6. Wait 24-48 hours for approval

## Step 7: Configure Sending Limits

### 7.1 Check Current Limits

```bash
aws ses get-send-quota --region us-west-2
```

### 7.2 Request Limit Increase

If you need higher limits:
1. Go to AWS Support Center
2. Create a new case
3. Select "Service Limit Increase"
4. Service: SES Sending Limits
5. Region: US West (Oregon)
6. Limit: Desired sending rate
7. New limit value: Your desired value

## Step 8: Create Configuration Set

Configuration sets track email metrics.

### 8.1 Create Configuration Set

```bash
aws sesv2 create-configuration-set \
  --configuration-set-name swiftverify-emails \
  --region us-west-2
```

### 8.2 Add Event Destination (Optional)

For detailed metrics, add CloudWatch or Kinesis:

```bash
aws sesv2 create-configuration-set-event-destination \
  --configuration-set-name swiftverify-emails \
  --event-destination-name cloudwatch-events \
  --event-destination '{
    "Enabled": true,
    "MatchingEventTypes": ["SEND", "DELIVERY", "BOUNCE", "COMPLAINT"],
    "CloudWatchDestination": {
      "DimensionConfigurations": [{
        "DimensionName": "emailType",
        "DimensionValueSource": "MESSAGE_TAG",
        "DefaultDimensionValue": "unknown"
      }]
    }
  }' \
  --region us-west-2
```

## Step 9: Configure Suppression List

### 9.1 Enable Account-Level Suppression

```bash
aws sesv2 put-account-suppression-attributes \
  --suppressed-reasons BOUNCE COMPLAINT \
  --region us-west-2
```

This automatically suppresses bounced and complaint addresses.

## Step 10: Set Up Email Templates (Optional)

### 10.1 Create Template

```bash
aws ses create-template --cli-input-json file://template.json --region us-west-2
```

Example `template.json`:

```json
{
  "Template": {
    "TemplateName": "denial-email",
    "SubjectPart": "SwiftVerify Application Update",
    "HtmlPart": "<!-- Your HTML template -->",
    "TextPart": "<!-- Your text template -->"
  }
}
```

## Step 11: Configure Go Application

### 11.1 Install AWS SDK

```bash
go get github.com/aws/aws-sdk-go-v2/service/sesv2
go get github.com/aws/aws-sdk-go-v2/config
```

### 11.2 Update Environment Variables

Add to `.env`:

```bash
AWS_SES_REGION=us-west-2
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_SES_FROM_EMAIL=noreply@swift-verify.org
AWS_SES_FROM_NAME=SwiftVerify
AWS_SES_CONFIG_SET=swiftverify-emails
```

### 11.3 Example Go Code

```go
package main

import (
    "context"
    "github.com/aws/aws-sdk-go-v2/config"
    "github.com/aws/aws-sdk-go-v2/service/sesv2"
    "github.com/aws/aws-sdk-go-v2/service/sesv2/types"
)

func sendEmail() error {
    cfg, err := config.LoadDefaultConfig(context.TODO(),
        config.WithRegion("us-west-2"),
    )
    if err != nil {
        return err
    }

    client := sesv2.NewFromConfig(cfg)

    input := &sesv2.SendEmailInput{
        FromEmailAddress: aws.String("SwiftVerify <noreply@swift-verify.org>"),
        Destination: &types.Destination{
            ToAddresses: []string{"recipient@example.com"},
        },
        Content: &types.EmailContent{
            Simple: &types.Message{
                Subject: &types.Content{
                    Data: aws.String("Test Email"),
                },
                Body: &types.Body{
                    Html: &types.Content{
                        Data: aws.String("<h1>Test</h1>"),
                    },
                },
            },
        },
        ConfigurationSetName: aws.String("swiftverify-emails"),
    }

    result, err := client.SendEmail(context.TODO(), input)
    if err != nil {
        return err
    }

    fmt.Printf("Email sent! Message ID: %s\n", *result.MessageId)
    return nil
}
```

## Step 12: Testing

### 12.1 Test Email Sending

Send a test email:

```bash
aws ses send-email \
  --from noreply@swift-verify.org \
  --destination "ToAddresses=test@example.com" \
  --message "Subject={Data=Test},Body={Text={Data=Test email}}" \
  --region us-west-2
```

### 12.2 Test Unsubscribe Flow

1. Send email with unsubscribe link
2. Click unsubscribe link
3. Verify immediate processing
4. Attempt to send another email
5. Verify email is skipped

### 12.3 Monitor Bounces and Complaints

```bash
aws ses get-send-statistics --region us-west-2
```

## Step 13: Monitoring & Alerts

### 13.1 CloudWatch Alarms

Create alarms for:
- High bounce rate (> 5%)
- High complaint rate (> 0.1%)
- Sending quota exceeded
- Reputation issues

### 13.2 SNS Notifications

Set up SNS to receive SES notifications:

```bash
aws sns create-topic --name ses-notifications --region us-west-2
aws ses set-identity-notification-topic \
  --identity swift-verify.org \
  --notification-type Bounce \
  --sns-topic arn:aws:sns:us-west-2:123456789012:ses-notifications \
  --region us-west-2
```

## Step 14: Best Practices

### Email Content
- ✅ Use plain text AND HTML versions
- ✅ Include unsubscribe link (required)
- ✅ Keep emails under 10 MB
- ✅ Avoid spam trigger words
- ✅ Use descriptive subject lines

### Technical
- ✅ Implement exponential backoff for retries
- ✅ Handle bounces and complaints
- ✅ Monitor sending reputation
- ✅ Use DKIM and SPF
- ✅ Warm up new IP addresses gradually

### Compliance
- ✅ Process unsubscribes immediately
- ✅ Maintain suppression list
- ✅ Include physical address
- ✅ Honor opt-out requests
- ✅ Log all email activity

## Step 15: Cost Estimation

### SES Pricing (as of 2024)
- First 62,000 emails per month: **FREE** (from EC2)
- Additional emails: **$0.10 per 1,000 emails**
- Received emails: **$0.10 per 1,000 emails**
- Data transfer: **$0.12 per GB**

### Example Monthly Cost
- 10,000 emails/month: **$0** (within free tier)
- 100,000 emails/month: **~$3.80**
- 1,000,000 emails/month: **~$94**

## Troubleshooting

### Issue: Emails not being delivered

**Solutions:**
1. Check if domain is verified
2. Verify DKIM records are correct
3. Check SPF record
4. Review bounce/complaint rates
5. Ensure not in sandbox mode

### Issue: High bounce rate

**Solutions:**
1. Validate email addresses before sending
2. Use double opt-in for signups
3. Clean email list regularly
4. Monitor bounce notifications

### Issue: Emails going to spam

**Solutions:**
1. Implement DKIM and SPF
2. Set up DMARC
3. Avoid spam trigger words
4. Include plain text version
5. Warm up IP gradually
6. Monitor sender reputation

## Security Considerations

- ✅ Rotate IAM credentials regularly
- ✅ Use least privilege IAM policies
- ✅ Enable MFA on AWS account
- ✅ Store credentials in environment variables, not code
- ✅ Use TLS for all connections
- ✅ Monitor for unauthorized access
- ✅ Implement rate limiting

## Resources

- [AWS SES Developer Guide](https://docs.aws.amazon.com/ses/)
- [AWS SES API Reference](https://docs.aws.amazon.com/ses/latest/APIReference/)
- [AWS SDK for Go](https://aws.github.io/aws-sdk-go-v2/)
- [SES Best Practices](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/best-practices.html)

## Support

For assistance:
- **AWS Support:** [AWS Support Center](https://console.aws.amazon.com/support/)
- **SwiftVerify DevOps:** devops@swift-verify.org
- **SwiftVerify Technical:** tech@swift-verify.org

Last Updated: 2026-02-09
Version: 1.0
