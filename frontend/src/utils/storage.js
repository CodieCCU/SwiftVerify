// localStorage utility for persisting form data across sessions

const STORAGE_KEY = 'swiftverify_form_data';
const ATTEMPTS_KEY = 'swiftverify_attempts';

/**
 * Save form data to localStorage
 * @param {Object} data - Form data to save
 */
export const saveFormData = (data) => {
  try {
    const dataToSave = {
      ...data,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Error saving form data:', error);
  }
};

/**
 * Retrieve saved form data from localStorage
 * @returns {Object|null} Saved form data or null if none exists
 */
export const getFormData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error retrieving form data:', error);
  }
  return null;
};

/**
 * Clear saved form data from localStorage
 */
export const clearFormData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing form data:', error);
  }
};

/**
 * Increment retry attempt counter
 * @returns {number} Current attempt count
 */
export const incrementAttemptCount = () => {
  try {
    const attempts = getAttemptCount();
    const newCount = attempts + 1;
    localStorage.setItem(ATTEMPTS_KEY, newCount.toString());
    return newCount;
  } catch (error) {
    console.error('Error incrementing attempt count:', error);
    return 1;
  }
};

/**
 * Get current retry attempt count
 * @returns {number} Current attempt count
 */
export const getAttemptCount = () => {
  try {
    const count = localStorage.getItem(ATTEMPTS_KEY);
    return count ? parseInt(count, 10) : 0;
  } catch (error) {
    console.error('Error getting attempt count:', error);
    return 0;
  }
};

/**
 * Reset attempt counter
 */
export const resetAttemptCount = () => {
  try {
    localStorage.removeItem(ATTEMPTS_KEY);
  } catch (error) {
    console.error('Error resetting attempt count:', error);
  }
};

/**
 * Check if there's saved data available for recovery
 * @returns {boolean} True if saved data exists
 */
export const hasSavedData = () => {
  const data = getFormData();
  return data !== null && data.email;
};

/**
 * Get time elapsed since data was saved
 * @returns {string} Human-readable time difference
 */
export const getTimeSinceSave = () => {
  const data = getFormData();
  if (!data || !data.savedAt) {
    return null;
  }

  const savedTime = new Date(data.savedAt);
  const now = new Date();
  const diffMs = now - savedTime;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  } else {
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }
};
