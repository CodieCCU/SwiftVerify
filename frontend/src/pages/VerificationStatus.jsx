import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import VerificationSpinner from '../components/VerificationSpinner';
import { getVerificationStatus, submitVerification } from '../services/verification';
import { POLLING_INTERVAL, VERIFICATION_STATUS } from '../utils/constants';

const VerificationStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, licenseNumber, consents } = location.state || {};
  
  const [verificationId, setVerificationId] = useState(null);
  const [status, setStatus] = useState({
    employment: false,
    background: false,
  });
  const [estimatedTime, setEstimatedTime] = useState(30); // seconds

  useEffect(() => {
    // Redirect to home if no state is provided
    if (!email) {
      navigate('/', { replace: true });
      return;
    }

    // Submit verification request
    const startVerification = async () => {
      try {
        const result = await submitVerification({ email, licenseNumber, consents });
        setVerificationId(result.verificationId);
      } catch (error) {
        console.error('Failed to start verification:', error);
      }
    };

    startVerification();
  }, [email, licenseNumber, consents, navigate]);

  useEffect(() => {
    if (!verificationId) return;

    // Poll for verification status
    const pollInterval = setInterval(async () => {
      try {
        const result = await getVerificationStatus(verificationId);
        
        // Update status based on result
        setStatus({
          employment: result.details?.employmentVerified || false,
          background: result.details?.backgroundChecked || false,
        });

        // Decrease estimated time
        setEstimatedTime(prev => Math.max(0, prev - 2));

        // If both are complete, navigate to results
        if (result.status === VERIFICATION_STATUS.COMPLETED) {
          clearInterval(pollInterval);
          setTimeout(() => {
            navigate('/decision', {
              state: {
                email,
                licenseNumber,
                verificationId,
              },
              replace: true,
            });
          }, 1000);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, POLLING_INTERVAL);

    return () => clearInterval(pollInterval);
  }, [verificationId, navigate, email, licenseNumber]);

  const handleGoBack = () => {
    if (window.confirm('Are you sure you want to go back? Your verification will be cancelled.')) {
      navigate('/consent');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#1976d2',
        padding: '1rem 2rem',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>SwiftVerify</h1>
        <button
          onClick={handleGoBack}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'white',
            color: '#1976d2',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          ← Go Back
        </button>
      </nav>

      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 1rem',
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          textAlign: 'center',
          maxWidth: '900px',
          width: '100%',
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#333', fontSize: '2rem' }}>
            Verification In Progress
          </h2>
          
          <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '2rem' }}>
            Please wait while we verify your information through our secure partners.
            This typically takes 20-40 seconds.
          </p>

          {/* NO SSN Storage Reminder */}
          <div style={{
            backgroundColor: '#e3f2fd',
            border: '2px solid #1976d2',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '2rem',
            fontSize: '0.9rem',
            color: '#0d47a1',
          }}>
            <strong>🔒 Reminder:</strong> NO Social Security Numbers are stored on SwiftVerify servers.
            Your SSN is only transmitted directly to Equifax Work Number for verification.
          </div>

          {/* Dual Verification Spinners */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '3rem',
            margin: '3rem 0',
          }}>
            <VerificationSpinner
              label="Employment & Income Verification (Equifax Work Number)"
              completed={status.employment}
              size={80}
            />
            
            <VerificationSpinner
              label="Criminal/Background Check (Equifax Omni)"
              completed={status.background}
              size={80}
            />
          </div>

          {/* Estimated Time */}
          <div style={{
            padding: '1rem',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            marginTop: '2rem',
          }}>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
              ⏱️ Estimated time remaining: <strong>{estimatedTime} seconds</strong>
            </p>
          </div>

          {/* Email Confirmation */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#fff3e0',
            borderRadius: '4px',
            fontSize: '0.875rem',
            color: '#e65100',
          }}>
            📧 Verification email sent to: <strong>{email}</strong>
          </div>

          {/* Process Information */}
          <div style={{
            marginTop: '2rem',
            textAlign: 'left',
            padding: '1.5rem',
            backgroundColor: '#fafafa',
            borderRadius: '8px',
          }}>
            <h4 style={{ marginTop: 0, color: '#333' }}>What's Happening Now:</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.8', color: '#666' }}>
              <li><strong>Employment/Income:</strong> Verifying your employment status and monthly income through Equifax Work Number</li>
              <li><strong>Background Check:</strong> Running criminal and background verification through Equifax Omni</li>
              <li><strong>Identity:</strong> Confirming your driver's license information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationStatus;
