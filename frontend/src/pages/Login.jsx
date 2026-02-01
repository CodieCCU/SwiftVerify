import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (login(username, password)) {
      // SECURITY NOTE: This is demo-only role detection
      // In production, roles should be:
      // 1. Assigned on the backend after authentication
      // 2. Verified through secure JWT tokens
      // 3. Never based on username content
      if (username.toLowerCase().includes('landlord')) {
        navigate('/landlord-dashboard');
      } else {
        navigate('/home');
      }
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>
          SwiftVerify Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          {error && (
            <div style={{ 
              color: '#d32f2f', 
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Login
          </button>
        </form>
        
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          fontSize: '0.875rem',
          color: '#666'
        }}>
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Demo Accounts:</p>
          <p style={{ margin: '0.25rem 0' }}>• Tenant: any username without "landlord"</p>
          <p style={{ margin: '0.25rem 0' }}>• Landlord: username with "landlord" (e.g., "landlord1")</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
