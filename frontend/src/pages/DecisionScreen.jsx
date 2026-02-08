import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LegalDisclaimer from '../components/LegalDisclaimer';
import { getVerificationResult } from '../services/verification';
import { sendDenialEmail, sendApprovalEmail, sendWaiverEmail, sendGapPayEmail } from '../services/email';
import { DECISION_OUTCOMES, LEGAL_DISCLAIMERS, EXTERNAL_LINKS } from '../utils/constants';

const DecisionScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, licenseNumber, verificationId } = location.state || {};
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to home if no state is provided
    if (!verificationId) {
      navigate('/', { replace: true });
      return;
    }

    // Fetch verification result
    const fetchResult = async () => {
      try {
        const verificationResult = await getVerificationResult(verificationId);
        setResult(verificationResult);
        
        // Send appropriate email based on outcome
        switch (verificationResult.outcome) {
          case DECISION_OUTCOMES.DENIED:
            await sendDenialEmail({
              email,
              reason: verificationResult.denialReason,
              applicationId: verificationId,
            });
            break;
          case DECISION_OUTCOMES.APPROVED:
            await sendApprovalEmail({ email, applicationId: verificationId });
            break;
          case DECISION_OUTCOMES.APPROVED_WAIVER:
            await sendWaiverEmail({
              email,
              waiverAmount: verificationResult.waiverAmount,
              applicationId: verificationId,
            });
            break;
          case DECISION_OUTCOMES.APPROVED_GAP_PAY:
            await sendGapPayEmail({
              email,
              gapAmount: verificationResult.gapAmount,
              applicationId: verificationId,
            });
            break;
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch result:', error);
        setLoading(false);
      }
    };

    fetchResult();
  }, [verificationId, email, navigate]);

  const handleContinue = () => {
    if (result?.outcome === DECISION_OUTCOMES.DENIED) {
      navigate('/');
    } else {
      navigate('/lease-signing', {
        state: {
          email,
          verificationId,
          outcome: result?.outcome,
          gapAmount: result?.gapAmount,
          waiverAmount: result?.waiverAmount,
        }
      });
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #e3f2fd',
            borderTop: '4px solid #1976d2',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem',
          }}></div>
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '2rem' }}>
        <p>Error loading results. Please contact support.</p>
      </div>
    );
  }

  const getOutcomeStyles = () => {
    switch (result.outcome) {
      case DECISION_OUTCOMES.DENIED:
        return {
          color: '#f44336',
          backgroundColor: '#ffebee',
          icon: '✗',
        };
      default:
        return {
          color: '#4caf50',
          backgroundColor: '#e8f5e9',
          icon: '✓',
        };
    }
  };

  const styles = getOutcomeStyles();

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
    }}>
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
        {/* Status Icon & Title */}
        <div style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          textAlign: 'center',
          marginBottom: '2rem',
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: styles.backgroundColor,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '4rem',
            color: styles.color,
          }}>
            {styles.icon}
          </div>

          <h2 style={{ 
            marginBottom: '1rem', 
            color: styles.color,
            fontSize: '2.5rem',
          }}>
            {result.outcome === DECISION_OUTCOMES.DENIED ? 'Application Denied' : 'Congratulations! Approved'}
          </h2>

          <p style={{ 
            color: '#666', 
            lineHeight: '1.6', 
            marginBottom: 0,
            fontSize: '1.1rem',
          }}>
            {result.message}
          </p>
        </div>

        {/* APPROVED */}
        {result.outcome === DECISION_OUTCOMES.APPROVED && (
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '2rem',
          }}>
            <h3 style={{ marginTop: 0, color: '#4caf50', fontSize: '1.5rem' }}>
              ✅ You're Approved!
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Your application has been approved! A tenant account will be automatically created for you.
              You can now proceed to review and sign your lease agreement.
            </p>
            <div style={{
              backgroundColor: '#e8f5e9',
              padding: '1rem',
              borderRadius: '4px',
              marginTop: '1rem',
            }}>
              <strong>Next Steps:</strong>
              <ol style={{ margin: '0.5rem 0 0', paddingLeft: '1.5rem' }}>
                <li>Review your lease agreement</li>
                <li>Sign electronically</li>
                <li>Receive move-in information</li>
              </ol>
            </div>
          </div>
        )}

        {/* APPROVED WITH GAP PAY */}
        {result.outcome === DECISION_OUTCOMES.APPROVED_GAP_PAY && (
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '2rem',
          }}>
            <h3 style={{ marginTop: 0, color: '#4caf50', fontSize: '1.5rem' }}>
              ✅ Approved with Gap Pay Coverage
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Great news! While your income is slightly below the landlord's requirement, 
              <strong> SwiftVerify will cover your monthly income gap</strong> to ensure you meet the criteria.
            </p>
            <div style={{
              backgroundColor: '#e3f2fd',
              padding: '1.5rem',
              borderRadius: '8px',
              marginTop: '1rem',
            }}>
              <h4 style={{ margin: '0 0 0.5rem', color: '#1976d2' }}>Gap Pay Details:</h4>
              <p style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>
                <strong>Monthly Gap Amount:</strong> ${result.gapAmount?.toFixed(2)}
              </p>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: '#666' }}>
                SwiftVerify will provide this amount monthly to ensure you meet the income requirements.
                This amount will be included in your lease terms.
              </p>
            </div>
            <div style={{
              backgroundColor: '#e8f5e9',
              padding: '1rem',
              borderRadius: '4px',
              marginTop: '1rem',
            }}>
              <strong>Next Steps:</strong>
              <ol style={{ margin: '0.5rem 0 0', paddingLeft: '1.5rem' }}>
                <li>Review gap pay terms in your lease</li>
                <li>Sign your lease agreement</li>
                <li>Complete move-in process</li>
              </ol>
            </div>
          </div>
        )}

        {/* APPROVED WITH WAIVER */}
        {result.outcome === DECISION_OUTCOMES.APPROVED_WAIVER && (
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '2rem',
          }}>
            <h3 style={{ marginTop: 0, color: '#4caf50', fontSize: '1.5rem' }}>
              ✅ Approved with Waiver Form Required
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Your application has been approved! The landlord has requested a waiver form
              as part of the approval conditions.
            </p>
            <div style={{
              backgroundColor: '#fff3cd',
              padding: '1.5rem',
              borderRadius: '8px',
              marginTop: '1rem',
              border: '2px solid #ffc107',
            }}>
              <h4 style={{ margin: '0 0 0.5rem', color: '#856404' }}>Waiver Details:</h4>
              <p style={{ margin: '0.5rem 0', fontSize: '1.1rem', color: '#856404' }}>
                <strong>Waiver Amount:</strong> ${result.waiverAmount?.toFixed(2)}
              </p>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: '#856404' }}>
                This is a landlord-configurable waiver amount between $0.01 and $200.00.
                You must acknowledge and agree to these waiver terms to proceed with lease signing.
              </p>
            </div>
            <div style={{
              backgroundColor: '#e8f5e9',
              padding: '1rem',
              borderRadius: '4px',
              marginTop: '1rem',
            }}>
              <strong>Next Steps:</strong>
              <ol style={{ margin: '0.5rem 0 0', paddingLeft: '1.5rem' }}>
                <li>Review waiver terms</li>
                <li>Acknowledge waiver agreement</li>
                <li>Sign your lease agreement</li>
              </ol>
            </div>
          </div>
        )}

        {/* DENIED */}
        {result.outcome === DECISION_OUTCOMES.DENIED && (
          <div>
            {/* Denial Reason */}
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginBottom: '2rem',
            }}>
              <h3 style={{ marginTop: 0, color: '#f44336', fontSize: '1.5rem' }}>
                Reason for Denial
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6', fontSize: '1.1rem' }}>
                {result.denialReason}
              </p>
            </div>

            {/* Legal Disclaimer - CRITICAL */}
            <LegalDisclaimer
              title="⚖️ IMPORTANT LEGAL INFORMATION"
              content={LEGAL_DISCLAIMERS.DENIAL_NOT_EQUIFAX}
              type="error"
            />

            {/* Appeal Rights */}
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginBottom: '2rem',
            }}>
              <h3 style={{ marginTop: 0, color: '#1976d2', fontSize: '1.5rem' }}>
                📝 Your Right to Appeal
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                {LEGAL_DISCLAIMERS.APPEAL_RIGHTS}
              </p>
              <div style={{
                backgroundColor: '#e3f2fd',
                padding: '1rem',
                borderRadius: '4px',
                marginTop: '1rem',
              }}>
                <strong>How to Appeal:</strong>
                <ol style={{ margin: '0.5rem 0 0', paddingLeft: '1.5rem' }}>
                  <li>Email <a href={`mailto:${EXTERNAL_LINKS.APPEALS_EMAIL}`} style={{ color: '#1976d2' }}>{EXTERNAL_LINKS.APPEALS_EMAIL}</a></li>
                  <li>Include your application ID: <strong>{verificationId}</strong></li>
                  <li>Provide supporting documentation</li>
                  <li>Explain why you believe the decision should be reconsidered</li>
                </ol>
              </div>
            </div>

            {/* Email Notification Sent */}
            <div style={{
              backgroundColor: '#fff3e0',
              padding: '1rem',
              borderRadius: '4px',
              fontSize: '0.9rem',
              color: '#e65100',
              marginBottom: '2rem',
            }}>
              📧 A detailed denial email with all legal information and appeal instructions 
              has been sent to both you ({email}) and the landlord.
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          {result.outcome === DECISION_OUTCOMES.DENIED ? (
            <>
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
                  marginBottom: '1rem',
                  width: '100%',
                }}
              >
                Return to Home
              </button>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>
                For questions, contact <a href={`mailto:${EXTERNAL_LINKS.SUPPORT_EMAIL}`} style={{ color: '#1976d2' }}>{EXTERNAL_LINKS.SUPPORT_EMAIL}</a>
              </p>
            </>
          ) : (
            <button
              onClick={handleContinue}
              style={{
                padding: '1rem 3rem',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1.1rem',
                cursor: 'pointer',
                fontWeight: '600',
                width: '100%',
              }}
            >
              Continue to Lease Signing →
            </button>
          )}
        </div>

        {/* Application ID */}
        <div style={{
          textAlign: 'center',
          marginTop: '1rem',
          fontSize: '0.875rem',
          color: '#999',
        }}>
          Application ID: {verificationId}
        </div>
      </div>
    </div>
  );
};

export default DecisionScreen;
