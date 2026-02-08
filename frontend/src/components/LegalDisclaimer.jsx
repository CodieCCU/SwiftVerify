import React from 'react';

/**
 * Legal disclaimer component
 */
const LegalDisclaimer = ({ title, content, type = 'info' }) => {
  const getStyles = () => {
    const baseStyles = {
      padding: '1.5rem',
      borderRadius: '8px',
      marginBottom: '1.5rem',
      fontSize: '0.9rem',
      lineHeight: '1.6',
    };

    switch (type) {
      case 'warning':
        return {
          ...baseStyles,
          backgroundColor: '#fff3cd',
          border: '2px solid #ffc107',
          color: '#856404',
        };
      case 'error':
        return {
          ...baseStyles,
          backgroundColor: '#ffebee',
          border: '2px solid #f44336',
          color: '#c62828',
        };
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: '#e8f5e9',
          border: '2px solid #4caf50',
          color: '#2e7d32',
        };
      default: // info
        return {
          ...baseStyles,
          backgroundColor: '#e3f2fd',
          border: '2px solid #1976d2',
          color: '#0d47a1',
        };
    }
  };

  return (
    <div style={getStyles()}>
      {title && (
        <h4 style={{ 
          margin: '0 0 0.75rem 0', 
          fontSize: '1.1rem',
          fontWeight: '600',
        }}>
          {title}
        </h4>
      )}
      <div style={{ whiteSpace: 'pre-line' }}>
        {content}
      </div>
    </div>
  );
};

export default LegalDisclaimer;
