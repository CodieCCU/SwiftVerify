import React from 'react';

/**
 * Loading spinner component for verification status
 */
const VerificationSpinner = ({ label, completed = false, size = 60 }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
    }}>
      {!completed ? (
        <>
          <div style={{
            width: `${size}px`,
            height: `${size}px`,
            border: '4px solid #e3f2fd',
            borderTop: '4px solid #1976d2',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </>
      ) : (
        <div style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          backgroundColor: '#4caf50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: `${size * 0.5}px`,
          color: 'white',
        }}>
          ✓
        </div>
      )}
      <p style={{ 
        margin: 0, 
        fontSize: '0.9rem', 
        color: completed ? '#4caf50' : '#666',
        fontWeight: completed ? '600' : '400',
      }}>
        {label}
      </p>
    </div>
  );
};

export default VerificationSpinner;
