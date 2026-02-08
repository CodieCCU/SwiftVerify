/**
 * Shared styling utilities for SwiftVerify
 */

// Color palette
export const COLORS = {
  primary: '#1976d2',
  primaryDark: '#1565c0',
  primaryLight: '#e3f2fd',
  
  success: '#4caf50',
  successLight: '#e8f5e9',
  
  warning: '#ffc107',
  warningLight: '#fff3cd',
  warningDark: '#856404',
  
  error: '#f44336',
  errorLight: '#ffebee',
  
  info: '#2196f3',
  infoLight: '#e3f2fd',
  
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  text: {
    primary: '#333',
    secondary: '#666',
    disabled: '#999',
  },
  
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
};

// Common button styles
export const buttonStyles = {
  base: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  
  primary: {
    backgroundColor: COLORS.primary,
    color: 'white',
  },
  
  success: {
    backgroundColor: COLORS.success,
    color: 'white',
  },
  
  error: {
    backgroundColor: COLORS.error,
    color: 'white',
  },
  
  outline: {
    backgroundColor: 'transparent',
    color: COLORS.primary,
    border: `2px solid ${COLORS.primary}`,
  },
  
  large: {
    padding: '1rem 2rem',
    fontSize: '1.1rem',
  },
};

// Common card styles
export const cardStyles = {
  base: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  
  elevated: {
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
};

// Input field styles
export const inputStyles = {
  base: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  
  error: {
    border: '2px solid #f44336',
  },
  
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
};

// Spinner animation
export const spinnerStyles = {
  container: {
    display: 'inline-block',
    position: 'relative',
  },
  
  spinner: {
    width: '60px',
    height: '60px',
    border: '4px solid #e3f2fd',
    borderTop: '4px solid #1976d2',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  keyframes: `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,
};

// Layout helpers
export const layoutStyles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  
  containerSmall: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  
  containerMedium: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  
  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  flexBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

// Navigation bar styles
export const navStyles = {
  base: {
    backgroundColor: COLORS.primary,
    padding: '1rem 2rem',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  title: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: '700',
  },
};

// Alert/Notice box styles
export const alertStyles = {
  warning: {
    backgroundColor: COLORS.warningLight,
    border: `2px solid ${COLORS.warning}`,
    borderRadius: '8px',
    padding: '1.5rem',
    color: COLORS.warningDark,
  },
  
  error: {
    backgroundColor: COLORS.errorLight,
    border: `2px solid ${COLORS.error}`,
    borderRadius: '8px',
    padding: '1.5rem',
    color: COLORS.error,
  },
  
  success: {
    backgroundColor: COLORS.successLight,
    border: `2px solid ${COLORS.success}`,
    borderRadius: '8px',
    padding: '1.5rem',
    color: COLORS.success,
  },
  
  info: {
    backgroundColor: COLORS.infoLight,
    border: `2px solid ${COLORS.info}`,
    borderRadius: '8px',
    padding: '1.5rem',
    color: COLORS.primary,
  },
};

// Merge styles utility
export const mergeStyles = (...styles) => {
  return Object.assign({}, ...styles);
};
