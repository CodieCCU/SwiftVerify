import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const VerificationProcessing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, licenseNumber, inputMethod } = location.state || {};
  
  const [currentStage, setCurrentStage] = useState(1);
  const [stageMessage, setStageMessage] = useState('Creating application...');
  const [applicationId, setApplicationId] = useState(null);

  const stages = [
    { stage: 1, name: 'Identity Verification', message: 'Verifying your driver\'s license...' },
    { stage: 2, name: 'Employment Verification', message: 'Verifying employment via Equifax Work Number...' },
    { stage: 3, name: 'Background Check', message: 'Running criminal and credit background checks...' },
    { stage: 4, name: 'Landlord Review', message: 'Awaiting landlord review...' },
    { stage: 5, name: 'Final Decision', message: 'Finalizing your application...' }
  ];

  useEffect(() => {
    // Redirect to home if no state is provided
    if (!email) {
      navigate('/home', { replace: true });
      return;
    }

    // Start the verification process
    processVerification();
  }, [navigate, email, licenseNumber]);

  const processVerification = async () => {
    try {
      // Stage 1: Create application
      setCurrentStage(1);
      setStageMessage('Creating application...');
      
      const appResponse = await axios.post(`${API_BASE_URL}/applications`, {
        email: email,
        drivers_license: licenseNumber
      });
      
      const appId = appResponse.data.id;
      setApplicationId(appId);
      
      // Wait for identity verification (simulated by backend)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Stage 2: Employment verification
      setCurrentStage(2);
      setStageMessage(stages[1].message);
      
      await axios.post(`${API_BASE_URL}/verification/equifax`, {
        application_id: appId
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Stage 3: Background check
      setCurrentStage(3);
      setStageMessage(stages[2].message);
      
      const bgCheckResponse = await axios.post(`${API_BASE_URL}/verification/background-check`, {
        application_id: appId
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check the application status
      const appStatusResponse = await axios.get(`${API_BASE_URL}/applications/${appId}`);
      const application = appStatusResponse.data;
      
      // Navigate to result based on application status
      navigate('/verification-result', {
        state: {
          applicationId: appId,
          application: application,
          email: email,
          licenseNumber: licenseNumber
        },
        replace: true
      });
      
    } catch (error) {
      console.error('Verification error:', error);
      
      // If API is not available, fallback to mock behavior
      setTimeout(() => {
        const isApproved = Math.random() > 0.3;
        navigate('/verification-result', {
          state: {
            approved: isApproved,
            email,
            licenseNumber,
            mock: true
          },
          replace: true
        });
      }, 3000);
    }
  };

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
        maxWidth: '600px',
        width: '100%'
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
          Multi-Stage Verification In Progress
        </h2>
        
        <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '2rem' }}>
          {stageMessage}
        </p>
        
        {/* Progress stages */}
        <div style={{ marginBottom: '2rem' }}>
          {stages.map((stage, index) => (
            <div key={stage.stage} style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1rem',
              padding: '0.75rem',
              backgroundColor: currentStage >= stage.stage ? '#e3f2fd' : '#f5f5f5',
              borderRadius: '4px',
              borderLeft: currentStage === stage.stage ? '4px solid #1976d2' : '4px solid transparent'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: currentStage > stage.stage ? '#4caf50' : 
                                 currentStage === stage.stage ? '#1976d2' : '#ddd',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                marginRight: '1rem',
                flexShrink: 0
              }}>
                {currentStage > stage.stage ? '✓' : stage.stage}
              </div>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ 
                  fontWeight: currentStage === stage.stage ? 'bold' : 'normal',
                  color: currentStage >= stage.stage ? '#333' : '#999'
                }}>
                  {stage.name}
                </div>
                {currentStage === stage.stage && (
                  <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                    Processing...
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
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
          {applicationId && (
            <p style={{ margin: '0.5rem 0 0 0' }}>
              <strong>Application ID:</strong> {applicationId}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationProcessing;
