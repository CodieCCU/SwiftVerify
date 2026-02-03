import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StatusIndicator from '../components/StatusIndicator';

const BackgroundCheckStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, licenseNumber } = location.state || {};

  useEffect(() => {
    // Redirect if no state
    if (!email) {
      navigate('/home', { replace: true });
      return;
    }

    // Simulate background check processing (3-5 seconds)
    const timer = setTimeout(() => {
      // Navigate to income verification
      navigate('/income-verification-status', {
        state: {
          email,
          licenseNumber,
          backgroundCheckPassed: Math.random() > 0.1 // 90% pass rate for demo
        },
        replace: true
      });
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate, email, licenseNumber]);

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#1a1a2e',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: '#16213e',
        padding: '3rem',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        {/* Logo */}
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#e94560',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem',
          fontSize: '2.5rem'
        }}>
          🔍
        </div>

        <h2 style={{ marginBottom: '1rem', color: 'white', fontSize: '2rem', fontWeight: '700' }}>
          Running Background Check
        </h2>
        
        <p style={{ color: '#a0a0a0', lineHeight: '1.6', marginBottom: '2rem', fontSize: '0.875rem' }}>
          We're securely verifying your background information. This typically takes just a few moments...
        </p>

        {/* Loading Animation */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            width: '100%',
            height: '4px',
            backgroundColor: '#0f3460',
            borderRadius: '2px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              width: '50%',
              height: '100%',
              backgroundColor: '#e94560',
              borderRadius: '2px',
              animation: 'loading 1.5s ease-in-out infinite',
              position: 'absolute'
            }}></div>
          </div>
          <style>{`
            @keyframes loading {
              0% { left: -50%; }
              100% { left: 100%; }
            }
          `}</style>
        </div>

        {/* Progress Steps */}
        <div style={{
          backgroundColor: '#0f3460',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <StatusIndicator status="completed" label="Identity Verification" />
          <StatusIndicator status="processing" label="Background Check" isActive={true} />
          <StatusIndicator status="pending" label="Income Verification" />
          <StatusIndicator status="pending" label="Final Approval" />
        </div>
        
        {/* Information Display */}
        <div style={{
          backgroundColor: '#0f3460',
          padding: '1rem',
          borderRadius: '8px',
          fontSize: '0.875rem',
          color: '#a0a0a0',
          textAlign: 'left'
        }}>
          <p style={{ margin: '0.5rem 0' }}>
            <strong style={{ color: 'white' }}>Email:</strong> {email}
          </p>
          <p style={{ margin: '0.5rem 0' }}>
            <strong style={{ color: 'white' }}>License:</strong> {licenseNumber ? `${licenseNumber.substring(0, 4)}****` : 'Processing...'}
          </p>
          <p style={{ margin: '0.5rem 0' }}>
            <strong style={{ color: 'white' }}>Status:</strong> Verifying background information
          </p>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: 'rgba(233, 69, 96, 0.1)',
          borderRadius: '8px',
          fontSize: '0.75rem',
          color: '#e94560',
          border: '1px solid rgba(233, 69, 96, 0.2)'
        }}>
          <strong>🔒 Secure Processing:</strong> Your information is encrypted and handled with bank-level security.
        </div>
      </div>
    </div>
  );
};

export default BackgroundCheckStatus;
