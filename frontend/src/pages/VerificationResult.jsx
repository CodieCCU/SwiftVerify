import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth';

const VerificationResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { approved, email, licenseNumber, application, applicationId, mock } = location.state || {};

  // Determine approval status
  let isApproved = approved;
  let displayStatus = 'Unknown';
  let flagsCount = 0;
  
  if (application) {
    const status = application.status;
    const finalDecision = application.final_decision;
    flagsCount = application.flags_count || 0;
    
    if (status === 'APPROVED' || finalDecision === 'APPROVED') {
      isApproved = true;
      displayStatus = 'Approved';
    } else if (status === 'DENIED' || finalDecision === 'DENIED') {
      isApproved = false;
      displayStatus = 'Denied';
    } else if (status === 'PENDING_LANDLORD_REVIEW') {
      isApproved = null; // Pending
      displayStatus = 'Pending Landlord Review';
    } else {
      displayStatus = status;
    }
  } else if (approved !== undefined) {
    displayStatus = approved ? 'Approved' : 'Denied';
  }

  useEffect(() => {
    // Redirect to home if no state is provided
    if (approved === undefined && !application) {
      navigate('/home', { replace: true });
    }
  }, [approved, application, navigate]);

  const handleReturnHome = () => {
    navigate('/home');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleTryAgain = () => {
    navigate('/drivers-license');
  };

  // Don't render if no state
  if (approved === undefined && !application) {
    return null;
  }

  // Helper function to get status color
  const getStatusColor = () => {
    if (isApproved === true) return '#4caf50';
    if (isApproved === false) return '#f44336';
    return '#ff9800'; // Orange for pending
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        {/* Status Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto 1.5rem',
          fontSize: '3rem',
          color: 'white'
        }}>
          {isApproved === true && '✓'}
          {isApproved === false && '✗'}
          {isApproved === null && '⏱'}
        </div>

        {/* Title */}
        <h2 style={{ 
          marginBottom: '1rem', 
          color: getStatusColor(),
          fontSize: '2rem'
        }}>
          {isApproved === true && 'Verification Approved'}
          {isApproved === false && 'Verification Denied'}
          {isApproved === null && 'Pending Review'}
        </h2>

        {/* Message */}
        <p style={{ 
          color: '#666', 
          lineHeight: '1.6', 
          marginBottom: '2rem',
          fontSize: '1rem'
        }}>
          {isApproved === true && 'Your identity has been successfully verified through our multi-stage screening process. You can now proceed with your application.'}
          {isApproved === false && 'We were unable to approve your verification at this time. Please check your information and try again, or contact support for assistance.'}
          {isApproved === null && 'Your application has completed automated screening and is now pending landlord review. You will be notified once a decision has been made.'}
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
            {applicationId && (
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Application ID:</strong> {applicationId}
              </p>
            )}
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
              <strong>Status:</strong> {displayStatus}
            </p>
            {application && (
              <>
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Stages Completed:</strong> {application.current_stage} of {application.total_stages}
                </p>
                {flagsCount > 0 && (
                  <p style={{ margin: '0.5rem 0', color: '#ff9800', fontWeight: 'bold' }}>
                    <strong>Flags Raised:</strong> {flagsCount}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Additional information for pending review */}
        {isApproved === null && application && (
          <div style={{
            backgroundColor: '#fff3e0',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '2rem',
            fontSize: '0.875rem',
            color: '#e65100',
            textAlign: 'left'
          }}>
            <strong>What happens next?</strong>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li>Your application completed {application.current_stage} of {application.total_stages} automated verification stages</li>
              {flagsCount > 0 && <li>Background check raised {flagsCount} flag(s) requiring landlord review</li>}
              <li>The landlord will review your application and supporting documentation</li>
              <li>You will receive an email notification with the final decision</li>
              <li>Typical review time: 1-3 business days</li>
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {isApproved === true ? (
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
          ) : isApproved === false ? (
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
          ) : (
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
            </>
          )}
        </div>

        {/* Support Info */}
        {isApproved === false && (
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
        
        {/* Mock warning */}
        {mock && (
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#e3f2fd',
            borderRadius: '4px',
            fontSize: '0.875rem',
            color: '#1976d2'
          }}>
            <strong>Note:</strong> Backend API unavailable - showing mock results
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationResult;
