import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { EXTERNAL_LINKS } from '../utils/constants';

const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, verificationId } = location.state || {};

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#1976d2',
        padding: '1rem 2rem',
        color: 'white',
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>SwiftVerify</h1>
      </nav>

      <div style={{
        maxWidth: '800px',
        margin: '2rem auto',
        padding: '0 1rem',
      }}>
        {/* Success Message */}
        <div style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          textAlign: 'center',
          marginBottom: '2rem',
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: '#e8f5e9',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto 2rem',
            fontSize: '5rem',
            color: '#4caf50',
          }}>
            🎉
          </div>

          <h2 style={{ 
            marginBottom: '1rem', 
            color: '#4caf50',
            fontSize: '2.5rem',
          }}>
            Congratulations!
          </h2>

          <h3 style={{
            color: '#333',
            fontSize: '1.5rem',
            marginBottom: '1rem',
          }}>
            Your Lease Has Been Signed Successfully
          </h3>

          <p style={{ 
            color: '#666', 
            lineHeight: '1.8', 
            marginBottom: 0,
            fontSize: '1.1rem',
          }}>
            Thank you for completing your rental application with SwiftVerify.
            Your lease has been signed and submitted successfully.
          </p>
        </div>

        {/* Account Created */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '2rem',
        }}>
          <h3 style={{ marginTop: 0, color: '#1976d2', fontSize: '1.5rem' }}>
            ✅ Account Created
          </h3>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            A tenant account has been automatically created for you at:
          </p>
          <div style={{
            backgroundColor: '#e3f2fd',
            padding: '1rem',
            borderRadius: '4px',
            marginTop: '1rem',
            marginBottom: '1rem',
          }}>
            <p style={{ margin: 0, fontSize: '1.1rem', color: '#0d47a1', fontWeight: '600' }}>
              📧 {email || 'your email address'}
            </p>
          </div>
          <p style={{ color: '#666', lineHeight: '1.6', marginBottom: 0 }}>
            You will receive an email shortly with your temporary password and instructions 
            for accessing your account.
          </p>
        </div>

        {/* What's Next */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '2rem',
        }}>
          <h3 style={{ marginTop: 0, color: '#1976d2', fontSize: '1.5rem' }}>
            📋 What's Next?
          </h3>
          <div style={{ color: '#666', lineHeight: '1.8' }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '1.5rem',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#1976d2',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: '700',
                flexShrink: 0,
                marginRight: '1rem',
              }}>1</div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem', color: '#333' }}>Check Your Email</h4>
                <p style={{ margin: 0 }}>
                  You'll receive your account credentials and next steps via email within the next few minutes.
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '1.5rem',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#1976d2',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: '700',
                flexShrink: 0,
                marginRight: '1rem',
              }}>2</div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem', color: '#333' }}>Wait for Landlord Confirmation</h4>
                <p style={{ margin: 0 }}>
                  Your landlord will review your signed lease and contact you with move-in details.
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#1976d2',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: '700',
                flexShrink: 0,
                marginRight: '1rem',
              }}>3</div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem', color: '#333' }}>Complete Move-In Process</h4>
                <p style={{ margin: 0 }}>
                  Follow the landlord's instructions for deposits, key pickup, and move-in scheduling.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Application Reference */}
        <div style={{
          backgroundColor: '#fff3e0',
          border: '2px solid #ff9800',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}>
          <h4 style={{ margin: '0 0 0.5rem', color: '#e65100' }}>
            📌 Application Reference Number
          </h4>
          <p style={{ margin: '0.5rem 0', fontSize: '1.25rem', color: '#e65100', fontWeight: '700' }}>
            {verificationId || 'N/A'}
          </p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: '#e65100' }}>
            Save this number for your records. You may need it for future reference.
          </p>
        </div>

        {/* Support Information */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '2rem',
        }}>
          <h3 style={{ marginTop: 0, color: '#1976d2', fontSize: '1.5rem' }}>
            💬 Need Help?
          </h3>
          <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1rem' }}>
            If you have any questions or need assistance, our support team is here to help:
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            <div style={{
              padding: '1rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
            }}>
              <p style={{ margin: '0 0 0.5rem', fontWeight: '600', color: '#333' }}>
                📧 Email Support
              </p>
              <a href={`mailto:${EXTERNAL_LINKS.SUPPORT_EMAIL}`} style={{ color: '#1976d2', fontSize: '0.9rem' }}>
                {EXTERNAL_LINKS.SUPPORT_EMAIL}
              </a>
            </div>
            <div style={{
              padding: '1rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
            }}>
              <p style={{ margin: '0 0 0.5rem', fontWeight: '600', color: '#333' }}>
                🌐 Visit Our Website
              </p>
              <a 
                href={EXTERNAL_LINKS.COMPANY_WEBSITE} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: '#1976d2', fontSize: '0.9rem' }}
              >
                swift-verify.org
              </a>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '1rem 3rem',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Return to Home
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#333',
        color: 'white',
        padding: '2rem',
        textAlign: 'center',
        marginTop: '3rem',
      }}>
        <p style={{ margin: '0 0 0.5rem' }}>© 2026 SwiftVerify - Path to Yes Fintech Platform</p>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#aaa' }}>
          Thank you for choosing SwiftVerify for your rental verification needs
        </p>
      </footer>
    </div>
  );
};

export default ThankYou;
