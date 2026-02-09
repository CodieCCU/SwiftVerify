/**
 * Email service integration with AWS SES
 * 
 * This service provides production-ready email notifications using AWS SES
 * with comprehensive error handling, retry logic, and legal compliance.
 */

import { sendEmailWithRetry } from './awsSes';
import {
  denialEmailTemplate,
  approvalEmailTemplate,
  waiverEmailTemplate,
  gapPayEmailTemplate,
  landlordAlertEmailTemplate,
  accountCreatedEmailTemplate,
  htmlToPlainText,
} from '../utils/emailTemplates';
import { EMAIL_SUBJECTS } from '../utils/constants';

/**
 * Send denial email with legal disclaimers
 * @param {Object} data - Email data
 * @param {string} data.email - Recipient email address
 * @param {string} data.reason - Denial reason
 * @param {string} data.applicationId - Application ID
 * @param {string} data.landlordEmail - Landlord email (optional, for CC)
 * @returns {Promise<Object>} - Result object with success status
 */
export const sendDenialEmail = async (data) => {
  const { email, reason, applicationId, landlordEmail } = data;
  
  console.log('📧 AWS SES - Sending Denial Email');
  console.log('Recipient:', email);
  console.log('Application ID:', applicationId);
  
  try {
    // Calculate appeal deadline (30 days from now)
    const appealDeadline = new Date();
    appealDeadline.setDate(appealDeadline.getDate() + 30);
    const formattedDeadline = appealDeadline.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    // Generate email template
    const htmlBody = denialEmailTemplate({
      reason,
      applicationId,
      appealDeadline: formattedDeadline,
    });
    
    const textBody = htmlToPlainText(htmlBody);
    
    // Prepare email parameters
    const emailParams = {
      to: email,
      subject: EMAIL_SUBJECTS.DENIAL,
      htmlBody,
      textBody,
      cc: landlordEmail ? [landlordEmail] : [],
      tags: {
        emailType: 'denial',
        applicationId,
      },
    };
    
    // Send email with retry logic (3 attempts with exponential backoff)
    const result = await sendEmailWithRetry(emailParams, 3);
    
    if (result.success) {
      console.log('✅ Denial email sent successfully');
      console.log('Message ID:', result.messageId);
    } else {
      console.error('❌ Failed to send denial email:', result.error);
    }
    
    return {
      success: result.success,
      messageId: result.messageId,
      sentAt: new Date().toISOString(),
      error: result.error,
    };
  } catch (error) {
    console.error('❌ Error in sendDenialEmail:', error);
    return {
      success: false,
      error: error.message,
      sentAt: new Date().toISOString(),
    };
  }
};

/**
 * Send approval email
 * @param {Object} data - Email data
 * @param {string} data.email - Recipient email address
 * @param {string} data.applicationId - Application ID
 * @param {string} data.propertyAddress - Property address (optional)
 * @param {string} data.leaseLink - Lease signing link (optional)
 * @param {string} data.landlordName - Landlord name (optional)
 * @returns {Promise<Object>} - Result object with success status
 */
export const sendApprovalEmail = async (data) => {
  const { email, applicationId, propertyAddress, leaseLink, landlordName } = data;
  
  console.log('📧 AWS SES - Sending Approval Email');
  console.log('Recipient:', email);
  console.log('Application ID:', applicationId);
  
  try {
    // Generate email template
    const htmlBody = approvalEmailTemplate({
      applicationId,
      propertyAddress,
      leaseLink,
      landlordName,
    });
    
    const textBody = htmlToPlainText(htmlBody);
    
    // Prepare email parameters
    const emailParams = {
      to: email,
      subject: EMAIL_SUBJECTS.APPROVAL,
      htmlBody,
      textBody,
      tags: {
        emailType: 'approval',
        applicationId,
      },
    };
    
    // Send email with retry logic
    const result = await sendEmailWithRetry(emailParams, 3);
    
    if (result.success) {
      console.log('✅ Approval email sent successfully');
      console.log('Message ID:', result.messageId);
    } else {
      console.error('❌ Failed to send approval email:', result.error);
    }
    
    return {
      success: result.success,
      messageId: result.messageId,
      sentAt: new Date().toISOString(),
      error: result.error,
    };
  } catch (error) {
    console.error('❌ Error in sendApprovalEmail:', error);
    return {
      success: false,
      error: error.message,
      sentAt: new Date().toISOString(),
    };
  }
};

