import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UnsubscribePage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, valid, invalid, processing, success, error
  const [message, setMessage] = useState('');
  const [reason, setReason] = useState('');
  const [showReasonInput, setShowReasonInput] = useState(false);

  useEffect(() => {
    // Verify token on page load
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`/api/email/unsubscribe/verify/${token}`);
      const data = await response.json();

      if (data.valid) {
        if (data.alreadyUnsubscribed) {
          setStatus('valid');
          setMessage('You have already unsubscribed from SwiftVerify emails.');
        } else {
          setStatus('valid');
          setMessage('Ready to unsubscribe from SwiftVerify emails.');
        }
      } else {
        setStatus('invalid');
        setMessage('Invalid or expired unsubscribe link.');
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      setStatus('error');
      setMessage('An error occurred while verifying your unsubscribe request.');
    }
  };

  const handleUnsubscribe = async () => {
    setStatus('processing');
    setMessage('Processing your unsubscribe request...');

    try {
      const response = await fetch(`/api/email/unsubscribe/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          reason: reason || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage('You have been successfully unsubscribed from SwiftVerify emails. This action has been logged for compliance purposes.');
      } else {
        setStatus('error');
        setMessage('Failed to process your unsubscribe request. Please try again or contact support.');
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
      setStatus('error');
      setMessage('An error occurred while processing your request. Please try again later.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '40px',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#333', fontSize: '28px', marginBottom: '10px' }}>
            SwiftVerify Email Unsubscribe
          </h1>
          <p style={{ color: '#666', fontSize: '14px' }}>
            SwiftVerify, LLC - Boise, Idaho
          </p>
        </div>

        {/* Status Messages */}
        {status === 'verifying' && (
          <div style={{
            padding: '20px',
            backgroundColor: '#d1ecf1',
            borderLeft: '4px solid #0c5460',
            marginBottom: '20px',
          }}>
            <p style={{ margin: 0, color: '#0c5460' }}>
              Verifying your unsubscribe request...
            </p>
          </div>
        )}

        {status === 'invalid' && (
          <div style={{
            padding: '20px',
            backgroundColor: '#f8d7da',
            borderLeft: '4px solid #721c24',
            marginBottom: '20px',
          }}>
            <p style={{ margin: 0, color: '#721c24', fontWeight: 'bold' }}>
              {message}
            </p>
            <p style={{ margin: '10px 0 0 0', color: '#721c24', fontSize: '14px' }}>
              This link may have expired or is invalid. If you need assistance, please contact support@swift-verify.org
            </p>
          </div>
        )}

        {status === 'valid' && (
          <div>
            <div style={{
              padding: '20px',
              backgroundColor: '#fff3cd',
              borderLeft: '4px solid #856404',
              marginBottom: '20px',
            }}>
              <p style={{ margin: 0, color: '#856404' }}>
                {message}
              </p>
            </div>

            {!message.includes('already') && (
              <div>
                <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '15px' }}>
                  Unsubscribe from SwiftVerify Emails
                </h2>
                
                <p style={{ color: '#666', marginBottom: '20px' }}>
                  By clicking "Unsubscribe Immediately" below, you will be removed from all SwiftVerify email communications. 
                  This action is:
                </p>
                
                <ul style={{ color: '#666', marginBottom: '20px', paddingLeft: '20px' }}>
                  <li><strong>Immediate:</strong> Processed in less than 1 second</li>
                  <li><strong>Permanent:</strong> Cannot be undone without admin approval</li>
                  <li><strong>Logged:</strong> Recorded in our immutable audit trail</li>
                  <li><strong>Compliant:</strong> Meets CAN-SPAM and GDPR requirements</li>
                </ul>

                <div style={{ marginBottom: '20px' }}>
                  <button
                    onClick={() => setShowReasonInput(!showReasonInput)}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#007bff',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontSize: '14px',
                      padding: 0,
                    }}
                  >
                    {showReasonInput ? '▼' : '▶'} Optional: Tell us why you're unsubscribing
                  </button>
                </div>

                {showReasonInput && (
                  <div style={{ marginBottom: '20px' }}>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Optional: Help us improve by telling us why you're unsubscribing"
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        padding: '10px',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontFamily: 'Arial, sans-serif',
                      }}
                    />
                  </div>
                )}

                <button
                  onClick={handleUnsubscribe}
                  style={{
                    width: '100%',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    padding: '16px',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                >
                  UNSUBSCRIBE IMMEDIATELY
                </button>
              </div>
            )}
          </div>
        )}

        {status === 'processing' && (
          <div style={{
            padding: '20px',
            backgroundColor: '#d1ecf1',
            borderLeft: '4px solid #0c5460',
            marginBottom: '20px',
          }}>
            <p style={{ margin: 0, color: '#0c5460' }}>
              {message}
            </p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div style={{
              padding: '20px',
              backgroundColor: '#d4edda',
              borderLeft: '4px solid #155724',
              marginBottom: '20px',
            }}>
              <p style={{ margin: 0, color: '#155724', fontWeight: 'bold' }}>
                ✓ Successfully Unsubscribed
              </p>
              <p style={{ margin: '10px 0 0 0', color: '#155724', fontSize: '14px' }}>
                {message}
              </p>
            </div>

            <div style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              marginBottom: '20px',
            }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                <strong>What happens next?</strong>
              </p>
              <ul style={{ margin: '10px 0 0 0', paddingLeft: '20px', fontSize: '14px', color: '#666' }}>
                <li>You will not receive any further emails from SwiftVerify</li>
                <li>Your unsubscribe has been logged in our compliance audit trail</li>
                <li>To resubscribe, you must contact our support team</li>
              </ul>
            </div>

            <button
              onClick={() => navigate('/')}
              style={{
                width: '100%',
                backgroundColor: '#007bff',
                color: 'white',
                padding: '12px',
                border: 'none',
                borderRadius: '5px',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Return to Home
            </button>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div style={{
              padding: '20px',
              backgroundColor: '#f8d7da',
              borderLeft: '4px solid #721c24',
              marginBottom: '20px',
            }}>
              <p style={{ margin: 0, color: '#721c24', fontWeight: 'bold' }}>
                {message}
              </p>
            </div>

            <p style={{ fontSize: '14px', color: '#666' }}>
              If this problem persists, please contact us at:
              <br />
              <a href="mailto:support@swift-verify.org" style={{ color: '#007bff' }}>
                support@swift-verify.org
              </a>
            </p>
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #e9ecef',
          textAlign: 'center',
          fontSize: '12px',
          color: '#999',
        }}>
          <p style={{ margin: 0 }}>
            SwiftVerify, LLC - CAN-SPAM Compliant Email Unsubscribe
          </p>
          <p style={{ margin: '5px 0 0 0' }}>
            <a href="https://swift-verify.org" style={{ color: '#007bff' }}>
              www.swift-verify.org
            </a>
            {' | '}
            <a href="mailto:support@swift-verify.org" style={{ color: '#007bff' }}>
              support@swift-verify.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnsubscribePage;
