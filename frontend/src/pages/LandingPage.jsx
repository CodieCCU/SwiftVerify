import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#1976d2',
        padding: '1rem 2rem',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>SwiftVerify</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem' }}>Path to Yes</span>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        backgroundColor: '#1976d2',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '700' }}>
          Fast, Secure Identity Verification
        </h2>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          SwiftVerify provides real-time income-to-expense verification for the Boise rental market. 
          Get verified in minutes, not days.
        </p>
        <button
          onClick={() => navigate('/verify')}
          style={{
            padding: '1rem 3rem',
            fontSize: '1.2rem',
            backgroundColor: 'white',
            color: '#1976d2',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          Start Verification
        </button>
      </div>

      {/* Features Section */}
      <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h3 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem', color: '#333' }}>
          Why Choose SwiftVerify?
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* Feature 1 */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#333' }}>Lightning Fast</h4>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Get verified in minutes with our streamlined process. No more waiting days for approval.
            </p>
          </div>

          {/* Feature 2 */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#333' }}>Bank-Level Security</h4>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Your data is encrypted and protected with industry-leading security standards.
            </p>
          </div>

          {/* Feature 3 */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#333' }}>Trusted by Landlords</h4>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Property managers across Boise trust SwiftVerify for reliable tenant screening.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div style={{ backgroundColor: 'white', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem', color: '#333' }}>
            How It Works
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#1976d2',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '700',
                flexShrink: 0
              }}>1</div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem', color: '#333' }}>Enter Your Information</h4>
                <p style={{ margin: 0, color: '#666' }}>Provide your email and driver's license details.</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#1976d2',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '700',
                flexShrink: 0
              }}>2</div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem', color: '#333' }}>We Verify Your Identity</h4>
                <p style={{ margin: 0, color: '#666' }}>Our system securely verifies your information in real-time.</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#1976d2',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '700',
                flexShrink: 0
              }}>3</div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem', color: '#333' }}>Get Your Results</h4>
                <p style={{ margin: 0, color: '#666' }}>Receive instant verification results and proceed with your rental application.</p>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button
              onClick={() => navigate('/verify')}
              style={{
                padding: '1rem 3rem',
                fontSize: '1.1rem',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Start Your Verification Now
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#333',
        color: 'white',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <p style={{ margin: '0 0 0.5rem' }}>© 2026 SwiftVerify - Path to Yes Fintech Platform</p>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#aaa' }}>
          Serving the Boise Rental Market | <a href="mailto:support@swiftverify.com" style={{ color: '#aaa' }}>support@swiftverify.com</a>
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;