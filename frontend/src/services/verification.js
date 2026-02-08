/**
 * Tenant verification service
 */

import { API_ENDPOINTS, VERIFICATION_STATUS, DECISION_OUTCOMES } from '../utils/constants';
import { verifyEmploymentIncome, performBackgroundCheck } from './equifax';

/**
 * Store consent selections
 */
export const storeConsent = async (consentData) => {
  console.log('📝 Storing consent data (Placeholder)');
  console.log('Endpoint:', API_ENDPOINTS.VERIFY_CONSENT);
  console.log('Consents:', consentData);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    consentId: 'consent_' + Date.now(),
    timestamp: new Date().toISOString(),
  };
};

/**
 * Submit verification request
 */
export const submitVerification = async (verificationData) => {
  console.log('🚀 Submitting verification request (Placeholder)');
  console.log('Endpoint:', API_ENDPOINTS.SUBMIT_VERIFICATION);
  console.log('Data:', {
    email: verificationData.email,
    licenseNumber: '****' + (verificationData.licenseNumber?.slice(-4) || ''),
  });
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    verificationId: 'verify_' + Date.now(),
    status: VERIFICATION_STATUS.PENDING,
  };
};

/**
 * Get verification status (for polling)
 */
export const getVerificationStatus = async (verificationId) => {
  console.log('🔍 Polling verification status (Placeholder)');
  console.log('Endpoint:', API_ENDPOINTS.VERIFICATION_STATUS + '/' + verificationId);
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Simulate progressive status updates
  const statuses = [
    VERIFICATION_STATUS.IDENTITY_VERIFYING,
    VERIFICATION_STATUS.EMPLOYMENT_VERIFYING,
    VERIFICATION_STATUS.BACKGROUND_CHECKING,
    VERIFICATION_STATUS.COMPLETED,
  ];
  
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    success: true,
    status: randomStatus,
    details: {
      identityVerified: randomStatus !== VERIFICATION_STATUS.IDENTITY_VERIFYING,
      employmentVerified: randomStatus === VERIFICATION_STATUS.BACKGROUND_CHECKING || randomStatus === VERIFICATION_STATUS.COMPLETED,
      backgroundChecked: randomStatus === VERIFICATION_STATUS.COMPLETED,
    },
  };
};

/**
 * Get final verification result
 */
export const getVerificationResult = async (verificationId) => {
  console.log('✅ Getting verification result (Placeholder)');
  console.log('Endpoint:', API_ENDPOINTS.VERIFICATION_RESULT + '/' + verificationId);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate different outcomes
  const outcomes = [
    DECISION_OUTCOMES.APPROVED,
    DECISION_OUTCOMES.APPROVED_GAP_PAY,
    DECISION_OUTCOMES.APPROVED_WAIVER,
    DECISION_OUTCOMES.DENIED,
  ];
  
  const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
  
  const result = {
    success: true,
    outcome,
    verificationId,
    timestamp: new Date().toISOString(),
  };
  
  // Add outcome-specific data
  switch (outcome) {
    case DECISION_OUTCOMES.APPROVED:
      result.message = 'Congratulations! You have been approved.';
      break;
    case DECISION_OUTCOMES.APPROVED_GAP_PAY:
      result.message = 'Approved with Gap Pay coverage.';
      result.gapAmount = 450;
      break;
    case DECISION_OUTCOMES.APPROVED_WAIVER:
      result.message = 'Approved with waiver form required.';
      result.waiverAmount = 75;
      break;
    case DECISION_OUTCOMES.DENIED:
      result.message = 'Application denied.';
      result.denialReason = 'Unable to verify sufficient employment history';
      break;
  }
  
  return result;
};

/**
 * Process dual verification (Employment + Background simultaneously)
 */
export const processDualVerification = async (verificationData) => {
  console.log('⚡ Starting dual verification process');
  
  try {
    // Run both verifications in parallel
    const [employmentResult, backgroundResult] = await Promise.all([
      verifyEmploymentIncome(verificationData),
      performBackgroundCheck(verificationData),
    ]);
    
    return {
      success: true,
      employment: employmentResult,
      background: backgroundResult,
    };
  } catch (error) {
    console.error('Error in dual verification:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Sign lease document
 */
export const signLease = async (signatureData) => {
  console.log('✍️ Signing lease (Placeholder)');
  console.log('Endpoint:', API_ENDPOINTS.SIGN_LEASE);
  console.log('Signature data received');
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    leaseId: 'lease_' + Date.now(),
    signedAt: new Date().toISOString(),
  };
};

export default {
  storeConsent,
  submitVerification,
  getVerificationStatus,
  getVerificationResult,
  processDualVerification,
  signLease,
};
