import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StatusIndicator from '../components/StatusIndicator';

const ApprovalDenialScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, licenseNumber, backgroundCheckPassed, incomeVerified, approved } = location.state || {};

  React.useEffect(() => {
    // Redirect if no state
    if (approved === undefined) {
      navigate('/home', { replace: true });
    }
  }, [approved, navigate]);

  const handleSignLease = () => {
    navigate('/lease-signing', {
      state: {
        email,
        licenseNumber,
        backgroundCheckPassed,
        incomeVerified,
        approved
      }
    });
  };

  const handleReturnHome = () => {
    navigate('/home');
  };

  const handleTryAgain = () => {
    navigate('/drivers-license');
  };

  if (approved === undefined) {
    return null;
  }

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
        maxWidth: '700px',
        width: '100%'
      }}>
        {/* Status Icon */}
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: approved ? '#4caf50' : '#f44336',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto 2rem',
          fontSize: '4rem',
          color: 'white',
          boxShadow: `0 8px 24px ${approved ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`
        }}>
          {approved ? '✓' : '✗'}
        </div>

        {/* Title */}
        <h2 style={{ 
          marginBottom: '1rem', 
          color: approved ? '#4caf50' : '#f44336',
          fontSize: '2.5rem',
          fontWeight: '700'
        }}>
          {approved ? 'Application APPROVED!' : 'Application DENIED'}
        </h2>

        {/* Message */}
        <p style={{ 
          color: '#a0a0a0', 
          lineHeight: '1.6', 
          marginBottom: '2rem',
          fontSize: '1rem'
        }}>
          {approved 
            ? 'Congratulations! Your tenant application has been approved. You can now proceed to sign your lease agreement electronically.'
            : 'We regret to inform you that your application could not be approved at this time. Please review the details below or contact support for assistance.'
          }
        </p>

        {/* Verification Steps Summary */}
        <div style={{
          backgroundColor: '#0f3460',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            Verification Summary
          </h3>
          <StatusIndicator status="completed" label="Identity Verification" />
          <StatusIndicator 
            status={backgroundCheckPassed ? "completed" : "failed"} 
            label="Background Check" 
          />
          <StatusIndicator 
            status={incomeVerified ? "completed" : "failed"} 
            label="Income Verification (Equifax)" 
          />
          <StatusIndicator 
            status={approved ? "completed" : "failed"} 
            label="Final Approval" 
          />
        </div>

        {/* Information Summary */}
        <div style={{
          backgroundColor: '#0f3460',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <h3 style={{ 
            margin: '0 0 1rem 0', 
            fontSize: '1rem',
            color: 'white',
            fontWeight: '600'
          }}>
            Application Details
          </h3>
          <div style={{ fontSize: '0.875rem', color: '#a0a0a0' }}>
            <p style={{ margin: '0.5rem 0' }}>
              <strong style={{ color: 'white' }}>Email:</strong> {email || 'N/A'}
            </p>
            <p style={{ margin: '0.5rem 0' }}>
              <strong style={{ color: 'white' }}>License Number:</strong> {licenseNumber ? `${licenseNumber.substring(0, 4)}****` : 'N/A'}
            </p>
            <p style={{ margin: '0.5rem 0' }}>
              <strong style={{ color: 'white' }}>Application Date:</strong> {new Date().toLocaleDateString()}
            </p>
            <p style={{ margin: '0.5rem 0' }}>
              <strong style={{ color: 'white' }}>Final Status:</strong> 
              <span style={{ 
                color: approved ? '#4caf50' : '#f44336',
                marginLeft: '0.5rem',
                fontWeight: '600'
              }}>
                {approved ? 'APPROVED' : 'DENIED'}
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {approved ? (
            <>
              <button
                onClick={handleSignLease}
                style={{
                  padding: '1.25rem',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)'
                }}
              >
                Sign Lease Agreement →
              </button>
              <button
                onClick={handleReturnHome}
                style={{
                  padding: '1rem',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Return to Home
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleTryAgain}
                style={{
                  padding: '1.25rem',
                  backgroundColor: '#e94560',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  boxShadow: '0 4px 16px rgba(233, 69, 96, 0.3)'
                }}
              >
                Try Again
              </button>
              <button
                onClick={handleReturnHome}
                style={{
                  padding: '1rem',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Return to Home
              </button>
            </>
          )}
        </div>

        {/* Support Info */}
        {!approved && (
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: 'rgba(233, 69, 96, 0.1)',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#e94560',
            border: '1px solid rgba(233, 69, 96, 0.2)',
            lineHeight: '1.6'
          }}>
            <strong>Need Help?</strong> Contact our support team at <a href="mailto:support@swiftverify.com" style={{ color: '#e94560', textDecoration: 'none', fontWeight: '600' }}>support@swiftverify.com</a> for assistance with your application.
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalDenialScreen;
