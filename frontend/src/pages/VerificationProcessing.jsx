import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const VerificationProcessing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, licenseNumber, inputMethod } = location.state || {};
  const [error, setError] = useState(null);
  const [pollingCount, setPollingCount] = useState(0);

  useEffect(() => {
    // Redirect to home if no state is provided
    if (!email) {
      navigate('/home', { replace: true });
      return;
    }

    let verificationId = null;
    let pollInterval = null;

    // Submit verification request to backend
    const submitVerification = async () => {
      try {
        const response = await axios.post('http://localhost:8080/api/verify', {
          email,
          license_number: licenseNumber,
          input_method: inputMethod || 'manual'
        });

        verificationId = response.data.id;

        // Start polling for status
        pollInterval = setInterval(async () => {
          try {
            const statusResponse = await axios.get(`http://localhost:8080/api/verify/${verificationId}`);
            const { status, approved, error: verificationError } = statusResponse.data;

            setPollingCount(prev => prev + 1);

            // Check if verification is complete
            if (status === 'completed' || status === 'failed') {
              clearInterval(pollInterval);

              navigate('/verification-result', {
                state: {
                  approved: status === 'completed' && approved,
                  email,
                  licenseNumber,
                  error: status === 'failed' ? verificationError : null
                },
                replace: true
              });
            }
          } catch (pollError) {
            console.error('Error polling verification status:', pollError);
            // Continue polling on error, up to a limit
            if (pollingCount > 30) { // Stop after ~1 minute (30 * 2 seconds)
              clearInterval(pollInterval);
              setError('Verification status check timed out. Please try again.');
            }
          }
        }, 2000); // Poll every 2 seconds

      } catch (err) {
        console.error('Error submitting verification:', err);
        const errorMessage = err.response?.data?.error?.message || 'Failed to submit verification request';
        setError(errorMessage);
      }
    };

    submitVerification();

    // Cleanup
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [navigate, email, licenseNumber, inputMethod]);

  // If there's an error, show it with option to retry
  if (error) {
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
            width: '60px',
            height: '60px',
            backgroundColor: '#ffebee',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            fontSize: '2rem'
          }}>
            ⚠️
          </div>
          
          <h2 style={{ marginBottom: '1rem', color: '#d32f2f' }}>
            Verification Error
          </h2>
          
          <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '2rem' }}>
            {error}
          </p>
          
          <button
            onClick={() => navigate('/home', { replace: true })}
            style={{
              width: '100%',
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
        </div>
      </div>
    );
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
  );
};

export default VerificationProcessing;
