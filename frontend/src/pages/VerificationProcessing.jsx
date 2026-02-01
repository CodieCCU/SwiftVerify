import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const VerificationProcessing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, licenseNumber, inputMethod } = location.state || {};

  useEffect(() => {
    // Redirect to home if no state is provided
    if (!email) {
      navigate('/home', { replace: true });
      return;
    }

    // Simulate API call to Equifax or verification service
    // In production, this would make an actual API call
    const timer = setTimeout(() => {
      // Simulate random approval/denial for demo
      const isApproved = Math.random() > 0.3; // 70% approval rate for demo
      
      navigate('/verification-result', {
        state: {
          approved: isApproved,
          email,
          licenseNumber
        },
        replace: true
      });
    }, 3000); // 3 second delay to simulate processing

    return () => clearTimeout(timer);
  }, [navigate, email, licenseNumber]);

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <div style={{
          marginBottom: '2rem'
        }}>
          {/* Loading spinner */}
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #e3f2fd',
            borderTop: '4px solid #1976d2',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
        
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>
          Verifying Your Information
        </h2>
        
        <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1rem' }}>
          Please wait while we securely verify your identity...
        </p>
        
        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '1rem',
          borderRadius: '4px',
          fontSize: '0.875rem',
          color: '#555'
        }}>
          <p style={{ margin: 0 }}>
            <strong>Email:</strong> {email}
          </p>
          {inputMethod === 'manual' && (
            <p style={{ margin: '0.5rem 0 0 0' }}>
              <strong>License:</strong> {licenseNumber ? `${licenseNumber.substring(0, 4)}****` : 'Processing...'}
            </p>
          )}
        </div>
        
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#e8f5e9',
          borderRadius: '4px',
          border: '1px solid #4caf50',
          fontSize: '0.875rem',
          color: '#2e7d32',
          lineHeight: '1.5'
        }}>
          <strong>Privacy Notice:</strong> SwiftVerify does NOT store, access, or retrieve 
          Social Security Numbers (SSNs) or SSN-related reports.
        </div>
      </div>
    </div>
  );
};

export default VerificationProcessing;
