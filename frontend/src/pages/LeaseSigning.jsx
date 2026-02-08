import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ESignaturePad from '../components/ESignaturePad';
import LeaseViewer from '../components/LeaseViewer';
import { signLease } from '../services/verification';
import { DECISION_OUTCOMES } from '../utils/constants';

const LeaseSigning = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, verificationId, outcome, gapAmount, waiverAmount } = location.state || {};
  
  const [showLeaseViewer, setShowLeaseViewer] = useState(false);
  const [signature, setSignature] = useState(null);
  const [waiverAcknowledged, setWaiverAcknowledged] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveSignature = (signatureData) => {
    setSignature(signatureData);
  };

  const handleClearSignature = () => {
    setSignature(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!signature) {
      alert('Please provide your signature');
      return;
    }
    
    if (!termsAgreed) {
      alert('Please agree to the lease terms');
      return;
    }
    
    if (outcome === DECISION_OUTCOMES.APPROVED_WAIVER && !waiverAcknowledged) {
      alert('Please acknowledge the waiver terms');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await signLease({
        verificationId,
        signature,
        email,
        termsAgreed,
        waiverAcknowledged: outcome === DECISION_OUTCOMES.APPROVED_WAIVER ? waiverAcknowledged : null,
      });
      
      navigate('/thank-you', {
        state: {
          email,
          verificationId,
        }
      });
    } catch (error) {
      console.error('Failed to sign lease:', error);
      alert('Failed to submit signature. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!verificationId) {
    navigate('/', { replace: true });
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#1976d2',
        padding: '1rem 2rem',
        color: 'white',
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>SwiftVerify - Lease Signing</h1>
      </nav>

      <div style={{
        maxWidth: '900px',
        margin: '2rem auto',
        padding: '0 1rem',
      }}>
        {/* Page Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '2rem',
        }}>
          <h2 style={{ marginTop: 0, color: '#333', fontSize: '2rem' }}>
            Review &amp; Sign Your Lease Agreement
          </h2>
          <p style={{ color: '#666', lineHeight: '1.6', marginBottom: 0 }}>
            Please review your lease agreement carefully before signing. Your account will be 
            automatically created upon completion.
          </p>
        </div>

        {/* Gap Pay Notice */}
        {outcome === DECISION_OUTCOMES.APPROVED_GAP_PAY && (
          <div style={{
            backgroundColor: '#e3f2fd',
            border: '2px solid #1976d2',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}>
            <h3 style={{ marginTop: 0, color: '#1976d2' }}>
              💰 Gap Pay Coverage Included
            </h3>
            <p style={{ margin: 0, color: '#0d47a1', lineHeight: '1.6' }}>
              This lease includes SwiftVerify's Gap Pay coverage of <strong>${gapAmount?.toFixed(2)}/month</strong>.
              This amount is detailed in your lease agreement below.
            </p>
          </div>
        )}

        {/* Waiver Acknowledgment */}
        {outcome === DECISION_OUTCOMES.APPROVED_WAIVER && (
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '2rem',
          }}>
            <h3 style={{ marginTop: 0, color: '#1976d2' }}>
              📋 Waiver Acknowledgment Required
            </h3>
            <div style={{
              backgroundColor: '#fff3cd',
              border: '2px solid #ffc107',
              borderRadius: '4px',
              padding: '1.5rem',
              marginBottom: '1rem',
            }}>
              <p style={{ margin: '0 0 1rem', color: '#856404', fontWeight: '600' }}>
                Waiver Amount: ${waiverAmount?.toFixed(2)}
              </p>
              <p style={{ margin: 0, color: '#856404', lineHeight: '1.6' }}>
                By checking the box below, you acknowledge and agree to the waiver terms 
                as specified by the landlord. This waiver is required to proceed with your lease.
              </p>
            </div>
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              cursor: 'pointer',
              padding: '1rem',
              backgroundColor: waiverAcknowledged ? '#e8f5e9' : '#ffffff',
              border: waiverAcknowledged ? '2px solid #4caf50' : '2px solid #e0e0e0',
              borderRadius: '4px',
            }}>
              <input
                type="checkbox"
                checked={waiverAcknowledged}
                onChange={(e) => setWaiverAcknowledged(e.target.checked)}
                style={{
                  marginTop: '0.25rem',
                  marginRight: '0.75rem',
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                }}
              />
              <span style={{ fontSize: '1rem', lineHeight: '1.5', color: '#333' }}>
                I acknowledge and agree to the waiver terms in the amount of ${waiverAmount?.toFixed(2)} 
                as specified in my lease agreement.
              </span>
            </label>
          </div>
        )}

        {/* Lease Document */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '2rem',
        }}>
          <h3 style={{ marginTop: 0, color: '#1976d2' }}>
            📄 Lease Agreement
          </h3>
          <button
            type="button"
            onClick={() => setShowLeaseViewer(true)}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              width: '100%',
            }}
          >
            📖 View Full Lease Agreement
          </button>
          <p style={{ 
            marginTop: '1rem', 
            marginBottom: 0, 
            fontSize: '0.875rem', 
            color: '#666' 
          }}>
            Please review the complete lease agreement before signing below.
          </p>
        </div>

        {/* Lease Viewer Modal */}
        {showLeaseViewer && (
          <LeaseViewer
            leaseUrl={null} // In production, this would be the actual PDF URL
            onClose={() => setShowLeaseViewer(false)}
          />
        )}

        {/* Signature Form */}
        <form onSubmit={handleSubmit}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '2rem',
          }}>
            <h3 style={{ marginTop: 0, color: '#1976d2' }}>
              ✍️ Electronic Signature
            </h3>
            
            <ESignaturePad
              onSave={handleSaveSignature}
              onClear={handleClearSignature}
            />
            
            {signature && (
              <div style={{
                backgroundColor: '#e8f5e9',
                border: '2px solid #4caf50',
                borderRadius: '4px',
                padding: '1rem',
                marginTop: '1rem',
              }}>
                <p style={{ margin: 0, color: '#2e7d32', fontWeight: '600' }}>
                  ✓ Signature saved successfully
                </p>
              </div>
            )}

            {/* Terms Agreement */}
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                cursor: 'pointer',
              }}>
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  required
                  style={{
                    marginTop: '0.25rem',
                    marginRight: '0.75rem',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                  }}
                />
                <span style={{ fontSize: '1rem', lineHeight: '1.5', color: '#333' }}>
                  I have read and agree to all terms and conditions in this lease agreement. 
                  I understand that my electronic signature is legally binding.
                </span>
              </label>
            </div>

            {/* Account Creation Notice */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: '#e3f2fd',
              borderRadius: '4px',
              fontSize: '0.9rem',
              color: '#0d47a1',
            }}>
              <strong>📧 Account Creation:</strong> Upon signing, a tenant account will be 
              automatically created for you at {email}. You will receive a temporary password 
              via email to access your account.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!signature || !termsAgreed || isSubmitting}
              style={{
                width: '100%',
                padding: '1.25rem',
                backgroundColor: signature && termsAgreed && !isSubmitting ? '#4caf50' : '#bdbdbd',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1.1rem',
                cursor: signature && termsAgreed && !isSubmitting ? 'pointer' : 'not-allowed',
                fontWeight: '600',
                marginTop: '1.5rem',
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Sign Lease & Complete Application'}
            </button>
          </div>
        </form>

        {/* Legal Notice */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          fontSize: '0.875rem',
          color: '#666',
          textAlign: 'center',
        }}>
          <p style={{ margin: 0 }}>
            🔒 Your signature and lease agreement are encrypted and stored securely. 
            By signing, you agree to the terms of this legally binding contract.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeaseSigning;
