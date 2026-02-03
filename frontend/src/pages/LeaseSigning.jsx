import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LeaseDocumentViewer from '../components/LeaseDocumentViewer';
import ESignaturePad from '../components/ESignaturePad';

const LeaseSigning = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  const [hasReadLease, setHasReadLease] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);

  React.useEffect(() => {
    // Redirect if accessed without proper state
    if (!email) {
      navigate('/home', { replace: true });
    }
  }, [email, navigate]);

  const handleSaveSignature = (signatureData) => {
    // In production, this would save to backend
    console.log('Signature saved:', signatureData);
    
    // Navigate to thank you page
    navigate('/thank-you', {
      state: {
        email,
        signedDate: new Date().toISOString()
      }
    });
  };

  const handleAcknowledge = () => {
    setHasReadLease(true);
    // Scroll to bottom
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleProceedToSign = () => {
    if (agreedToTerms) {
      setShowSignaturePad(true);
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a2e', padding: '2rem' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#16213e',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        textAlign: 'center',
        maxWidth: '900px',
        margin: '0 auto 2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          backgroundColor: '#e94560',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          fontSize: '2rem'
        }}>
          📝
        </div>
        <h1 style={{
          margin: '0 0 0.5rem 0',
          fontSize: '2rem',
          color: 'white',
          fontWeight: '700'
        }}>
          Lease Agreement
        </h1>
        <p style={{
          margin: 0,
          color: '#a0a0a0',
          fontSize: '0.875rem'
        }}>
          Please review and sign your lease agreement to complete your application
        </p>
      </div>

      {/* Lease Document */}
      <div style={{ maxWidth: '900px', margin: '0 auto 2rem' }}>
        <LeaseDocumentViewer 
          propertyAddress="123 Main Street, Boise, ID 83702"
          rent={1500}
          leaseTerms={{
            duration: '12 months',
            startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            petsAllowed: true
          }}
        />
      </div>

      {/* Acknowledgment Section */}
      {!hasReadLease && (
        <div style={{
          maxWidth: '900px',
          margin: '0 auto 2rem',
          backgroundColor: '#16213e',
          padding: '2rem',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          <button
            onClick={handleAcknowledge}
            style={{
              padding: '1rem 2.5rem',
              backgroundColor: '#e94560',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(233, 69, 96, 0.3)'
            }}
          >
            I Have Read the Lease Agreement
          </button>
        </div>
      )}

      {/* Terms Agreement */}
      {hasReadLease && !showSignaturePad && (
        <div style={{
          maxWidth: '900px',
          margin: '0 auto 2rem',
          backgroundColor: '#16213e',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          <h3 style={{
            margin: '0 0 1.5rem 0',
            fontSize: '1.5rem',
            color: 'white',
            fontWeight: '600'
          }}>
            Lease Agreement Confirmation
          </h3>

          <div style={{
            backgroundColor: '#0f3460',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              cursor: 'pointer',
              color: 'white',
              fontSize: '0.875rem',
              lineHeight: '1.6'
            }}>
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                  marginTop: '0.25rem',
                  flexShrink: 0
                }}
              />
              <span>
                I have read and understand the lease agreement in its entirety. I agree to all terms and conditions outlined in this document, including rent payment obligations, security deposit requirements, property maintenance responsibilities, and lease duration. I acknowledge that this electronic signature is legally binding and has the same effect as a handwritten signature.
              </span>
            </label>
          </div>

          <button
            onClick={handleProceedToSign}
            disabled={!agreedToTerms}
            style={{
              width: '100%',
              padding: '1.25rem',
              backgroundColor: agreedToTerms ? '#4caf50' : '#666',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: agreedToTerms ? 'pointer' : 'not-allowed',
              opacity: agreedToTerms ? 1 : 0.5,
              boxShadow: agreedToTerms ? '0 4px 16px rgba(76, 175, 80, 0.3)' : 'none'
            }}
          >
            Proceed to Signature
          </button>
        </div>
      )}

      {/* E-Signature Section */}
      {showSignaturePad && (
        <div style={{
          maxWidth: '900px',
          margin: '0 auto 2rem'
        }}>
          <ESignaturePad 
            onSave={handleSaveSignature}
            applicantName={email.split('@')[0]}
          />
        </div>
      )}

      {/* Footer */}
      <footer style={{
        maxWidth: '900px',
        margin: '2rem auto 0',
        textAlign: 'center',
        color: '#a0a0a0',
        fontSize: '0.75rem',
        padding: '1rem'
      }}>
        <p style={{ margin: 0 }}>
          © 2026 SwiftVerify - Secure Electronic Lease Signing Platform
        </p>
      </footer>
    </div>
  );
};

export default LeaseSigning;
