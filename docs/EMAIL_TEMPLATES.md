# Email Templates Guide

This guide explains how to customize and maintain email templates for SwiftVerify.

## Table of Contents

1. [Template Structure](#template-structure)
2. [Available Templates](#available-templates)
3. [Customization](#customization)
4. [Brand Styling](#brand-styling)
5. [Legal Compliance](#legal-compliance)
6. [Testing Templates](#testing-templates)
7. [Best Practices](#best-practices)

## Template Structure

All email templates are located in `frontend/src/utils/emailTemplates.js` and follow a consistent structure:

```javascript
// Base template with header, footer, and styling
const baseEmailTemplate = (content, title) => {
  // Returns complete HTML email
};

// Individual email template
export const denialEmailTemplate = ({ params }) => {
  const content = `<!-- Email-specific content -->`;
  return baseEmailTemplate(content, title);
};
```

### Template Components

Each email consists of:

1. **Header** - SwiftVerify branding and logo
2. **Content** - Email-specific message and information
3. **Footer** - Legal disclaimers, links, and unsubscribe
4. **Styling** - Inline CSS for email client compatibility

## Available Templates

### 1. Denial Email Template

**Function:** `denialEmailTemplate`

**Parameters:**
- `reason` (string) - Reason for denial
- `applicationId` (string) - Application ID
- `appealDeadline` (string) - Formatted appeal deadline date

**Usage:**
```javascript
import { denialEmailTemplate } from '../utils/emailTemplates';

const html = denialEmailTemplate({
  reason: 'Income does not meet 3x rent requirement',
  applicationId: 'APP-2024-001',
  appealDeadline: 'March 15, 2024',
});
```

**Key Features:**
- Prominent legal disclaimer about Equifax non-responsibility
- Appeal rights information (30-day window)
- Appeal instructions with contact details
- Application ID for reference
- Link to submit appeal online

### 2. Approval Email Template

**Function:** `approvalEmailTemplate`

**Parameters:**
- `applicationId` (string) - Application ID
- `propertyAddress` (string, optional) - Property address
- `leaseLink` (string, optional) - Lease signing link
- `landlordName` (string, optional) - Landlord name

**Usage:**
```javascript
import { approvalEmailTemplate } from '../utils/emailTemplates';

const html = approvalEmailTemplate({
  applicationId: 'APP-2024-001',
  propertyAddress: '123 Main St, Boise, ID 83702',
  leaseLink: 'https://swift-verify.org/lease-sign?id=APP-2024-001',
  landlordName: 'John Smith Properties',
});
```

**Key Features:**
- Congratulatory message
- Clear next steps
- Lease signing call-to-action button
- Property and landlord information
- Support contact details

### 3. Waiver Email Template

**Function:** `waiverEmailTemplate`

**Parameters:**
- `waiverAmount` (number) - Waiver amount in dollars
- `applicationId` (string) - Application ID
- `landlordName` (string, optional) - Landlord name
- `propertyAddress` (string, optional) - Property address

**Usage:**
```javascript
import { waiverEmailTemplate } from '../utils/emailTemplates';

const html = waiverEmailTemplate({
  waiverAmount: 150.00,
  applicationId: 'APP-2024-001',
  landlordName: 'ABC Property Management',
  propertyAddress: '456 Elm St, Boise, ID 83702',
});
```

**Key Features:**
- Clear waiver amount display
- Explanation of what a waiver is
- Next steps for acknowledgment
- Link to review and accept waiver

### 4. Gap Pay Email Template

**Function:** `gapPayEmailTemplate`

**Parameters:**
- `gapAmount` (number) - Monthly gap pay amount
- `applicationId` (string) - Application ID
- `monthlyRent` (number, optional) - Monthly rent amount
- `propertyAddress` (string, optional) - Property address

**Usage:**
```javascript
import { gapPayEmailTemplate } from '../utils/emailTemplates';

const html = gapPayEmailTemplate({
  gapAmount: 300.00,
  applicationId: 'APP-2024-001',
  monthlyRent: 1500.00,
  propertyAddress: '789 Oak Ave, Boise, ID 83702',
});
```

**Key Features:**
- Congratulatory approval message
- Clear gap pay amount
- Explanation of how gap pay works
- Lease signing call-to-action

### 5. Landlord Alert Email Template

**Function:** `landlordAlertEmailTemplate`

**Parameters:**
- `applicantName` (string) - Applicant's name
- `propertyAddress` (string) - Property address
- `applicationId` (string) - Application ID
- `dashboardLink` (string, optional) - Dashboard link

**Usage:**
```javascript
import { landlordAlertEmailTemplate } from '../utils/emailTemplates';

const html = landlordAlertEmailTemplate({
  applicantName: 'Jane Doe',
  propertyAddress: '123 Main St, Boise, ID 83702',
  applicationId: 'APP-2024-001',
  dashboardLink: 'https://swift-verify.org/landlord/dashboard',
});
```

### 6. Account Created Email Template

**Function:** `accountCreatedEmailTemplate`

**Parameters:**
- `email` (string) - User's email address
- `temporaryPassword` (string) - Temporary password
- `dashboardLink` (string, optional) - Login link

**Usage:**
```javascript
import { accountCreatedEmailTemplate } from '../utils/emailTemplates';

const html = accountCreatedEmailTemplate({
  email: 'user@example.com',
  temporaryPassword: 'TempPass123!',
  dashboardLink: 'https://swift-verify.org/login',
});
```

## Customization

### Changing Colors

The base template uses CSS variables for easy color customization. Edit `baseEmailTemplate`:

```javascript
// Current colors
const primaryColor = '#667eea';      // Purple gradient start
const secondaryColor = '#764ba2';    // Purple gradient end
const successColor = '#28a745';      // Green for success messages
const warningColor = '#ffc107';      // Yellow for warnings
const dangerColor = '#dc3545';       // Red for errors

// To customize, update these in the <style> section:
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Adding Your Logo

Replace the text header with an image:

```javascript
// Current header
<div class="header">
  <h1>SwiftVerify</h1>
  <p style="margin: 5px 0 0 0; opacity: 0.9;">Path to Yes - Rental Verification Platform</p>
</div>

// With logo
<div class="header">
  <img src="https://www.swift-verify.org/logo.png" alt="SwiftVerify" style="max-width: 200px; height: auto;">
  <p style="margin: 10px 0 0 0; opacity: 0.9;">Path to Yes - Rental Verification Platform</p>
</div>
```

### Customizing Footer Links

Edit the footer section in `baseEmailTemplate`:

```javascript
<div class="footer">
  <p><strong>SwiftVerify</strong> - Making rental applications simple and transparent</p>
  <p>
    <a href="${EXTERNAL_LINKS.COMPANY_WEBSITE}">Visit Website</a> | 
    <a href="mailto:${EXTERNAL_LINKS.SUPPORT_EMAIL}">Support</a> | 
    <a href="${EXTERNAL_LINKS.COMPANY_WEBSITE}/privacy">Privacy Policy</a> |
    <a href="${EXTERNAL_LINKS.COMPANY_WEBSITE}/unsubscribe">Unsubscribe</a>
  </p>
  <!-- Add more links as needed -->
</div>
```

### Modifying Content Sections

Each template has clearly defined sections you can customize:

```javascript
export const approvalEmailTemplate = ({ applicationId, propertyAddress, leaseLink, landlordName }) => {
  const content = `
    <!-- Greeting -->
    <h2>🎉 Congratulations! Your Application is Approved</h2>
    <p>Dear Applicant,</p>
    
    <!-- Main message - CUSTOMIZE THIS -->
    <p>Great news! Your rental application has been <strong>approved</strong> through SwiftVerify.</p>
    
    <!-- Application details -->
    <div class="application-id">
      <strong>Application ID:</strong> ${applicationId}
    </div>
    
    <!-- Add your custom sections here -->
  `;
  
  return baseEmailTemplate(content, 'Congratulations - Application Approved!');
};
```

## Brand Styling

### Typography

Current font stack:
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

To use a custom font:

1. **Web fonts (limited support in email):**
   ```css
   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
   
   body {
     font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
   }
   ```

2. **System fonts (recommended for better compatibility):**
   ```css
   body {
     font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
   }
   ```

### Color Scheme

Edit the color constants:

```javascript
// Success/Positive
.success-box {
  background-color: #d4edda;
  border-left: 4px solid #28a745;
}

// Warning/Attention
.alert-box {
  background-color: #fff3cd;
  border-left: 4px solid #ffc107;
}

// Info/Neutral
.info-box {
  background-color: #d1ecf1;
  border-left: 4px solid #17a2b8;
}
```

### Button Styles

Customize the call-to-action button:

```css
.button {
  display: inline-block;
  padding: 12px 30px;                                    /* Adjust size */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);  /* Colors */
  color: #ffffff !important;
  text-decoration: none;
  border-radius: 6px;                                    /* Corner rounding */
  font-weight: 600;
  margin: 20px 0;
}
```

## Legal Compliance

### Required Elements

All emails must include:

1. **CAN-SPAM Compliance:**
   - ✅ Valid physical address
   - ✅ Clear identification of sender
   - ✅ Unsubscribe link
   - ✅ Accurate subject lines

2. **Privacy Notices:**
   ```javascript
   <p style="font-size: 12px; color: #868e96; margin-top: 16px;">
     ${LEGAL_DISCLAIMERS.NO_SSN_STORAGE}
   </p>
   ```

3. **Legal Disclaimers (Denial Emails):**
   ```javascript
   <div class="alert-box">
     <h3>⚠️ Important Legal Information</h3>
     <ul>
       <li><strong>SwiftVerify made this determination, NOT Equifax.</strong></li>
       <li><strong>Equifax is NOT responsible for this denial decision.</strong></li>
       <li>Equifax Work Number only provided employment and income verification data.</li>
     </ul>
   </div>
   ```

### Updating Legal Text

Legal disclaimers are centralized in `frontend/src/utils/constants.js`:

```javascript
export const LEGAL_DISCLAIMERS = {
  NO_SSN_STORAGE: 'SwiftVerify does NOT store Social Security Numbers...',
  DENIAL_NOT_EQUIFAX: 'IMPORTANT: SwiftVerify made this determination...',
  APPEAL_RIGHTS: 'You may appeal this decision within 30 days...',
  DATA_LIFECYCLE: 'Driver\'s license information and verification data...',
};
```

To update legal text:

1. Edit the constant in `constants.js`
2. The change automatically applies to all templates
3. Have legal team review changes
4. Document the change date and reason

## Testing Templates

### Visual Testing

1. **Email Client Preview:**
   - Use [Litmus](https://litmus.com) or [Email on Acid](https://www.emailonacid.com)
   - Test in Gmail, Outlook, Apple Mail, mobile clients
   
2. **Local Preview:**
   ```javascript
   // Create a test HTML file
   import { denialEmailTemplate } from './emailTemplates';
   
   const html = denialEmailTemplate({
     reason: 'Test reason',
     applicationId: 'TEST-123',
     appealDeadline: 'March 15, 2024',
   });
   
   // Save to file and open in browser
   fs.writeFileSync('test-email.html', html);
   ```

3. **Browser Console:**
   ```javascript
   // In browser console
   const template = await import('./utils/emailTemplates');
   const html = template.denialEmailTemplate({
     reason: 'Test',
     applicationId: 'TEST',
     appealDeadline: 'March 15, 2024'
   });
   console.log(html);
   ```

### Functionality Testing

Test all interactive elements:

- ✅ All links work correctly
- ✅ Buttons link to correct pages
- ✅ Unsubscribe link functions
- ✅ Application IDs display correctly
- ✅ Dynamic content populates

### Spam Score Testing

Use [Mail Tester](https://www.mail-tester.com):

1. Send test email to the provided address
2. Check your spam score (aim for 8+/10)
3. Review recommendations
4. Fix any issues (missing SPF/DKIM, spam trigger words)

### Accessibility Testing

Ensure emails are accessible:

- ✅ Sufficient color contrast
- ✅ Readable font sizes (14px minimum)
- ✅ Alt text for images
- ✅ Semantic HTML structure
- ✅ Clear call-to-action buttons

## Best Practices

### Content Guidelines

1. **Subject Lines:**
   - Keep under 50 characters
   - Be clear and specific
   - Avoid spam trigger words (FREE, URGENT, ACT NOW)
   
2. **Body Content:**
   - Use clear, concise language
   - Break up text with headings and lists
   - Highlight important information
   - Include application ID prominently

3. **Call-to-Action:**
   - One primary CTA per email
   - Use action-oriented text ("Sign Your Lease Now")
   - Make buttons large and easily clickable

### Technical Guidelines

1. **HTML Email Best Practices:**
   - Use inline CSS (not external stylesheets)
   - Use tables for layout (better email client support)
   - Avoid JavaScript
   - Provide plain text alternative
   
2. **Images:**
   - Host externally (not embedded)
   - Include alt text
   - Don't rely on images for critical information
   
3. **Links:**
   - Use absolute URLs (not relative)
   - Include unsubscribe link
   - Test all links before sending

### Performance

1. **Keep HTML under 102KB** (Gmail clips larger emails)
2. **Optimize images** (use web-optimized formats)
3. **Minimize inline CSS** (extract common styles)
4. **Test loading time** on slow connections

### Maintenance

1. **Version Control:**
   - Track all template changes in git
   - Document reasons for changes
   - Tag major template revisions

2. **Regular Reviews:**
   - Quarterly legal review
   - Monthly performance review (open rates, click rates)
   - Annual design refresh

3. **A/B Testing:**
   - Test subject lines
   - Test CTA button text
   - Test email layouts
   - Measure engagement metrics

## Troubleshooting

### Template Not Rendering

**Check:**
- Closing tags match opening tags
- Template literals use backticks `` ` ``
- Variables are properly interpolated `${variable}`

### Styling Not Applied

**Check:**
- CSS is inline (not in `<style>` tag)
- No unsupported CSS properties
- Email client supports the CSS you're using

### Dynamic Content Missing

**Check:**
- All required parameters passed to template
- Parameters have values (not undefined)
- Template function called correctly

## Next Steps

- [AWS SES Setup](./AWS_SES_SETUP.md) - Set up AWS SES
- [Configuration Guide](./AWS_SES_CONFIG.md) - Configure environment
- [Troubleshooting](./AWS_SES_TROUBLESHOOTING.md) - Common issues

## Resources

- HTML Email Guide: https://www.campaignmonitor.com/css/
- Email Client Support: https://www.caniemail.com/
- Spam Checker: https://www.mail-tester.com/
- Template Testing: https://litmus.com/

## Support

For template customization help:
- SwiftVerify Support: support@swiftverify.com
- Design Team: design@swiftverify.com
