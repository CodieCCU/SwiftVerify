/**
 * Validation utilities for SwiftVerify
 */

// Email validation regex
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Driver's License validation (basic format check)
export const validateLicenseNumber = (license) => {
  if (!license || typeof license !== 'string') return false;
  // At least 5 characters (varies by state)
  return license.trim().length >= 5;
};

// Check if all consent checkboxes are checked
export const validateAllConsents = (consents) => {
  return Object.values(consents).every(value => value === true);
};

// Validate waiver amount ($0.01 - $200)
export const validateWaiverAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num >= 0.01 && num <= 200;
};

// Validate phone number (basic US format)
export const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-\(\)]+$/;
  const digitsOnly = phone.replace(/\D/g, '');
  return phoneRegex.test(phone) && digitsOnly.length >= 10;
};