/**
 * Send waiver form email
 * @param {Object} data - Email data
 * @param {string} data.email - Recipient email address
 * @param {number} data.waiverAmount - Waiver amount
 * @param {string} data.applicationId - Application ID
 * @param {string} data.landlordName - Landlord name (optional)
 * @param {string} data.propertyAddress - Property address (optional)
 * @returns {Promise<Object>} - Result object with success status
 */
export const sendWaiverEmail = async (data) => {
  const { email, waiverAmount, applicationId, landlordName, propertyAddress } = data;
  
  console.log('📧 AWS SES - Sending Waiver Email');
  console.log('Recipient:', email);
  console.log('Application ID:', applicationId);
  console.log('Waiver Amount:', waiverAmount);
  
  try {
    // Generate email template
    const htmlBody = waiverEmailTemplate({
      waiverAmount,
      applicationId,
      landlordName,
      propertyAddress,
    });
    
    const textBody = htmlToPlainText(htmlBody);
    
    // Prepare email parameters
    const emailParams = {
      to: email,
      subject: EMAIL_SUBJECTS.WAIVER,
      htmlBody,
      textBody,
      tags: {
        emailType: 'waiver',
        applicationId,
        waiverAmount: waiverAmount.toString(),
      },
    };
    
    // Send email with retry logic
    const result = await sendEmailWithRetry(emailParams, 3);
    
    if (result.success) {
      console.log('✅ Waiver email sent successfully');
      console.log('Message ID:', result.messageId);
    } else {
      console.error('❌ Failed to send waiver email:', result.error);
    }
    
    return {
      success: result.success,
      messageId: result.messageId,
      sentAt: new Date().toISOString(),
      error: result.error,
    };
  } catch (error) {
    console.error('❌ Error in sendWaiverEmail:', error);
    return {
      success: false,
      error: error.message,
      sentAt: new Date().toISOString(),
    };
  }
};

/**
 * Send gap pay notification email
 * @param {Object} data - Email data
 * @param {string} data.email - Recipient email address
 * @param {number} data.gapAmount - Gap pay amount per month
 * @param {string} data.applicationId - Application ID
 * @param {number} data.monthlyRent - Monthly rent amount (optional)
 * @param {string} data.propertyAddress - Property address (optional)
 * @returns {Promise<Object>} - Result object with success status
 */
export const sendGapPayEmail = async (data) => {
  const { email, gapAmount, applicationId, monthlyRent, propertyAddress } = data;
  
  console.log('📧 AWS SES - Sending Gap Pay Email');
  console.log('Recipient:', email);
  console.log('Application ID:', applicationId);
  console.log('Gap Amount:', gapAmount);
  
  try {
    // Generate email template
    const htmlBody = gapPayEmailTemplate({
      gapAmount,
      applicationId,
      monthlyRent,
      propertyAddress,
    });
    
    const textBody = htmlToPlainText(htmlBody);
    
    // Prepare email parameters
    const emailParams = {
      to: email,
      subject: EMAIL_SUBJECTS.GAP_PAY,
      htmlBody,
      textBody,
      tags: {
        emailType: 'gap_pay',
        applicationId,
        gapAmount: gapAmount.toString(),
      },
    };
    
    // Send email with retry logic
    const result = await sendEmailWithRetry(emailParams, 3);
    
    if (result.success) {
      console.log('✅ Gap Pay email sent successfully');
      console.log('Message ID:', result.messageId);
    } else {
      console.error('❌ Failed to send Gap Pay email:', result.error);
    }
    
    return {
      success: result.success,
      messageId: result.messageId,
      sentAt: new Date().toISOString(),
      error: result.error,
    };
  } catch (error) {
    console.error('❌ Error in sendGapPayEmail:', error);
    return {
      success: false,
      error: error.message,
      sentAt: new Date().toISOString(),
    };
  }
};

