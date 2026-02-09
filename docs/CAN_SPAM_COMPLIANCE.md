# CAN-SPAM Act Compliance

## Overview

SwiftVerify is fully compliant with the **CAN-SPAM Act of 2003** (Controlling the Assault of Non-Solicited Pornography And Marketing Act), which establishes requirements for commercial email messages.

## Legal Requirements & Our Implementation

### 1. Don't Use False or Misleading Header Information

**Requirement:** Your "From," "To," "Reply-To," and routing information must be accurate and identify the person or business who initiated the message.

**Our Implementation:**
- ✅ From: `SwiftVerify <noreply@swift-verify.org>`
- ✅ All routing headers accurate
- ✅ Reply-To properly configured
- ✅ No spoofing or deceptive headers

### 2. Don't Use Deceptive Subject Lines

**Requirement:** The subject line must accurately reflect the content of the message.

**Our Implementation:**
- ✅ "SwiftVerify Application Update - Decision Required" (for denials)
- ✅ "Congratulations! Your SwiftVerify Application is Approved" (for approvals)
- ✅ "SwiftVerify Application Approved - Waiver Form Required" (for waivers)
- ✅ "SwiftVerify Application Approved - Gap Pay Coverage" (for gap pay)
- ✅ Clear, accurate subject lines for all email types

### 3. Identify the Message as an Advertisement

**Requirement:** The law gives you a lot of leeway in how to do this, but you must disclose clearly and conspicuously that your message is an advertisement.

**Our Implementation:**
- ✅ Footer states: "This email is sent as part of our rental verification service."
- ✅ Clear identification of sender (SwiftVerify, LLC)
- ✅ Business purpose clearly stated
- ✅ Not spam - transactional emails related to service

