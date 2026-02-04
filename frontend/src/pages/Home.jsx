import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect landlords to their dashboard
    if (user?.role === 'landlord') {
      navigate('/landlord/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStartVerification = () => {
    navigate('/drivers-license');
  };

  // Don't show this page to landlords (they get redirected)
  if (user?.role === 'landlord') {
    return null;
  }

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
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>SwiftVerify</h1>
        <div>
          <span style={{ marginRight: '1rem' }}>Welcome, {user?.username}</span>
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
        maxWidth: '800px',
        margin: '2rem auto',
        padding: '0 1rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#333' }}>
            Multi-Stage Identity Verification
          </h2>
          <p style={{ color: '#666', marginBottom: '2rem', lineHeight: '1.6' }}>
            Welcome to SwiftVerify! We use a comprehensive 5-stage verification process to ensure 
            secure and thorough tenant screening. This includes identity verification, employment 
            verification, and background checks.
          </p>
          
          <div style={{ 
            backgroundColor: '#e3f2fd', 
            padding: '1.5rem', 
            borderRadius: '8px', 
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#1976d2' }}>Verification Stages:</h3>
            <ol style={{ margin: 0, paddingLeft: '1.5rem', color: '#555' }}>
              <li style={{ marginBottom: '0.5rem' }}>Identity Verification (Driver's License)</li>
              <li style={{ marginBottom: '0.5rem' }}>Employment & Income Verification</li>
              <li style={{ marginBottom: '0.5rem' }}>Background & Credit Checks</li>
              <li style={{ marginBottom: '0.5rem' }}>Landlord Review</li>
              <li style={{ marginBottom: '0.5rem' }}>Final Decision</li>
            </ol>
          </div>
          
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
            Start Verification
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
