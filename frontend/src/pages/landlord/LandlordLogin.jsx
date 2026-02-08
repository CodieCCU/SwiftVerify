import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { landlordLogin } from '../../services/landlord';

const LandlordLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await landlordLogin({ email, password });
      
      if (result.success) {
        // Store token (in production, use proper auth state management)
        localStorage.setItem('landlordToken', result.token);
        localStorage.setItem('landlordData', JSON.stringify(result.landlord));
        
        // Navigate to dashboard
        navigate('/landlord/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#1976d2',
        padding: '1rem 2rem',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>SwiftVerify Landlord Portal</h1>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'white',
            color: '#1976d2',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          ← Back to Home
        </button>
      </nav>

      {/* NO CREDIT CHECK Banner */}
      <div style={{
        backgroundColor: '#ffc107',
        color: '#000',
        padding: '1rem 2rem',
        textAlign: 'center',
        fontWeight: '700',
        fontSize: '1.1rem',
      }}>
        🚫💳 NO CREDIT CHECK SYSTEM - Landlord Portal
      </div>

      <div style={{
        maxWidth: '500px',
        margin: '3rem auto',
        padding: '0 1rem',
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          <h2 style={{ marginTop: 0, color: '#333', fontSize: '2rem', textAlign: 'center' }}>
            Landlord Login
          </h2>
          <p style={{ color: '#666', textAlign: 'center', marginBottom: '2rem' }}>
            Access your landlord dashboard
          </p>

          {error && (
            <div style={{
              backgroundColor: '#ffebee',
              border: '2px solid #f44336',
              borderRadius: '4px',
              padding: '1rem',
              marginBottom: '1.5rem',
              color: '#c62828',
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#555',
                fontWeight: '500',
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="landlord@example.com"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#555',
                fontWeight: '500',
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: isLoading ? '#bdbdbd' : '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1.1rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
              }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* MFA Notice */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#e3f2fd',
            borderRadius: '4px',
            fontSize: '0.875rem',
            color: '#0d47a1',
            textAlign: 'center',
          }}>
            🔐 Multi-Factor Authentication (MFA) ready - Coming soon
          </div>

          {/* Demo Credentials */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#fff3e0',
            borderRadius: '4px',
            fontSize: '0.875rem',
            color: '#e65100',
          }}>
            <strong>Demo Mode:</strong> Any email/password combination will work for demonstration purposes.
          </div>

          {/* Links */}
          <div style={{
            marginTop: '2rem',
            textAlign: 'center',
            fontSize: '0.875rem',
          }}>
            <a href="/landlord/agreement" style={{ color: '#1976d2', marginRight: '1rem' }}>
              New Landlord? Sign Agreement
            </a>
            <a href="mailto:support@swiftverify.com" style={{ color: '#1976d2' }}>
              Forgot Password?
            </a>
          </div>
        </div>

        {/* NO CREDIT CHECK Reminder */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <h4 style={{ margin: '0 0 0.5rem', color: '#333' }}>
            Important Reminder
          </h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#666', lineHeight: '1.6' }}>
            SwiftVerify is a <strong>NO CREDIT CHECK</strong> tenant screening system. 
            By using this platform, you agree not to conduct credit checks on tenants.
            All approvals are based on identity, employment, and income verification only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandlordLogin;
