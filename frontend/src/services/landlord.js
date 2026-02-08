/**
 * Landlord API service
 */

import { API_ENDPOINTS } from '../utils/constants';

/**
 * Landlord login
 */
export const landlordLogin = async (credentials) => {
  console.log('🔐 Landlord login (Placeholder)');
  console.log('Endpoint:', API_ENDPOINTS.LANDLORD_LOGIN);
  console.log('Email:', credentials.email);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate successful login
  return {
    success: true,
    token: 'jwt_token_placeholder_' + Date.now(),
    landlord: {
      id: 'landlord_1',
      email: credentials.email,
      name: 'John Landlord',
      role: 'landlord',
    },
  };
};

/**
 * Get landlord's properties
 */
export const getProperties = async () => {
  console.log('🏠 Fetching properties (Placeholder)');
  console.log('Endpoint:', API_ENDPOINTS.LANDLORD_PROPERTIES);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    properties: [
      {
        id: 'prop_1',
        name: 'Sunset Apartments',
        address: '123 Main St, Boise, ID 83702',
        units: 24,
        activeApplications: 3,
      },
      {
        id: 'prop_2',
        name: 'Downtown Lofts',
        address: '456 Oak Ave, Boise, ID 83702',
        units: 12,
        activeApplications: 1,
      },
    ],
  };
};

/**
 * Create new property
 */
export const createProperty = async (propertyData) => {
  console.log('➕ Creating property (Placeholder)');
  console.log('Endpoint:', API_ENDPOINTS.CREATE_PROPERTY);
  console.log('Property data:', propertyData);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    property: {
      id: 'prop_' + Date.now(),
      ...propertyData,
      createdAt: new Date().toISOString(),
    },
  };
};

/**
 * Get applications for a property
 */
export const getPropertyApplications = async (propertyId) => {
  console.log('📋 Fetching applications for property (Placeholder)');
  console.log('Endpoint:', API_ENDPOINTS.PROPERTY_APPLICATIONS + '/' + propertyId);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    applications: [
      {
        id: 'app_1',
        tenantName: 'John Doe',
        tenantEmail: 'john@example.com',
        status: 'APPROVED',
        identityVerified: true,
        employmentVerified: true,
        backgroundChecked: true,
        monthlyIncome: 5500,
        employer: 'Tech Corp Inc',
        submittedDate: '2026-02-01',
      },
      {
        id: 'app_2',
        tenantName: 'Jane Smith',
        tenantEmail: 'jane@example.com',
        status: 'PENDING',
        identityVerified: true,
        employmentVerified: false,
        backgroundChecked: false,
        submittedDate: '2026-02-03',
      },
    ],
  };
};

/**
 * Send lease to approved tenant
 */
export const sendLease = async (data) => {
  const { applicationId, leaseDocument } = data;
  
  console.log('📄 Sending lease to tenant (Placeholder)');
  console.log('Endpoint:', API_ENDPOINTS.SEND_LEASE);
  console.log('Application ID:', applicationId);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    leaseSentAt: new Date().toISOString(),
  };
};

/**
 * Set waiver amount for application
 */
export const setWaiver = async (data) => {
  const { applicationId, waiverAmount } = data;
  
  console.log('💰 Setting waiver amount (Placeholder)');
  console.log('Endpoint:', API_ENDPOINTS.SET_WAIVER + '/' + applicationId);
  console.log('Waiver amount:', waiverAmount);
  
  // Validate waiver is within limits
  if (waiverAmount < 0.01 || waiverAmount > 200) {
    return {
      success: false,
      error: 'Waiver amount must be between $0.01 and $200.00',
    };
  }
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    waiverAmount,
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Update screening criteria for property
 */
export const updateScreeningCriteria = async (propertyId, criteria) => {
  console.log('⚙️ Updating screening criteria (Placeholder)');
  console.log('Property ID:', propertyId);
  console.log('Criteria:', criteria);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    criteria,
    updatedAt: new Date().toISOString(),
  };
};

export default {
  landlordLogin,
  getProperties,
  createProperty,
  getPropertyApplications,
  sendLease,
  setWaiver,
  updateScreeningCriteria,
};
