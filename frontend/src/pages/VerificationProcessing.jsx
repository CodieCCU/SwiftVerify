import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { incrementAttemptCount } from '../utils/storage';
import DataFreezeNotification from '../components/DataFreezeNotification';

const VerificationProcessing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, licenseNumber, inputMethod, retryCount = 0 } = location.state || {};
  const [showDataFreezeModal, setShowDataFreezeModal] = useState(false);
  const [freezeInstructions, setFreezeInstructions] = useState(null);

  useEffect(() => {
    // Redirect to home if no state is provided
    if (!email) {
      navigate('/home', { replace: true });
      return;
    }

    // Call the backend API for verification
    const verifyTenant = async () => {
      try {
        const response = await axios.post('http://localhost:8080/api/verify', {
          email,
          license_number: licenseNumber,
          retry_count: retryCount
        });

        const result = response.data;

        // Handle data freeze scenario
        if (result.data_freeze || result.status === 'data_freeze') {
          setFreezeInstructions(result.freeze_instructions);
          setShowDataFreezeModal(true);
          
          // Increment attempt count for analytics
          incrementAttemptCount();
          
          // Wait for user to close modal, then navigate back
          return;
        }

        // Handle other errors
        if (result.status === 'error') {
          incrementAttemptCount();
          navigate('/verification-result', {
            state: {
              approved: false,
              email,
              licenseNumber,
              errorType: result.error_type,
              errorMessage: result.error_message,
              retryAllowed: result.retry_allowed
            },
            replace: true
          });
          return;
        }

        // Handle approved/denied
        const isApproved = result.status === 'approved';
        
        // Increment attempt count
        incrementAttemptCount();

        navigate('/verification-result', {
          state: {
            approved: isApproved,
            email,
            licenseNumber,
            verificationDetails: result.verification_details,
            retryAllowed: result.retry_allowed
          },
          replace: true
        });
      } catch (error) {
        console.error('Verification error:', error);
        
        // Increment attempt count
        incrementAttemptCount();
        
        // Handle network/server errors
        navigate('/verification-result', {
          state: {
            approved: false,
            email,
            licenseNumber,
            errorType: 'network_error',
            errorMessage: 'Unable to connect to the verification service. Please check your internet connection and try again.',
            retryAllowed: true
          },
          replace: true
        });
      }
    };

    // Start verification after a short delay
    const timer = setTimeout(verifyTenant, 1000);
    return () => clearTimeout(timer);
  }, [navigate, email, licenseNumber, retryCount]);

  const handleCloseFreezeModal = () => {
    setShowDataFreezeModal(false);
    // Navigate back to form to allow retry
    navigate('/drivers-license', { replace: true });
  };

  return (
    <>
      {showDataFreezeModal && (
        <DataFreezeNotification 
          instructions={freezeInstructions}
          onClose={handleCloseFreezeModal}
        />
      )}
      
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
        </div>
      </div>
    </>
  );
};

export default VerificationProcessing;
