import axios from 'axios';

// API base URL - configurable via environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Log categories matching backend
export const LogCategory = {
  AUTHENTICATION: 'Authentication',
  DRIVERS_LICENSE_CHECK: 'DriversLicenseCheck',
  API_CALL: 'APICall',
  USER_ACTION: 'UserAction',
  SYSTEM_EVENT: 'SystemEvent',
};

// Log severity levels
export const LogSeverity = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  CRITICAL: 'CRITICAL',
};

// Session ID for tracking user session
let sessionId = null;

// Initialize session ID
const initializeSession = () => {
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
  return sessionId;
};

// Get browser metadata
const getBrowserMetadata = () => {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    online: navigator.onLine,
  };
};

// Sanitize sensitive data from logs
const sanitizeData = (data) => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const sensitiveFields = ['ssn', 'password', 'credit_card', 'cvv', 'pin', 'secret', 'token'];
  const sanitized = { ...data };

  Object.keys(sanitized).forEach(key => {
    const lowerKey = key.toLowerCase();
    const isSensitive = sensitiveFields.some(field => lowerKey.includes(field));
    
    if (isSensitive) {
      sanitized[key] = '***REDACTED***';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  });

  return sanitized;
};

// Main logging function
const log = async (category, action, severity, metadata = {}, errorDetails = null) => {
  try {
    const sessionId = initializeSession();
    
    // Create log entry with ISO 8601 timestamp
    const logEntry = {
      category,
      action,
      severity,
      session_id: sessionId,
      metadata: {
        ...sanitizeData(metadata),
        browser: getBrowserMetadata(),
        timestamp: new Date().toISOString(), // ISO 8601 format
        url: window.location.href,
        referrer: document.referrer,
      },
    };

    if (errorDetails) {
      logEntry.error_details = errorDetails;
    }

    // Send to backend
    await axios.post(`${API_BASE_URL}/api/logs`, logEntry, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${severity}] ${category}: ${action}`, metadata);
    }
  } catch (error) {
    // Fail silently to not disrupt user experience
    // In production, could use a fallback logging mechanism
    console.error('Failed to send log to backend:', error);
  }
};

// Convenience methods
export const logInfo = (category, action, metadata = {}) => {
  return log(category, action, LogSeverity.INFO, metadata);
};

export const logWarn = (category, action, metadata = {}) => {
  return log(category, action, LogSeverity.WARN, metadata);
};

export const logError = (category, action, error, metadata = {}) => {
  const errorDetails = error?.message || error?.toString() || 'Unknown error';
  return log(category, action, LogSeverity.ERROR, metadata, errorDetails);
};

export const logCritical = (category, action, error, metadata = {}) => {
  const errorDetails = error?.message || error?.toString() || 'Unknown error';
  return log(category, action, LogSeverity.CRITICAL, metadata, errorDetails);
};

// Log user actions
export const logUserAction = (action, metadata = {}) => {
  return logInfo(LogCategory.USER_ACTION, action, metadata);
};

// Log page views
export const logPageView = (pageName, metadata = {}) => {
  return logInfo(LogCategory.USER_ACTION, 'page_view', {
    page: pageName,
    ...metadata,
  });
};

// Log form submissions
export const logFormSubmit = (formName, formData = {}) => {
  return logInfo(LogCategory.USER_ACTION, 'form_submit', {
    form: formName,
    data: sanitizeData(formData),
  });
};

// Log authentication events
export const logAuthentication = (action, metadata = {}) => {
  return logInfo(LogCategory.AUTHENTICATION, action, metadata);
};

// Log API calls
export const logAPICall = (action, metadata = {}) => {
  return logInfo(LogCategory.API_CALL, action, sanitizeData(metadata));
};

// Log driver's license checks
export const logDriversLicenseCheck = (action, metadata = {}) => {
  return logInfo(LogCategory.DRIVERS_LICENSE_CHECK, action, sanitizeData(metadata));
};

// Get session ID
export const getSessionId = () => {
  return initializeSession();
};

// Export default logger
export default {
  log,
  logInfo,
  logWarn,
  logError,
  logCritical,
  logUserAction,
  logPageView,
  logFormSubmit,
  logAuthentication,
  logAPICall,
  logDriversLicenseCheck,
  getSessionId,
  LogCategory,
  LogSeverity,
};
