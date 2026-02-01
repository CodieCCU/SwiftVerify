import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStartVerification = () => {
    navigate('/drivers-license');
  };

  const handleDocumentUpload = () => {
    navigate('/document-upload');
  };

  const handleStaffAssistedMode = () => {
    navigate('/staff-assisted');
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
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>SwiftVerify</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ marginRight: '0.5rem' }}>Welcome, {user?.username}</span>
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
            Logout
          </button>
        </div>
      </nav>
      
      <div style={{
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '0 1rem'
      }}>
        {/* Main Welcome Card */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#333' }}>
            Identity Verification for Housing
          </h2>
          <p style={{ color: '#666', marginBottom: '2rem', lineHeight: '1.6' }}>
            Welcome to SwiftVerify! Our secure platform helps you verify your identity 
            and eligibility for housing quickly and efficiently, whether you're at home, 
            at a community center, or in a shelter.
          </p>
          <button
            onClick={handleStartVerification}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Start Identity Verification
          </button>
        </div>

        {/* Additional Options Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Document Upload Option */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📄</div>
            <h3 style={{ marginBottom: '0.75rem', color: '#333', fontSize: '1.2rem' }}>
              Upload Income Documents
            </h3>
            <p style={{ 
              color: '#666', 
              marginBottom: '1.5rem', 
              lineHeight: '1.6',
              flex: 1,
              fontSize: '0.95rem'
            }}>
              Upload pay stubs, bank statements, or other income proof to qualify 
              for low or no security deposit programs.
            </p>
            <button
              onClick={handleDocumentUpload}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Upload Documents
            </button>
          </div>

          {/* Staff Assisted Option */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤝</div>
            <h3 style={{ marginBottom: '0.75rem', color: '#333', fontSize: '1.2rem' }}>
              Community Kiosk Mode
            </h3>
            <p style={{ 
              color: '#666', 
              marginBottom: '1.5rem', 
              lineHeight: '1.6',
              flex: 1,
              fontSize: '0.95rem'
            }}>
              Using this from a shelter or community center? Get assistance from 
              staff while maintaining your privacy.
            </p>
            <button
              onClick={handleStaffAssistedMode}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Staff-Assisted Mode
            </button>
          </div>

          {/* Cross-Platform Info */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💻📱</div>
            <h3 style={{ marginBottom: '0.75rem', color: '#333', fontSize: '1.2rem' }}>
              Access Anywhere
            </h3>
            <p style={{ 
              color: '#666', 
              lineHeight: '1.6',
              fontSize: '0.95rem'
            }}>
              SwiftVerify works on all devices:
            </p>
            <ul style={{ 
              color: '#666', 
              lineHeight: '1.8',
              paddingLeft: '1.5rem',
              marginBottom: '0',
              fontSize: '0.9rem'
            }}>
              <li>Desktop computers (Windows, Mac, Linux)</li>
              <li>Tablets (iOS, Android)</li>
              <li>Mobile phones</li>
              <li>Community kiosks</li>
            </ul>
          </div>
        </div>

        {/* Security Notice */}
        <div style={{
          backgroundColor: '#e8f5e9',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            marginBottom: '1rem', 
            color: '#2e7d32',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.5rem' }}>🔒</span>
            Your Security & Privacy
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            color: '#1b5e20',
            fontSize: '0.9rem',
            lineHeight: '1.6'
          }}>
            <div>
              <strong>✓ End-to-End Encryption:</strong> All data is encrypted during 
              transmission and storage using SSL/TLS.
            </div>
            <div>
              <strong>✓ Multi-Factor Authentication:</strong> Additional security layer 
              to protect your account.
            </div>
            <div>
              <strong>✓ Compliance:</strong> Fully compliant with housing and data 
              privacy regulations.
            </div>
            <div>
              <strong>✓ Audit Logging:</strong> All actions are logged for security 
              and accountability.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
