import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth';
import { logPageView, logUserAction, logDriversLicenseCheck, logAuthentication } from '../services/logger';

const VerificationResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { approved, email, licenseNumber } = location.state || {};

  useEffect(() => {
    // Log page view with result
    if (approved !== undefined) {
      logPageView('verification_result', {
        email,
        result: approved ? 'approved' : 'denied',
      });

      // Log the final result
      logDriversLicenseCheck('verification_result_displayed', {
        email,
        result: approved ? 'approved' : 'denied',
        timestamp: new Date().toISOString(),
      });
    }

    // Redirect to home if no state is provided
    if (approved === undefined) {
      logDriversLicenseCheck('result_page_error', { reason: 'No verification data' });
      navigate('/home', { replace: true });
    }
  }, [approved, email, navigate]);

  const handleReturnHome = () => {
    logUserAction('return_home_clicked', { result: approved ? 'approved' : 'denied' });
    navigate('/home');
  };

  const handleLogout = () => {
    logAuthentication('logout', { page: 'verification_result', result: approved ? 'approved' : 'denied' });
    logout();
    navigate('/login');
  };

  const handleTryAgain = () => {
    logUserAction('try_again_clicked', { previousResult: 'denied' });
    navigate('/drivers-license');
  };

  // Don't render if no state
  if (approved === undefined) {
    return null;
  }

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
          {approved ? 'Verification Approved' : 'Verification Denied'}
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
            : 'We were unable to verify your identity at this time. Please check your information and try again, or contact support for assistance.'
          }
        </p>

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
            backgroundColor: '#fff3e0',
            borderRadius: '4px',
            fontSize: '0.875rem',
            color: '#e65100'
          }}>
            <strong>Need Help?</strong> Contact our support team at support@swiftverify.com
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationResult;
