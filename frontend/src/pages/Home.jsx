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
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>SwiftVerify - Home</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px' }}>Logout</button>
      </div>
      <p>Welcome, {user?.username}!</p>
      <div style={{ marginTop: '30px' }}>
        <h2>Start Tenant Verification</h2>
        <button 
          onClick={handleStartVerification}
          style={{ 
            padding: '15px 30px', 
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Begin Driver's License Verification
        </button>
      </div>
    </div>
  );
};

export default Home;
