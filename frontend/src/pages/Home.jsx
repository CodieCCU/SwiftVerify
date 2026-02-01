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
            Identity Verification
          </h2>
          <p style={{ color: '#666', marginBottom: '2rem', lineHeight: '1.6' }}>
            Welcome to SwiftVerify! We need to verify your identity to proceed. 
            This process is quick and secure.
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
            Start Verification
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
