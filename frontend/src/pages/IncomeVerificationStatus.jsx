import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StatusIndicator from '../components/StatusIndicator';

const IncomeVerificationStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, licenseNumber, backgroundCheckPassed } = location.state || {};

  useEffect(() => {
    // Redirect if no state
    if (!email) {
      navigate('/home', { replace: true });
      return;
    }

    // Simulate Equifax Work Number API processing (4-6 seconds)
    const timer = setTimeout(() => {
      // Determine final approval based on background check and income verification
      const incomeVerified = Math.random() > 0.15; // 85% pass rate for demo
      const approved = backgroundCheckPassed && incomeVerified;
      
      // Navigate to approval/denial screen
      navigate('/approval-denial', {
        state: {
          email,
          licenseNumber,
          backgroundCheckPassed,
          incomeVerified,
          approved
        },
        replace: true
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, email, licenseNumber, backgroundCheckPassed]);

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
          💰
        </div>

        <h2 style={{ marginBottom: '1rem', color: 'white', fontSize: '2rem', fontWeight: '700' }}>
          Verifying Income
        </h2>
        
        <p style={{ color: '#a0a0a0', lineHeight: '1.6', marginBottom: '2rem', fontSize: '0.875rem' }}>
          Connecting to Equifax Work Number API to verify your employment and income information securely...
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
              width: '60%',
              height: '100%',
              backgroundColor: '#e94560',
              borderRadius: '2px',
              animation: 'loading 1.5s ease-in-out infinite',
              position: 'absolute'
            }}></div>
          </div>
          <style>{`
            @keyframes loading {
              0% { left: -60%; }
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
          <StatusIndicator 
            status={backgroundCheckPassed ? "completed" : "failed"} 
            label="Background Check" 
          />
          <StatusIndicator status="processing" label="Income Verification" isActive={true} />
          <StatusIndicator status="pending" label="Final Approval" />
        </div>
        
        {/* Information Display */}
        <div style={{
          backgroundColor: '#0f3460',
          padding: '1.5rem',
          borderRadius: '8px',
          fontSize: '0.875rem',
          color: '#a0a0a0',
          textAlign: 'left',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ 
            margin: '0 0 1rem 0', 
            color: 'white', 
            fontSize: '1rem',
            fontWeight: '600'
          }}>
            Verification Details
          </h3>
          <p style={{ margin: '0.5rem 0' }}>
            <strong style={{ color: 'white' }}>Email:</strong> {email}
          </p>
          <p style={{ margin: '0.5rem 0' }}>
            <strong style={{ color: 'white' }}>License:</strong> {licenseNumber ? `${licenseNumber.substring(0, 4)}****` : 'N/A'}
          </p>
          <p style={{ margin: '0.5rem 0' }}>
            <strong style={{ color: 'white' }}>Background Check:</strong> 
            <span style={{ color: backgroundCheckPassed ? '#4caf50' : '#f44336', marginLeft: '0.5rem' }}>
              {backgroundCheckPassed ? '✓ Passed' : '✗ Failed'}
            </span>
          </p>
          <p style={{ margin: '0.5rem 0' }}>
            <strong style={{ color: 'white' }}>Income Verification:</strong> 
            <span style={{ color: '#ff9800', marginLeft: '0.5rem' }}>
              Processing via Equifax...
            </span>
          </p>
        </div>

        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(233, 69, 96, 0.1)',
          borderRadius: '8px',
          fontSize: '0.75rem',
          color: '#e94560',
          border: '1px solid rgba(233, 69, 96, 0.2)',
          lineHeight: '1.6'
        }}>
          <strong>🔒 Equifax Work Number Integration:</strong> We're securely accessing your employment and income data through Equifax's trusted verification system. This process is FCRA compliant and protects your privacy.
        </div>
      </div>
    </div>
  );
};

export default IncomeVerificationStatus;