/**
 * Send landlord alert email for new application
 * @param {Object} data - Email data
 * @param {string} data.landlordEmail - Landlord email address
 * @param {string} data.applicantName - Applicant name
 * @param {string} data.propertyAddress - Property address
 * @param {string} data.applicationId - Application ID
 * @param {string} data.dashboardLink - Dashboard link (optional)
 * @returns {Promise<Object>} - Result object with success status
 */
export const sendLandlordAlertEmail = async (data) => {
  const { landlordEmail, applicantName, propertyAddress, applicationId, dashboardLink } = data;
  
  console.log('📧 AWS SES - Sending Landlord Alert Email');
  console.log('Recipient:', landlordEmail);
  console.log('Application ID:', applicationId);
  
  try {
    // Generate email template
    const htmlBody = landlordAlertEmailTemplate({
      applicantName,
      propertyAddress,
      applicationId,
      dashboardLink,
    });
    
    const textBody = htmlToPlainText(htmlBody);
    
    // Prepare email parameters
    const emailParams = {
      to: landlordEmail,
      subject: EMAIL_SUBJECTS.LANDLORD_ALERT,
      htmlBody,
      textBody,
      tags: {
        emailType: 'landlord_alert',
        applicationId,
      },
    };
    
    // Send email with retry logic
    const result = await sendEmailWithRetry(emailParams, 3);
    
    if (result.success) {
      console.log('✅ Landlord alert email sent successfully');
      console.log('Message ID:', result.messageId);
    } else {
      console.error('❌ Failed to send landlord alert email:', result.error);
    }
    
    return {
      success: result.success,
      messageId: result.messageId,
      sentAt: new Date().toISOString(),
      error: result.error,
    };
  } catch (error) {
    console.error('❌ Error in sendLandlordAlertEmail:', error);
    return {
      success: false,
      error: error.message,
      sentAt: new Date().toISOString(),
    };
  }
};

/**
 * Send account created email with credentials
 * @param {Object} data - Email data
 * @param {string} data.email - User email address
 * @param {string} data.temporaryPassword - Temporary password
 * @param {string} data.dashboardLink - Dashboard link (optional)
 * @returns {Promise<Object>} - Result object with success status
 */
export const sendAccountCreatedEmail = async (data) => {
  const { email, temporaryPassword, dashboardLink } = data;
  
  console.log('📧 AWS SES - Sending Account Created Email');
  console.log('Recipient:', email);
  
  try {
    // Generate email template
    const htmlBody = accountCreatedEmailTemplate({
      email,
      temporaryPassword,
      dashboardLink,
    });
    
    const textBody = htmlToPlainText(htmlBody);
    
    // Prepare email parameters
    const emailParams = {
      to: email,
      subject: EMAIL_SUBJECTS.ACCOUNT_CREATED,
      htmlBody,
      textBody,
      tags: {
        emailType: 'account_created',
      },
    };
    
    // Send email with retry logic
    const result = await sendEmailWithRetry(emailParams, 3);
    
    if (result.success) {
      console.log('✅ Account created email sent successfully');
      console.log('Message ID:', result.messageId);
    } else {
      console.error('❌ Failed to send account created email:', result.error);
    }
    
    return {
      success: result.success,
      messageId: result.messageId,
      sentAt: new Date().toISOString(),
      error: result.error,
    };
  } catch (error) {
    console.error('❌ Error in sendAccountCreatedEmail:', error);
    return {
      success: false,
      error: error.message,
      sentAt: new Date().toISOString(),
    };
  }
};

export default {
  sendDenialEmail,
  sendApprovalEmail,
  sendWaiverEmail,
  sendGapPayEmail,
  sendLandlordAlertEmail,
  sendAccountCreatedEmail,
};
