/**
 * Constants for SwiftVerify application
 */

// API Endpoints (placeholders)
export const API_ENDPOINTS = {
  // Tenant Verification
  VERIFY_CONSENT: '/api/tenant/verify-consent',
  SUBMIT_VERIFICATION: '/api/tenant/submit-verification',
  VERIFICATION_STATUS: '/api/tenant/verification-status',
  VERIFICATION_RESULT: '/api/tenant/verification-result',
  SIGN_LEASE: '/api/tenant/sign-lease',
  
  // Equifax Integration
  EQUIFAX_EMPLOYMENT: '/api/equifax/employment-income',
  EQUIFAX_BACKGROUND: '/api/equifax/background-check',
  
  // Email Notifications
  SEND_DENIAL_EMAIL: '/api/email/send-denial',
  SEND_APPROVAL_EMAIL: '/api/email/send-approval',
  SEND_WAIVER_EMAIL: '/api/email/send-waiver-request',
  
  // Landlord APIs
  LANDLORD_LOGIN: '/api/landlord/login',
  LANDLORD_PROPERTIES: '/api/landlord/properties',
  CREATE_PROPERTY: '/api/landlord/property/create',
  PROPERTY_APPLICATIONS: '/api/landlord/applications',
  SEND_LEASE: '/api/landlord/send-lease',
  SET_WAIVER: '/api/landlord/set-waiver',
};

// Consent checkboxes text
export const CONSENT_CHECKBOXES = [
  {
    id: 'employment',
    label: 'I consent to SwiftVerify checking my Employment history',
  },
  {
    id: 'income',
    label: 'I consent to SwiftVerify checking my Income verification',
  },
  {
    id: 'background',
    label: 'I consent to SwiftVerify checking my Criminal/Background records',
  },
  {
    id: 'equifax',
    label: 'I consent to have my Information securely transmitted to Equifax Work Number',
  },
  {
    id: 'noSSN',
    label: 'I understand that NO Social Security Numbers (SSNs) are stored on SwiftVerify servers',
  },
  {
    id: 'dmvSSN',
    label: 'I authorize the DMV to provide my SSN to Equifax Work Number ONLY for this verification',
  },
];

// Legal disclaimers
export const LEGAL_DISCLAIMERS = {
  NO_SSN_STORAGE: 'SwiftVerify does NOT store Social Security Numbers on our servers. Your SSN is only transmitted directly to Equifax Work Number for verification purposes.',
  
  EQUIFAX_CONSENT: 'By proceeding, you authorize Equifax Work Number to verify your employment and income information. This is NOT a credit check.',
  
  DMV_AUTHORIZATION: 'You authorize the Department of Motor Vehicles (DMV) to provide your Social Security Number to Equifax Work Number ONLY for the purpose of this verification. Your SSN will not be stored by SwiftVerify.',
  
  DENIAL_NOT_EQUIFAX: 'IMPORTANT: SwiftVerify made this determination, NOT Equifax. Equifax is NOT responsible for this denial decision. Equifax only provided verification data; the approval/denial decision was made by SwiftVerify based on landlord criteria.',
  
  APPEAL_RIGHTS: 'You may appeal this decision within 30 days by contacting appeals@swiftverify.com with your application ID and supporting documentation.',
  
  DATA_LIFECYCLE: 'Driver\'s license information and verification data are retained for 30 days for compliance purposes, then securely deleted.',
};

// Email templates
export const EMAIL_TEMPLATES = {
  DENIAL_SUBJECT: 'SwiftVerify Application Decision - Action Required',
  
  DENIAL_BODY: (reason) => `
    <h2>SwiftVerify Application Decision</h2>
    <p>Dear Applicant,</p>
    <p>After reviewing your application, we must inform you that your rental application has been <strong>denied</strong> for the following reason:</p>
    <p><strong>Reason:</strong> ${reason}</p>
    
    <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
      <h3>Important Legal Information</h3>
      <ul>
        <li><strong>SwiftVerify made this determination, NOT Equifax.</strong></li>
        <li>Equifax is NOT responsible for this denial.</li>
        <li>Equifax only provided verification data; the decision was made by SwiftVerify.</li>
        <li>You may appeal this decision within 30 days.</li>
      </ul>
    </div>
    
    <h3>How to Appeal</h3>
    <p>If you believe this decision was made in error, you have the right to appeal within 30 days by:</p>
    <ol>
      <li>Emailing appeals@swiftverify.com with your application ID</li>
      <li>Providing supporting documentation</li>
      <li>Explaining why you believe the decision should be reconsidered</li>
    </ol>
    
    <p>For questions, contact support@swiftverify.com</p>
  `,
  
  APPROVAL_SUBJECT: 'Congratulations! Your SwiftVerify Application is Approved',
  
  WAIVER_SUBJECT: 'SwiftVerify Application Approved - Waiver Form Required',
};

// Verification statuses
export const VERIFICATION_STATUS = {
  PENDING: 'PENDING',
  IDENTITY_VERIFYING: 'IDENTITY_VERIFYING',
  EMPLOYMENT_VERIFYING: 'EMPLOYMENT_VERIFYING',
  BACKGROUND_CHECKING: 'BACKGROUND_CHECKING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
};

// Decision outcomes
export const DECISION_OUTCOMES = {
  APPROVED: 'APPROVED',
  APPROVED_GAP_PAY: 'APPROVED_GAP_PAY',
  APPROVED_WAIVER: 'APPROVED_WAIVER',
  DENIED: 'DENIED',
};

// Waiver limits
export const WAIVER_LIMITS = {
  MIN: 0.01,
  MAX: 200,
  SWIFTVERIFY_THRESHOLD: 200, // Above this, SwiftVerify handles
};

// External links
export const EXTERNAL_LINKS = {
  COMPANY_WEBSITE: 'https://www.swift-verify.org',
  SUPPORT_EMAIL: 'support@swiftverify.com',
  LEGAL_EMAIL: 'legal@swiftverify.com',
  COMPLIANCE_EMAIL: 'compliance@swiftverify.com',
  APPEALS_EMAIL: 'appeals@swiftverify.com',
};

// Polling interval for verification status (milliseconds)
export const POLLING_INTERVAL = 2000; // 2 seconds
