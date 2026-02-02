import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';

const AdminLogin = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/sv-admin-portal/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (login(username, password)) {
      navigate('/sv-admin-portal/dashboard');
    } else {
      setError('Invalid credentials. Access denied.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a2e',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: '#16213e',
        padding: '3rem',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#e94560',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.5rem'
          }}>
            🔐
          </div>
          <h1 style={{ color: 'white', margin: '0 0 0.5rem', fontSize: '1.5rem' }}>
            Admin Portal
          </h1>
          <p style={{ color: '#a0a0a0', margin: 0, fontSize: '0.875rem' }}>
            SwiftVerify Administrative Access
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(233, 69, 96, 0.2)',
            border: '1px solid #e94560',
            color: '#e94560',
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
              fontSize: '0.875rem'
            }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              placeholder="Enter admin username"
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              color: '#a0a0a0',
              marginBottom: '0.5rem',
              fontSize: '0.875rem'
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
              placeholder="Enter admin password"
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
              cursor: 'pointer'
            }}>
            Access Admin Portal
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          textAlign: 'center',
          color: '#666',
          fontSize: '0.75rem'
        }}>
          <p style={{ margin: 0 }}>🔒 Secure Administrative Access Only</p>
          <p style={{ margin: '0.5rem 0 0' }}>Unauthorized access attempts are logged.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;