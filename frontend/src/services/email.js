/**
 * Email service integration (AWS SES placeholders)
 */

import { API_ENDPOINTS, EMAIL_TEMPLATES, LEGAL_DISCLAIMERS } from '../utils/constants';

/**
 * Send denial email with legal disclaimers
 * @param {Object} data - Email data
 */
export const sendDenialEmail = async (data) => {
  const { email, reason, applicationId } = data;
  
  console.log('📧 AWS SES - Sending Denial Email (Placeholder)');
  console.log('Endpoint:', API_ENDPOINTS.SEND_DENIAL_EMAIL);
  console.log('Recipient:', email);
  
  const emailContent = {
    to: email,
    subject: EMAIL_TEMPLATES.DENIAL_SUBJECT,
    html: EMAIL_TEMPLATES.DENIAL_BODY(reason),
    metadata: {
      applicationId,
      legalDisclaimer: LEGAL_DISCLAIMERS.DENIAL_NOT_EQUIFAX,
      appealRights: LEGAL_DISCLAIMERS.APPEAL_RIGHTS,
    },
  };
  
  console.log('Email Content:', emailContent);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    messageId: 'msg_' + Date.now(),
    sentAt: new Date().toISOString(),
  };
};

/**
 * Send approval email
 */
export const sendApprovalEmail = async (data) => {
  const { email, applicationId } = data;
  
  console.log('📧 AWS SES - Sending Approval Email (Placeholder)');
  console.log('Endpoint:', API_ENDPOINTS.SEND_APPROVAL_EMAIL);
  console.log('Recipient:', email);
  
  const emailContent = {
    to: email,
    subject: EMAIL_TEMPLATES.APPROVAL_SUBJECT,
    html: `
      <h2>Congratulations! Your Application is Approved</h2>
      <p>Your rental application has been approved through SwiftVerify.</p>
      <p>Next steps:</p>
      <ol>
        <li>Review and sign your lease agreement</li>
        <li>Complete any required deposits</li>
        <li>Schedule your move-in date</li>
      </ol>
      <p>Application ID: ${applicationId}</p>
    `,
  };
  
  console.log('Email Content:', emailContent);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    messageId: 'msg_' + Date.now(),
    sentAt: new Date().toISOString(),
  };
};

/**
 * Send waiver form email
 */
export const sendWaiverEmail = async (data) => {
  const { email, waiverAmount, applicationId } = data;
  
  console.log('📧 AWS SES - Sending Waiver Email (Placeholder)');
  console.log('Endpoint:', API_ENDPOINTS.SEND_WAIVER_EMAIL);
  console.log('Recipient:', email);
  console.log('Waiver Amount:', waiverAmount);
  
  const emailContent = {
    to: email,
    subject: EMAIL_TEMPLATES.WAIVER_SUBJECT,
    html: `
      <h2>Application Approved - Waiver Form Required</h2>
      <p>Good news! Your application has been approved.</p>
      <p>A waiver form in the amount of <strong>$${waiverAmount.toFixed(2)}</strong> is required to proceed.</p>
      <p>Please review and acknowledge the waiver terms to continue with your lease signing.</p>
      <p>Application ID: ${applicationId}</p>
    `,
  };
  
  console.log('Email Content:', emailContent);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    messageId: 'msg_' + Date.now(),
    sentAt: new Date().toISOString(),
  };
};

/**
 * Send gap pay notification email
 */
export const sendGapPayEmail = async (data) => {
  const { email, gapAmount, applicationId } = data;
  
  console.log('📧 AWS SES - Sending Gap Pay Email (Placeholder)');
  console.log('Recipient:', email);
  console.log('Gap Amount:', gapAmount);
  
  const emailContent = {
    to: email,
    subject: 'SwiftVerify Application Approved - Gap Pay Coverage',
    html: `
      <h2>Congratulations! Application Approved with Gap Pay</h2>
      <p>Your application has been approved!</p>
      <p>SwiftVerify will cover your income gap of <strong>$${gapAmount.toFixed(2)}/month</strong> to ensure you meet the landlord's income requirements.</p>
      <p>You can now proceed with lease signing.</p>
      <p>Application ID: ${applicationId}</p>
    `,
  };
  
  console.log('Email Content:', emailContent);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    messageId: 'msg_' + Date.now(),
    sentAt: new Date().toISOString(),
  };
};

export default {
  sendDenialEmail,
  sendApprovalEmail,
  sendWaiverEmail,
  sendGapPayEmail,
};
