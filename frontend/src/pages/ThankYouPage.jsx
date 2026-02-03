import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth';

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { email, signedDate } = location.state || {};

  useEffect(() => {
    // Redirect if accessed without proper state
    if (!email) {
      navigate('/home', { replace: true });
    }
  }, [email, navigate]);

  const handleReturnHome = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        textAlign: 'center',
        maxWidth: '700px',
        width: '100%'
      }}>
        {/* Success Icon */}
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: '#4caf50',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto 2rem',
          fontSize: '5rem',
          color: 'white',
          boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)'
        }}>
          🎉
        </div>

        {/* Title */}
        <h1 style={{ 
          marginBottom: '1rem', 
          color: 'white',
          fontSize: '2.5rem',
          fontWeight: '700'
        }}>
          Congratulations!
        </h1>

        {/* Message */}
        <p style={{ 
          color: '#a0a0a0', 
          lineHeight: '1.6', 
          marginBottom: '2.5rem',
          fontSize: '1.1rem'
        }}>
          Your lease has been successfully signed and submitted. Welcome to your new home!
        </p>

        {/* Summary Card */}
        <div style={{
          backgroundColor: '#0f3460',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <h3 style={{
            margin: '0 0 1.5rem 0',
            color: 'white',
            fontSize: '1.25rem',
            fontWeight: '600',
            textAlign: 'center'
          }}>
            Application Summary
          </h3>
          
          <div style={{ fontSize: '0.875rem', color: '#a0a0a0' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div>
                <div style={{ color: '#666', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                  Email
                </div>
                <div style={{ color: 'white', fontWeight: '500' }}>
                  {email}
                </div>
              </div>
              <div>
                <div style={{ color: '#666', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                  Signed Date
                </div>
                <div style={{ color: 'white', fontWeight: '500' }}>
                  {signedDate ? new Date(signedDate).toLocaleDateString() : new Date().toLocaleDateString()}
                </div>
              </div>
            </div>

            <div style={{
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ color: '#4caf50', marginRight: '0.5rem' }}>✓</span>
                <span style={{ color: 'white' }}>Identity Verified</span>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ color: '#4caf50', marginRight: '0.5rem' }}>✓</span>
                <span style={{ color: 'white' }}>Background Check Passed</span>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ color: '#4caf50', marginRight: '0.5rem' }}>✓</span>
                <span style={{ color: 'white' }}>Income Verified (Equifax)</span>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ color: '#4caf50', marginRight: '0.5rem' }}>✓</span>
                <span style={{ color: 'white' }}>Lease Agreement Signed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div style={{
          backgroundColor: 'rgba(233, 69, 96, 0.1)',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          textAlign: 'left',
          border: '1px solid rgba(233, 69, 96, 0.2)'
        }}>
          <h4 style={{
            margin: '0 0 1rem 0',
            color: '#e94560',
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            What's Next?
          </h4>
          <ul style={{
            margin: 0,
            padding: '0 0 0 1.5rem',
            color: '#a0a0a0',
            fontSize: '0.875rem',
            lineHeight: '1.8'
          }}>
            <li>You'll receive a confirmation email with your lease agreement within 24 hours</li>
            <li>Your landlord will contact you with move-in details and key pickup information</li>
            <li>Payment instructions for your first month's rent and security deposit will be sent shortly</li>
            <li>Keep an eye out for welcome materials and community information</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <button
            onClick={handleReturnHome}
            style={{
              padding: '1.25rem',
              backgroundColor: '#e94560',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 4px 16px rgba(233, 69, 96, 0.3)'
            }}
          >
            Return to Home
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '1rem',
              backgroundColor: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Logout
          </button>
        </div>

        {/* Support */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          fontSize: '0.75rem',
          color: '#666',
          lineHeight: '1.6'
        }}>
          Questions or concerns? Contact us at{' '}
          <a href="mailto:support@swiftverify.com" style={{ color: '#e94560', textDecoration: 'none', fontWeight: '600' }}>
            support@swiftverify.com
          </a>
          {' '}or call (208) 555-0100
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
