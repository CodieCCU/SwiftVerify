import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  register: (userData) => api.post('/auth/register', userData),
};

export const verificationAPI = {
  submitDriverLicense: (data) => api.post('/verification/license', data),
  submitSSN: (data) => api.post('/verification/ssn', data),
  getVerificationStatus: () => api.get('/verification/status'),
};

export const employmentAPI = {
  submitEmployment: (data) => api.post('/employment/submit', data),
  verifyIncome: (data) => api.post('/employment/verify-income', data),
  getEmploymentInfo: () => api.get('/employment/info'),
};

export const backgroundCheckAPI = {
  submitBackgroundCheck: (data) => api.post('/background-check/submit', data),
  getBackgroundCheckStatus: () => api.get('/background-check/status'),
  getBackgroundCheckResults: () => api.get('/background-check/results'),
};

export const approvalAPI = {
  getPropertyDetails: () => api.get('/approval/property'),
  getApprovalDetails: () => api.get('/approval/details'),
  submitSignature: (signatureData) => api.post('/approval/signature', signatureData),
  finalizeAgreement: () => api.post('/approval/finalize'),
};

export default api;
