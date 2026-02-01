import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth';
import { clearFormData, resetAttemptCount, getAttemptCount } from '../utils/storage';

const VerificationResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { 
    approved, 
    email, 
    licenseNumber, 
    errorType, 
    errorMessage,
    retryAllowed = true,
    verificationDetails 
  } = location.state || {};

  useEffect(() => {
    // Redirect to home if no state is provided
    if (approved === undefined) {
      navigate('/home', { replace: true });
    }

    // Clear saved data if verification was successful
    if (approved) {
      clearFormData();
      resetAttemptCount();
    }
  }, [approved, navigate]);

  const handleReturnHome = () => {
    // Clear data on successful approval
    if (approved) {
      clearFormData();
      resetAttemptCount();
    }
    navigate('/home');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleTryAgain = () => {
    // Don't clear form data - let user retry with saved data
    navigate('/drivers-license');
  };

  // Don't render if no state
  if (approved === undefined) {
    return null;
  }

  const attemptCount = getAttemptCount();

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
        maxWidth: '500px',
        width: '100%'
      }}>
        {/* Status Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: approved ? '#4caf50' : '#f44336',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto 1.5rem',
          fontSize: '3rem',
          color: 'white'
        }}>
          {approved ? '✓' : '✗'}
        </div>

        {/* Title */}
        <h2 style={{ 
          marginBottom: '1rem', 
          color: approved ? '#4caf50' : '#f44336',
          fontSize: '2rem'
        }}>
          {approved ? 'Verification Approved' : 'Verification Failed'}
        </h2>

        {/* Message */}
        <p style={{ 
          color: '#666', 
          lineHeight: '1.6', 
          marginBottom: '2rem',
          fontSize: '1rem'
        }}>
          {approved 
            ? 'Your identity has been successfully verified. You can now proceed with your application.'
            : errorMessage || 'We were unable to verify your identity at this time. Please check your information and try again, or contact support for assistance.'
          }
        </p>

        {/* Error Details (if any) */}
        {!approved && errorType && (
          <div style={{
            backgroundColor: '#fff3e0',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1.5rem',
            textAlign: 'left',
            borderLeft: '4px solid #ff9800'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#e65100', fontSize: '0.875rem' }}>
              Error Type: {errorType.replace(/_/g, ' ').toUpperCase()}
            </h4>
            {attemptCount > 0 && (
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#666' }}>
                Attempts made: {attemptCount}
              </p>
            )}
          </div>
        )}

        {/* Information Summary */}
        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '1.5rem',
          borderRadius: '4px',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <h3 style={{ 
            margin: '0 0 1rem 0', 
            fontSize: '1rem',
            color: '#333'
          }}>
            Verification Details
          </h3>
          <div style={{ fontSize: '0.875rem', color: '#555' }}>
            <p style={{ margin: '0.5rem 0' }}>
              <strong>Email:</strong> {email || 'N/A'}
            </p>
            <p style={{ margin: '0.5rem 0' }}>
              <strong>License Number:</strong> {licenseNumber ? `${licenseNumber.substring(0, 4)}****` : 'N/A'}
            </p>
            <p style={{ margin: '0.5rem 0' }}>
              <strong>Verification Date:</strong> {new Date().toLocaleDateString()}
            </p>
            <p style={{ margin: '0.5rem 0' }}>
              <strong>Status:</strong> {approved ? 'Approved' : 'Denied'}
            </p>
            {verificationDetails?.verification_id && (
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Verification ID:</strong> {verificationDetails.verification_id}
              </p>
            )}
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
                onClick={handleReturnHome}
                style={{
                  padding: '1rem',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Return to Home
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: '1rem',
                  backgroundColor: 'white',
                  color: '#1976d2',
                  border: '2px solid #1976d2',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {retryAllowed && (
                <button
                  onClick={handleTryAgain}
                  style={{
                    padding: '1rem',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Try Again
                </button>
              )}
              <button
                onClick={handleReturnHome}
                style={{
                  padding: '1rem',
                  backgroundColor: 'white',
                  color: '#1976d2',
                  border: '2px solid #1976d2',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontWeight: '500'
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
            backgroundColor: '#e3f2fd',
            borderRadius: '4px',
            fontSize: '0.875rem',
            color: '#1976d2'
          }}>
            <strong>Need Help?</strong> Contact our support team at support@swiftverify.com
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationResult;
