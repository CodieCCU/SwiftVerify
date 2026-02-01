import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

const StaffAssisted = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [staffMode, setStaffMode] = useState(false);
  const [clientName, setClientName] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEnableStaffMode = () => {
    if (consentGiven && privacyAcknowledged && clientName) {
      setStaffMode(true);
      // Navigate to document upload with staff-assisted flag
      navigate('/document-upload', { 
        state: { 
          staffAssisted: true,
          clientName 
        } 
      });
    }
  };

  const handleStartSelfService = () => {
    navigate('/home');
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <nav style={{
        backgroundColor: '#1976d2',
        padding: '1rem 2rem',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>SwiftVerify - Community Kiosk</h1>
        <div>
          <span style={{ marginRight: '1rem' }}>Staff: {user?.username}</span>
          <button
            onClick={handleLogout}
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
            End Session
          </button>
        </div>
      </nav>

      <div style={{
        maxWidth: '900px',
        margin: '2rem auto',
        padding: '0 1rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Self-Service Mode */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '2px solid #4caf50'
          }}>
            <div style={{
              fontSize: '3rem',
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              👤
            </div>
            <h3 style={{ 
              textAlign: 'center', 
              marginBottom: '1rem',
              color: '#333'
            }}>
              Self-Service Mode
            </h3>
            <p style={{ 
              color: '#666', 
              textAlign: 'center',
              marginBottom: '1.5rem',
              lineHeight: '1.6'
            }}>
              Use this mode if you want to complete the verification process 
              independently on this device.
            </p>
            <button
              onClick={handleStartSelfService}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Start Self-Service
            </button>
          </div>

          {/* Staff-Assisted Mode */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '2px solid #ff9800'
          }}>
            <div style={{
              fontSize: '3rem',
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              🤝
            </div>
            <h3 style={{ 
              textAlign: 'center', 
              marginBottom: '1rem',
              color: '#333'
            }}>
              Staff-Assisted Mode
            </h3>
            <p style={{ 
              color: '#666', 
              textAlign: 'center',
              marginBottom: '1.5rem',
              lineHeight: '1.6'
            }}>
              A staff member or counselor will help you through the 
              verification process while maintaining your privacy.
            </p>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#555',
                fontWeight: '500'
              }}>
                Client Name (Optional)
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter your name"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'flex',
                alignItems: 'flex-start',
                cursor: 'pointer',
                marginBottom: '0.75rem'
              }}>
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  style={{ 
                    marginRight: '0.5rem',
                    marginTop: '0.25rem'
                  }}
                />
                <span style={{ color: '#555', fontSize: '0.875rem' }}>
                  I consent to receive assistance from a staff member and understand 
                  they will help me input my information.
                </span>
              </label>
              
              <label style={{ 
                display: 'flex',
                alignItems: 'flex-start',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={privacyAcknowledged}
                  onChange={(e) => setPrivacyAcknowledged(e.target.checked)}
                  style={{ 
                    marginRight: '0.5rem',
                    marginTop: '0.25rem'
                  }}
                />
                <span style={{ color: '#555', fontSize: '0.875rem' }}>
                  I acknowledge that my information will remain confidential and 
                  will be cleared from this device after my session.
                </span>
              </label>
            </div>

            <button
              onClick={handleEnableStaffMode}
              disabled={!consentGiven || !privacyAcknowledged}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: (!consentGiven || !privacyAcknowledged) ? '#ccc' : '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: (!consentGiven || !privacyAcknowledged) ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
            >
              Start with Staff Assistance
            </button>
          </div>
        </div>

        {/* Information Panel */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>
            Community Outreach Information
          </h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            color: '#666',
            lineHeight: '1.6'
          }}>
            <div>
              <h4 style={{ color: '#1976d2', marginBottom: '0.5rem' }}>
                🏠 For Homeless Shelters
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                This system allows individuals with steady income to quickly verify 
                their eligibility for housing, even while staying at a shelter.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#1976d2', marginBottom: '0.5rem' }}>
                🤲 For Aid Centers
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                Community centers can provide this service to help vulnerable 
                populations access housing opportunities more easily.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#1976d2', marginBottom: '0.5rem' }}>
                🔒 Privacy Protected
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                All data is encrypted and automatically cleared from shared devices 
                after each session to ensure privacy and security.
              </p>
            </div>
          </div>
        </div>

        {/* Clear Session Button (for kiosk mode) */}
        <div style={{
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <button
            onClick={() => {
              // Clear all local data
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#d32f2f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            🗑️ Clear All Session Data
          </button>
          <div style={{
            marginTop: '0.5rem',
            fontSize: '0.75rem',
            color: '#666'
          }}>
            Use this when switching between users on a shared device
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAssisted;
