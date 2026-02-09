/**
 * Email Templates - Professional HTML Email Designs
 * 
 * This module provides responsive, professional email templates with:
 * - SwiftVerify branding
 * - Legal disclaimers
 * - CAN-SPAM compliance
 * - Responsive design
 * - Fallback text versions
 */

import { LEGAL_DISCLAIMERS, EXTERNAL_LINKS } from './constants';

/**
 * Base email template with header, footer, and styling
 */
const baseEmailTemplate = (content, title = 'SwiftVerify Notification') => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f4f4f5;
      color: #333;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
      line-height: 1.6;
    }
    .content h2 {
      color: #1a1a1a;
      font-size: 24px;
      margin-top: 0;
    }
    .content p {
      margin: 16px 0;
      color: #4a5568;
    }
    .alert-box {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 16px;
      margin: 24px 0;
    }
    .alert-box h3 {
      margin-top: 0;
      color: #856404;
      font-size: 18px;
    }
    .alert-box ul {
      margin: 8px 0;
      padding-left: 20px;
    }
    .alert-box li {
      margin: 6px 0;
      color: #856404;
    }
    .success-box {
      background-color: #d4edda;
      border-left: 4px solid #28a745;
      padding: 16px;
      margin: 24px 0;
    }
    .success-box h3 {
      margin-top: 0;
      color: #155724;
      font-size: 18px;
    }
    .info-box {
      background-color: #d1ecf1;
      border-left: 4px solid #17a2b8;
      padding: 16px;
      margin: 24px 0;
    }
    .info-box h3 {
      margin-top: 0;
      color: #0c5460;
      font-size: 18px;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .button:hover {
      opacity: 0.9;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #6c757d;
      border-top: 1px solid #dee2e6;
    }
    .footer p {
      margin: 8px 0;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
    .application-id {
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      padding: 12px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 16px;
      margin: 16px 0;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 30px 20px;
      }
      .header h1 {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>SwiftVerify</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">Path to Yes - Rental Verification Platform</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p><strong>SwiftVerify</strong> - Making rental applications simple and transparent</p>
      <p>
        <a href="${EXTERNAL_LINKS.COMPANY_WEBSITE}">Visit Website</a> | 
        <a href="mailto:${EXTERNAL_LINKS.SUPPORT_EMAIL}">Support</a> | 
        <a href="${EXTERNAL_LINKS.COMPANY_WEBSITE}/unsubscribe">Unsubscribe</a>
      </p>
      <p style="font-size: 12px; color: #868e96; margin-top: 16px;">
        ${LEGAL_DISCLAIMERS.NO_SSN_STORAGE}
      </p>
      <p style="font-size: 12px; color: #868e96;">
        This email was sent by SwiftVerify. Please do not reply to this email.
        For support, contact <a href="mailto:${EXTERNAL_LINKS.SUPPORT_EMAIL}">${EXTERNAL_LINKS.SUPPORT_EMAIL}</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Denial Email Template
 */
export const denialEmailTemplate = ({ reason, applicationId, appealDeadline }) => {
  const content = `
    <h2>Application Decision Notification</h2>
    <p>Dear Applicant,</p>
    <p>Thank you for submitting your rental application through SwiftVerify. After careful review, we must inform you that your application has been <strong>denied</strong>.</p>
    
    <div class="application-id">
      <strong>Application ID:</strong> ${applicationId}
    </div>
    
    <p><strong>Reason for Denial:</strong></p>
    <p style="background-color: #f8f9fa; padding: 12px; border-radius: 4px;">${reason}</p>
    
    <div class="alert-box">
      <h3>⚠️ Important Legal Information</h3>
      <ul>
        <li><strong>SwiftVerify made this determination, NOT Equifax.</strong></li>
        <li><strong>Equifax is NOT responsible for this denial decision.</strong></li>
        <li>Equifax Work Number only provided employment and income verification data.</li>
        <li>The approval/denial decision was made by SwiftVerify based on landlord requirements and rental criteria.</li>
      </ul>
    </div>
    
    <h3>Your Right to Appeal</h3>
    <p>You have the right to appeal this decision within <strong>30 days</strong> from ${appealDeadline || 'the date of this email'}.</p>
    
    <p><strong>To submit an appeal:</strong></p>
    <ol>
      <li>Email <a href="mailto:${EXTERNAL_LINKS.APPEALS_EMAIL}">${EXTERNAL_LINKS.APPEALS_EMAIL}</a> with your Application ID</li>
      <li>Include supporting documentation (pay stubs, employment letters, etc.)</li>
      <li>Explain why you believe the decision should be reconsidered</li>
      <li>Our appeals team will review within 5-7 business days</li>
    </ol>
    
    <a href="${EXTERNAL_LINKS.COMPANY_WEBSITE}/appeal?id=${applicationId}" class="button">Submit Appeal Online</a>
    
    <div class="info-box">
      <h3>Questions or Need Help?</h3>
      <p style="margin: 0;">
        Contact our support team at <a href="mailto:${EXTERNAL_LINKS.SUPPORT_EMAIL}">${EXTERNAL_LINKS.SUPPORT_EMAIL}</a>
        or visit our <a href="${EXTERNAL_LINKS.COMPANY_WEBSITE}/help">Help Center</a>.
      </p>
    </div>
    
    <p style="margin-top: 30px; font-size: 14px; color: #6c757d;">
      <strong>Data Privacy Notice:</strong> Your verification data will be retained for 30 days for compliance purposes, then securely deleted. We do NOT store Social Security Numbers.
    </p>
  `;
  
  return baseEmailTemplate(content, 'SwiftVerify Application Decision');
};

/**
 * Approval Email Template
 */
export const approvalEmailTemplate = ({ applicationId, propertyAddress, leaseLink, landlordName }) => {
  const content = `
    <h2>🎉 Congratulations! Your Application is Approved</h2>
    <p>Dear Applicant,</p>
    <p>Great news! Your rental application has been <strong>approved</strong> through SwiftVerify.</p>
    
    <div class="application-id">
      <strong>Application ID:</strong> ${applicationId}
    </div>
    
    <div class="success-box">
      <h3>✅ Application Approved</h3>
      <p style="margin: 0;">
        ${propertyAddress ? `<strong>Property:</strong> ${propertyAddress}<br>` : ''}
        ${landlordName ? `<strong>Landlord:</strong> ${landlordName}<br>` : ''}
        <strong>Status:</strong> Approved - Ready for Lease Signing
      </p>
    </div>
    
    <h3>Next Steps</h3>
    <ol>
      <li><strong>Review Your Lease Agreement</strong> - Carefully read all terms and conditions</li>
      <li><strong>Sign the Lease</strong> - Complete the digital signature process</li>
      <li><strong>Complete Deposits</strong> - Pay required security deposit and first month's rent</li>
      <li><strong>Schedule Move-In</strong> - Coordinate your move-in date with the landlord</li>
    </ol>
    
    ${leaseLink ? `
    <a href="${leaseLink}" class="button">Sign Your Lease Now</a>
    ` : ''}
    
    <div class="info-box">
      <h3>Important Information</h3>
      <p style="margin: 0;">
        Your approval is contingent upon signing the lease agreement within 7 days. 
        If you have any questions, please contact support immediately.
      </p>
    </div>
    
    <p style="margin-top: 30px;">
      Need assistance? Our team is here to help! Contact us at 
      <a href="mailto:${EXTERNAL_LINKS.SUPPORT_EMAIL}">${EXTERNAL_LINKS.SUPPORT_EMAIL}</a>
    </p>
  `;
  
  return baseEmailTemplate(content, 'Congratulations - Application Approved!');
};

/**
 * Waiver Email Template
 */
export const waiverEmailTemplate = ({ waiverAmount, applicationId, landlordName, propertyAddress }) => {
  const content = `
    <h2>Application Approved - Waiver Form Required</h2>
    <p>Dear Applicant,</p>
    <p>Congratulations! Your rental application has been <strong>approved</strong>.</p>
    
    <div class="application-id">
      <strong>Application ID:</strong> ${applicationId}
    </div>
    
    <div class="success-box">
      <h3>✅ Application Approved</h3>
      <p style="margin: 0;">
        ${propertyAddress ? `<strong>Property:</strong> ${propertyAddress}<br>` : ''}
        ${landlordName ? `<strong>Landlord:</strong> ${landlordName}<br>` : ''}
        <strong>Status:</strong> Approved (Waiver Required)
      </p>
    </div>
    
    <h3>Waiver Form Required</h3>
    <p>A waiver form in the amount of <strong style="font-size: 20px; color: #28a745;">$${waiverAmount.toFixed(2)}</strong> is required to proceed with your lease.</p>
    
    <div class="info-box">
      <h3>What is a Waiver?</h3>
      <p>
        A waiver is an acknowledgment that certain standard requirements have been adjusted to accommodate your application. 
        This amount represents the landlord's assessment of additional risk, which is standard practice in rental agreements 
        when applicant qualifications are close to, but not fully meeting, all standard criteria.
      </p>
    </div>
    
    <h3>Next Steps</h3>
    <ol>
      <li>Review the waiver terms carefully</li>
      <li>Acknowledge and accept the waiver amount</li>
      <li>Proceed with lease signing</li>
      <li>Complete required deposits</li>
    </ol>
    
    <a href="${EXTERNAL_LINKS.COMPANY_WEBSITE}/waiver?id=${applicationId}" class="button">Review & Accept Waiver</a>
    
    <p style="margin-top: 30px;">
      Questions about the waiver? Contact us at 
      <a href="mailto:${EXTERNAL_LINKS.SUPPORT_EMAIL}">${EXTERNAL_LINKS.SUPPORT_EMAIL}</a>
    </p>
  `;
  
  return baseEmailTemplate(content, 'Application Approved - Waiver Required');
};

/**
 * Gap Pay Email Template
 */
export const gapPayEmailTemplate = ({ gapAmount, applicationId, monthlyRent, propertyAddress }) => {
  const content = `
    <h2>🎉 Application Approved with Gap Pay Coverage</h2>
    <p>Dear Applicant,</p>
    <p>Excellent news! Your rental application has been <strong>approved</strong>, and SwiftVerify will provide Gap Pay assistance.</p>
    
    <div class="application-id">
      <strong>Application ID:</strong> ${applicationId}
    </div>
    
    <div class="success-box">
      <h3>✅ Approved with Gap Pay Coverage</h3>
      <p style="margin: 0;">
        ${propertyAddress ? `<strong>Property:</strong> ${propertyAddress}<br>` : ''}
        <strong>Gap Pay Amount:</strong> <span style="font-size: 18px; color: #28a745;">$${gapAmount.toFixed(2)}/month</span><br>
        ${monthlyRent ? `<strong>Monthly Rent:</strong> $${monthlyRent.toFixed(2)}` : ''}
      </p>
    </div>
    
    <h3>What is Gap Pay?</h3>
    <p>
      Gap Pay is SwiftVerify's innovative program that helps bridge the gap between your current income 
      and the landlord's income requirements. We will cover <strong>$${gapAmount.toFixed(2)} per month</strong> 
      to ensure you meet the income criteria.
    </p>
    
    <div class="info-box">
      <h3>How Gap Pay Works</h3>
      <ol style="margin: 10px 0; padding-left: 20px;">
        <li>You pay your normal monthly rent</li>
        <li>SwiftVerify covers the gap amount directly to ensure qualification</li>
        <li>This coverage is included in your lease terms</li>
        <li>No additional payment required from you for the gap coverage</li>
      </ol>
    </div>
    
    <h3>Next Steps</h3>
    <ol>
      <li>Review your lease agreement with Gap Pay terms</li>
      <li>Sign the lease electronically</li>
      <li>Complete security deposit and first month's rent</li>
      <li>Schedule your move-in date</li>
    </ol>
    
    <a href="${EXTERNAL_LINKS.COMPANY_WEBSITE}/lease-sign?id=${applicationId}" class="button">Sign Your Lease Now</a>
    
    <p style="margin-top: 30px;">
      Congratulations on your approval! If you have any questions about Gap Pay or your lease, 
      contact us at <a href="mailto:${EXTERNAL_LINKS.SUPPORT_EMAIL}">${EXTERNAL_LINKS.SUPPORT_EMAIL}</a>
    </p>
  `;
  
  return baseEmailTemplate(content, 'Approved with Gap Pay Coverage!');
};

/**
 * Landlord Alert Email Template
 */
export const landlordAlertEmailTemplate = ({ applicantName, propertyAddress, applicationId, dashboardLink }) => {
  const content = `
    <h2>New Rental Application Received</h2>
    <p>Dear Landlord,</p>
    <p>You have received a new rental application through SwiftVerify.</p>
    
    <div class="application-id">
      <strong>Application ID:</strong> ${applicationId}
    </div>
    
    <div class="info-box">
      <h3>Application Details</h3>
      <p style="margin: 0;">
        <strong>Applicant:</strong> ${applicantName}<br>
        <strong>Property:</strong> ${propertyAddress}<br>
        <strong>Status:</strong> Verification in Progress
      </p>
    </div>
    
    <p>The applicant's employment, income, and background verification is currently being processed through Equifax Work Number and our verification system.</p>
    
    <h3>What's Next?</h3>
    <ol>
      <li>We'll complete the verification process (typically 1-2 business days)</li>
      <li>You'll receive a decision notification with full verification report</li>
      <li>Review the application and make your final decision</li>
      <li>If approved, the applicant can proceed with lease signing</li>
    </ol>
    
    ${dashboardLink ? `
    <a href="${dashboardLink}" class="button">View Application in Dashboard</a>
    ` : ''}
    
    <p style="margin-top: 30px;">
      Questions? Contact us at <a href="mailto:${EXTERNAL_LINKS.SUPPORT_EMAIL}">${EXTERNAL_LINKS.SUPPORT_EMAIL}</a>
    </p>
  `;
  
  return baseEmailTemplate(content, 'New Rental Application Received');
};

/**
 * Account Created Email Template
 */
export const accountCreatedEmailTemplate = ({ email, temporaryPassword, dashboardLink }) => {
  const content = `
    <h2>Welcome to SwiftVerify!</h2>
    <p>Dear User,</p>
    <p>Your SwiftVerify account has been created successfully.</p>
    
    <div class="success-box">
      <h3>✅ Account Created</h3>
      <p style="margin: 0;">
        <strong>Email:</strong> ${email}<br>
        <strong>Temporary Password:</strong> <code style="background: #f8f9fa; padding: 4px 8px; border-radius: 3px;">${temporaryPassword}</code>
      </p>
    </div>
    
    <div class="alert-box">
      <h3>⚠️ Important Security Notice</h3>
      <ul style="margin: 10px 0;">
        <li><strong>Change your password immediately</strong> after first login</li>
        <li>Do not share your login credentials with anyone</li>
        <li>Use a strong, unique password for your account</li>
      </ul>
    </div>
    
    <h3>Getting Started</h3>
    <ol>
      <li>Click the button below to log in</li>
      <li>Use your email and temporary password</li>
      <li>You'll be prompted to change your password</li>
      <li>Complete your profile setup</li>
    </ol>
    
    ${dashboardLink ? `
    <a href="${dashboardLink}" class="button">Log In to Your Account</a>
    ` : ''}
    
    <p style="margin-top: 30px;">
      Need help? Contact our support team at 
      <a href="mailto:${EXTERNAL_LINKS.SUPPORT_EMAIL}">${EXTERNAL_LINKS.SUPPORT_EMAIL}</a>
    </p>
  `;
  
  return baseEmailTemplate(content, 'Welcome to SwiftVerify!');
};

/**
 * Generate plain text version from HTML
 */
export const htmlToPlainText = (html) => {
  return html
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
};

export default {
  denialEmailTemplate,
  approvalEmailTemplate,
  waiverEmailTemplate,
  gapPayEmailTemplate,
  landlordAlertEmailTemplate,
  accountCreatedEmailTemplate,
  htmlToPlainText,
};
