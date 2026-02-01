import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaSessionId, setMfaSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, verifyMFA } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await login(username, password);
      
      if (result.success) {
        if (result.mfaRequired) {
          setMfaRequired(true);
          setMfaSessionId(result.mfaSessionId);
        } else {
          navigate('/home');
        }
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleMFASubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await verifyMFA(mfaSessionId, mfaCode);
      
      if (result.success) {
        navigate('/home');
      } else {
        setError(result.error || 'Invalid MFA code');
      }
    } catch (err) {
      setError('An error occurred during MFA verification');
    } finally {
      setLoading(false);
    }
  };

  if (mfaRequired) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '1rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#333' }}>
            Two-Factor Authentication
          </h2>
          <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
            Enter the 6-digit code sent to your device
          </p>
          <div style={{
            backgroundColor: '#e3f2fd',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            color: '#1976d2'
          }}>
            <strong>Demo Mode:</strong> Use code <strong>123456</strong>
          </div>
          <form onSubmit={handleMFASubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>
                MFA Code
              </label>
              <input
                type="text"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1.2rem',
                  boxSizing: 'border-box',
                  textAlign: 'center',
                  letterSpacing: '0.5rem'
                }}
                placeholder="000000"
                maxLength="6"
                pattern="[0-9]{6}"
                required
                autoFocus
              />
            </div>
            {error && (
              <div style={{ 
                color: '#d32f2f', 
                marginBottom: '1rem',
                fontSize: '0.875rem',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: loading ? '#ccc' : '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button
              onClick={() => {
                setMfaRequired(false);
                setMfaCode('');
                setError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#1976d2',
                cursor: 'pointer',
                fontSize: '0.875rem',
                textDecoration: 'underline'
              }}
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#333' }}>
          SwiftVerify Login
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
          Secure identity verification platform
        </p>
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
              fontSize: '0.875rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: loading ? '#ccc' : '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '500'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#e8f5e9',
          borderRadius: '4px',
          fontSize: '0.875rem',
          color: '#2e7d32'
        }}>
          <strong>🔒 Secure Access:</strong> All connections are encrypted with SSL/TLS
        </div>
      </div>
    </div>
  );
};

export default Login;
