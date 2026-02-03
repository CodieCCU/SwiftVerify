import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandlordLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Simple demo authentication - in production, this would call an API
    if (email && password) {
      // Store landlord session
      sessionStorage.setItem('landlordAuth', 'true');
      sessionStorage.setItem('landlordEmail', email);
      navigate('/landlord/dashboard');
    } else {
      setError('Please enter both email and password');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a2e',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: '#16213e',
        padding: '3rem',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '450px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '70px',
            height: '70px',
            backgroundColor: '#e94560',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '2rem',
            boxShadow: '0 4px 16px rgba(233, 69, 96, 0.3)'
          }}>
            🏢
          </div>
          <h1 style={{ color: 'white', margin: '0 0 0.5rem', fontSize: '1.75rem', fontWeight: '700' }}>
            Landlord Portal
          </h1>
          <p style={{ color: '#a0a0a0', margin: 0, fontSize: '0.875rem' }}>
            SwiftVerify Property Management
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            border: '1px solid #f44336',
            color: '#f44336',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: '#a0a0a0',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.875rem',
                backgroundColor: '#0f3460',
                border: '1px solid #1a1a2e',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              required
              placeholder="landlord@example.com"
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              color: '#a0a0a0',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.875rem',
                backgroundColor: '#0f3460',
                border: '1px solid #1a1a2e',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#e94560',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(233, 69, 96, 0.3)'
            }}>
            Access Dashboard
          </button>
        </form>

        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: 'transparent',
              color: '#a0a0a0',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              textDecoration: 'underline'
            }}
          >
            ← Back to Home
          </button>
        </div>

        <div style={{
          marginTop: '2rem',
          textAlign: 'center',
          color: '#666',
          fontSize: '0.75rem',
          lineHeight: '1.6'
        }}>
          <p style={{ margin: 0 }}>🔒 Secure Landlord Access Only</p>
          <p style={{ margin: '0.5rem 0 0' }}>Demo: Use any email and password to login</p>
        </div>
      </div>
    </div>
  );
};

export default LandlordLogin;
