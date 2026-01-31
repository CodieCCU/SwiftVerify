import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { Card, Button, Input } from '../components/UIComponents';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = isRegistering 
      ? await register({ ...credentials, name: credentials.email.split('@')[0] })
      : await login(credentials);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="page-container">
      <div className="container" style={{ maxWidth: '500px' }}>
        <Card title={isRegistering ? 'Create Account' : 'Welcome to SwiftVerify'}>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            {isRegistering 
              ? 'Create your tenant account to get started with the verification process.'
              : 'Sign in to continue with your rental application verification.'}
          </p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              name="email"
              type="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            
            <Button type="submit" variant="primary" style={{ width: '100%', marginBottom: '1rem' }}>
              {isRegistering ? 'Create Account' : 'Sign In'}
            </Button>

            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                }}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--primary-color)', 
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {isRegistering 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Create one"}
              </button>
            </div>
          </form>
        </Card>

        <div style={{ marginTop: '2rem', padding: '1rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <p>🔒 Your data is encrypted and secure</p>
          <p>FCRA Compliant Platform</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
