import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPageEnhanced = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a2e' }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#16213e',
        padding: '1rem 2rem',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#e94560',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem'
          }}>
            ✓
          </div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>SwiftVerify</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/landlord/login')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}
          >
            Landlord Portal
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#e94560',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)',
        color: 'white',
        padding: '4rem 2rem 6rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: 'radial-gradient(circle, #e94560 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
        
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{ 
            fontSize: '3rem', 
            marginBottom: '1.5rem', 
            fontWeight: '700',
            lineHeight: '1.2'
          }}>
            Your Path to <span style={{ color: '#e94560' }}>Yes</span>
          </h2>
          <p style={{ 
            fontSize: '1.25rem', 
            marginBottom: '2.5rem', 
            color: '#a0a0a0',
            lineHeight: '1.6'
          }}>
            Fast, secure tenant verification for the Boise rental market. 
            Get approved in minutes with instant income verification through Equifax Work Number API.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/properties')}
              style={{
                padding: '1rem 2.5rem',
                fontSize: '1.1rem',
                backgroundColor: '#e94560',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                boxShadow: '0 4px 16px rgba(233, 69, 96, 0.3)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Browse Properties
            </button>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '1rem 2.5rem',
                fontSize: '1.1rem',
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Start Verification
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ padding: '4rem 2rem', backgroundColor: '#16213e' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{ 
            textAlign: 'center', 
            fontSize: '2rem', 
            marginBottom: '3rem', 
            color: 'white',
            fontWeight: '700'
          }}>
            Why Choose SwiftVerify?
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            {/* Feature 1 */}
            <div style={{
              backgroundColor: '#0f3460',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              textAlign: 'center',
              border: '1px solid rgba(233, 69, 96, 0.2)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>
                Lightning Fast
              </h4>
              <p style={{ color: '#a0a0a0', lineHeight: '1.6', fontSize: '0.875rem' }}>
                Get verified in minutes with our streamlined process. No more waiting days for approval with instant Equifax integration.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{
              backgroundColor: '#0f3460',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              textAlign: 'center',
              border: '1px solid rgba(233, 69, 96, 0.2)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>
                Bank-Level Security
              </h4>
              <p style={{ color: '#a0a0a0', lineHeight: '1.6', fontSize: '0.875rem' }}>
                Your data is encrypted and protected with industry-leading security standards. FDIC-compliant verification.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{
              backgroundColor: '#0f3460',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              textAlign: 'center',
              border: '1px solid rgba(233, 69, 96, 0.2)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>
                Trusted by Landlords
              </h4>
              <p style={{ color: '#a0a0a0', lineHeight: '1.6', fontSize: '0.875rem' }}>
                Property managers across Boise trust SwiftVerify for reliable tenant screening and income verification.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div style={{ padding: '4rem 2rem', backgroundColor: '#1a1a2e' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h3 style={{ 
            textAlign: 'center', 
            fontSize: '2rem', 
            marginBottom: '3rem', 
            color: 'white',
            fontWeight: '700'
          }}>
            How It Works
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {[
              { step: 1, title: 'Browse Properties', desc: 'Find your perfect rental home in Boise' },
              { step: 2, title: 'Submit Application', desc: 'Provide your email and driver\'s license details' },
              { step: 3, title: 'Background Check', desc: 'We run a secure background verification' },
              { step: 4, title: 'Income Verification', desc: 'Instant verification through Equifax Work Number API' },
              { step: 5, title: 'Get Approved', desc: 'Receive instant results and sign your lease electronically' }
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#e94560',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  flexShrink: 0,
                  boxShadow: '0 4px 16px rgba(233, 69, 96, 0.3)'
                }}>{step}</div>
                <div style={{ 
                  flex: 1,
                  backgroundColor: '#16213e',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(233, 69, 96, 0.2)'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem', color: 'white', fontSize: '1.1rem' }}>{title}</h4>
                  <p style={{ margin: 0, color: '#a0a0a0', fontSize: '0.875rem' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button
              onClick={() => navigate('/properties')}
              style={{
                padding: '1rem 3rem',
                fontSize: '1.1rem',
                backgroundColor: '#e94560',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                boxShadow: '0 4px 16px rgba(233, 69, 96, 0.3)'
              }}
            >
              Start Your Journey Today
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ padding: '3rem 2rem', backgroundColor: '#16213e' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#e94560', marginBottom: '0.5rem' }}>
                98%
              </div>
              <div style={{ color: '#a0a0a0', fontSize: '0.875rem' }}>
                Approval Rate
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#e94560', marginBottom: '0.5rem' }}>
                {'<'}5 min
              </div>
              <div style={{ color: '#a0a0a0', fontSize: '0.875rem' }}>
                Average Processing Time
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#e94560', marginBottom: '0.5rem' }}>
                500+
              </div>
              <div style={{ color: '#a0a0a0', fontSize: '0.875rem' }}>
                Properties Available
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#e94560', marginBottom: '0.5rem' }}>
                24/7
              </div>
              <div style={{ color: '#a0a0a0', fontSize: '0.875rem' }}>
                Support Available
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#0f3460',
        color: 'white',
        padding: '2rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(233, 69, 96, 0.2)'
      }}>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem' }}>
          © 2026 SwiftVerify - Path to Yes Fintech Platform
        </p>
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#a0a0a0' }}>
          Serving the Boise Rental Market | <a href="mailto:support@swiftverify.com" style={{ color: '#e94560', textDecoration: 'none' }}>support@swiftverify.com</a>
        </p>
      </footer>
    </div>
  );
};

export default LandingPageEnhanced;