**Note:** Most SwiftVerify emails are **transactional** (related to a user's application), not marketing, so this requirement is less critical, but we include clear identification anyway.

### 4. Tell Recipients Where You're Located

**Requirement:** Your message must include your valid physical postal address.

**Our Implementation:**
Every email includes:
```
SwiftVerify, LLC
Boise, Idaho
www.swift-verify.org
support@swift-verify.org
```

✅ Physical location included in footer
✅ Consistently displayed in all emails

### 5. Tell Recipients How to Opt Out

**Requirement:** Your message must include a clear and conspicuous explanation of how the recipient can opt out of getting email from you in the future.

**Our Implementation:**
- ✅ **Large, prominent "UNSUBSCRIBE IMMEDIATELY" button**
- ✅ Button at **TOP** of email (before content)
- ✅ Button at **BOTTOM** of email (in footer)
- ✅ Red color (#dc3545) for visibility
- ✅ Mobile-responsive design
- ✅ Clear text: "UNSUBSCRIBE IMMEDIATELY"
- ✅ Disclosure text in every email:
  ```
  Unsubscribe from SwiftVerify emails: Your unsubscribe request is processed IMMEDIATELY. 
  This action is permanently logged and audited at SwiftVerify, LLC.
  ```

### 6. Honor Opt-Out Requests Promptly

**Requirement:** Any opt-out mechanism you offer must be able to process opt-out requests for at least 30 days after you send your message. You must honor a recipient's opt-out request within 10 business days.

**Our Implementation:**
- ✅ Unsubscribe tokens valid for **90 days** (exceeds 30-day requirement)
- ✅ Unsubscribe processed **IMMEDIATELY** (< 1 second, not 10 days)
- ✅ No confirmation email required
- ✅ Automated, instant processing
- ✅ Audit log entry created immediately

**We exceed the requirement by processing in < 1 second instead of up to 10 business days.**

### 7. Monitor What Others Are Doing on Your Behalf

**Requirement:** Even if you hire another company to handle your email marketing, you can't contract away your legal responsibility to comply with the law. Both the company whose product is promoted in the message and the company that actually sends the message may be held legally responsible.

**Our Implementation:**
- ✅ All emails sent directly by SwiftVerify systems
- ✅ No third-party email marketing services
- ✅ AWS SES used for infrastructure only (not marketing)
- ✅ Full control over email content and sending
- ✅ Audit trail of all email sends

## Email Types & Compliance

### Transactional vs. Marketing

| Email Type | Classification | CAN-SPAM Applies? |
|------------|---------------|-------------------|
| Denial Email | Transactional | Yes (less strict) |
| Approval Email | Transactional | Yes (less strict) |
| Waiver Email | Transactional | Yes (less strict) |
| Gap Pay Email | Transactional | Yes (less strict) |
| Landlord Alerts | Transactional/Service | Yes (less strict) |

**Transactional emails** have more lenient requirements under CAN-SPAM because they:
- Facilitate an already agreed-upon transaction
- Provide warranty, recall, or safety information
- Give updates about an ongoing transaction

**We still apply full CAN-SPAM compliance to all emails** even though transactional emails have fewer requirements.

## Penalties for Non-Compliance

Understanding the risks helps ensure compliance:

- **$50,120** per violation (as of 2024, adjusted annually)
- **Deceptive emails**: Additional penalties up to $50,120 per email
- **Criminal charges**: Possible for egregious violations
  - Harvesting email addresses
  - Using automated tools to generate addresses
  - Relaying through compromised computers

**SwiftVerify avoids all penalties by:**
- ✅ Strict compliance with all requirements
- ✅ Immediate opt-out processing
- ✅ No deceptive practices
- ✅ Legitimate email addresses only
- ✅ No address harvesting

## Compliance Checklist

Use this checklist for each email type:

- [x] **Headers accurate** (From, To, Reply-To, routing)
- [x] **Subject line accurate** (reflects content)
- [x] **Identifies sender** (SwiftVerify, LLC)
- [x] **Physical address** in footer (Boise, Idaho)
- [x] **Unsubscribe button** prominent and functional
- [x] **Unsubscribe at top** of email
- [x] **Unsubscribe at bottom** of email
- [x] **Unsubscribe disclosure** text included
- [x] **Processes opt-out immediately** (< 1 second)
- [x] **Honors opt-out** (no emails after unsubscribe)
- [x] **Tokens valid** for required period (90 days)
- [x] **Audit logging** enabled
- [x] **No third-party senders** (direct control)

## Audit & Verification

### Monthly Compliance Review
1. **Review unsubscribe metrics**
   - All unsubscribes processed immediately?
   - Any emails sent to unsubscribed users? (should be 0)
   - Unsubscribe rate by email type

2. **Review email content**
   - Subject lines accurate?
   - Unsubscribe buttons present?
   - Physical address in footer?
   - Clear identification?

3. **Review technical implementation**
   - Unsubscribe links functional?
   - Tokens expiring correctly?
   - Pre-send checks working?
   - Audit logs complete?

### Annual Compliance Audit
- Legal team review of all email templates
- Verification of opt-out mechanisms
- Review of complaint rate (if any)
- Update to latest CAN-SPAM requirements
- Documentation update

## Best Practices Beyond Compliance

While not required by law, SwiftVerify follows these best practices:

1. **Clear Privacy Policy**
   - Explain how we use email addresses
   - Link in every email
   - Easy to understand

2. **Respect User Preferences**
   - Don't send unnecessary emails
   - Frequency limits
   - Relevant content only

3. **Mobile Optimization**
   - Responsive email design
   - Large unsubscribe buttons
   - Easy to read on small screens

4. **Accessibility**
   - Alt text for images
   - Semantic HTML
   - High contrast for readability

5. **Testing**
   - Regular unsubscribe link testing
   - Multi-device testing
   - Email client compatibility

## Email Template Standards

All SwiftVerify email templates must include:

```html
<!-- Top of Email - Before Content -->
<div style="text-align: center; margin: 20px 0;">
    <a href="https://swift-verify.org/unsubscribe/{token}" 
       style="background-color: #dc3545; color: white; padding: 16px 32px; 
              text-decoration: none; border-radius: 5px; font-weight: bold; 
              display: inline-block; font-size: 16px;">
        UNSUBSCRIBE IMMEDIATELY
    </a>
</div>

<!-- Main Email Content Here -->

<!-- Bottom of Email - Footer -->
<div style="border-top: 2px solid #e9ecef; margin-top: 30px; padding-top: 20px;">
    <!-- Unsubscribe Button (repeated) -->
    <div style="text-align: center; margin: 20px 0;">
        <a href="https://swift-verify.org/unsubscribe/{token}" 
           style="background-color: #dc3545; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 5px; font-weight: bold; 
                  display: inline-block; font-size: 14px;">
            UNSUBSCRIBE IMMEDIATELY
        </a>
    </div>
    
    <!-- Disclosure -->
    <div style="font-size: 12px; color: #666; margin: 20px 0; padding: 15px; 
                background-color: #f8f9fa; border-left: 4px solid #dc3545;">
        <p style="margin: 0; font-weight: bold;">Unsubscribe from SwiftVerify emails:</p>
        <p style="margin: 5px 0 0 0;">
            Your unsubscribe request is processed <strong>IMMEDIATELY</strong>. 
            This action is permanently logged and audited at SwiftVerify, LLC.
        </p>
    </div>
    
    <!-- Company Information -->
    <div style="text-align: center; font-size: 12px; color: #6c757d; margin-top: 20px;">
        <p style="margin: 5px 0;"><strong>SwiftVerify, LLC</strong></p>
        <p style="margin: 5px 0;">Boise, Idaho</p>
        <p style="margin: 5px 0;"><a href="https://swift-verify.org">www.swift-verify.org</a></p>
        <p style="margin: 5px 0;">support@swift-verify.org</p>
        <p style="margin: 15px 0 5px 0; font-size: 11px; color: #999;">
            This email is sent as part of our rental verification service.
            We never perform credit checks. This message complies with the CAN-SPAM Act.
        </p>
    </div>
</div>
```

## Resources

### Official Resources
- [FTC CAN-SPAM Act Compliance Guide](https://www.ftc.gov/tips-advice/business-center/guidance/can-spam-act-compliance-guide-business)
- [CAN-SPAM Act: A Compliance Guide for Business](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business)
- [16 CFR Part 316 - CAN-SPAM Rule](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-C/part-316)

### SwiftVerify Documentation
- [Unsubscribe Policy](./UNSUBSCRIBE_POLICY.md)
- [Audit Logging](./AUDIT_LOGGING.md)
- [AWS SES Setup](./AWS_SES_SETUP.md)

## Contact

For CAN-SPAM compliance questions:
- **Compliance Officer:** compliance@swift-verify.org
- **Legal Team:** legal@swift-verify.org
- **Technical Support:** devops@swift-verify.org

## Version History

- **1.0** (2026-02-09): Initial CAN-SPAM compliance documentation

Last Updated: 2026-02-09
Reviewed By: Legal Team
Next Review: 2026-08-09
