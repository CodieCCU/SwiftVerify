import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Reapply = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState('');
  const [unitInfo, setUnitInfo] = useState(null);
  const [tenantEmail, setTenantEmail] = useState('');

  // Form state
  const [email, setEmail] = useState('');
  const [driversLicense, setDriversLicense] = useState('');
  const [ssn, setSSN] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateToken = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/landlord/token/${token}/validate`);
      
      if (response.data.valid) {
        setTokenValid(true);
        setUnitInfo(response.data.unit);
        setTenantEmail(response.data.tenant_email);
        setEmail(response.data.tenant_email);
      } else {
        setError('Invalid token');
      }
    } catch (err) {
      if (err.response?.status === 410) {
        setError('This link has expired or has already been used');
      } else if (err.response?.status === 404) {
        setError('Invalid or expired link');
      } else {
        setError('Failed to validate link. Please try again.');
      }
    } finally {
      setValidating(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setError('No token provided');
      setValidating(false);
      return;
    }

    validateToken();
  }, [token, validateToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email !== tenantEmail) {
      alert('Email does not match the invitation');
      return;
    }

    setSubmitting(true);

    try {
      await axios.post('http://localhost:8080/api/applications', {
        token: token,
        unit_id: unitInfo.id,
        email: email,
        drivers_license_number: driversLicense,
        ssn: ssn,
        current_address: currentAddress
      });

      setSubmitted(true);
    } catch (err) {
      alert('Failed to submit application. Please try again.');
      console.error('Error submitting application:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (validating) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <p>Validating link...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#f44336', marginBottom: '1rem' }}>Link Invalid</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>{error}</p>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 1rem',
            backgroundColor: '#4caf50',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2 style={{ color: '#4caf50', marginBottom: '1rem' }}>Application Submitted!</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            Your reapplication has been successfully submitted. 
            You will receive a confirmation email shortly.
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Continue to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <nav style={{
        backgroundColor: '#1976d2',
        padding: '1rem 2rem',
        color: 'white'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>SwiftVerify - Reapplication</h1>
      </nav>

      <div style={{
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '0 1rem'
      }}>
        {/* Unit Information */}
        {unitInfo && (
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ marginTop: 0, color: '#333' }}>Property Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.875rem' }}>Unit Number</p>
                <p style={{ margin: '0.25rem 0', fontWeight: '500' }}>{unitInfo.unit_number}</p>
              </div>
              <div>
                <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.875rem' }}>Monthly Rent</p>
                <p style={{ margin: '0.25rem 0', fontWeight: '500' }}>${unitInfo.rent_amount.toFixed(2)}</p>
              </div>
              <div>
                <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.875rem' }}>Utilities</p>
                <p style={{ margin: '0.25rem 0', fontWeight: '500' }}>${unitInfo.utilities_cost.toFixed(2)}</p>
              </div>
              <div>
                <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.875rem' }}>Bedrooms / Bathrooms</p>
                <p style={{ margin: '0.25rem 0', fontWeight: '500' }}>{unitInfo.bedrooms} BR / {unitInfo.bathrooms} BA</p>
              </div>
            </div>
          </div>
        )}

        {/* Application Form */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginTop: 0, color: '#333' }}>Reapplication Form</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            Please complete the form below to reapply for this unit.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#555',
                fontWeight: '500'
              }}>
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  backgroundColor: '#f5f5f5'
                }}
                required
                readOnly
              />
              <p style={{ 
                margin: '0.25rem 0 0 0', 
                fontSize: '0.875rem', 
                color: '#666' 
              }}>
                This must match the email where you received the link
              </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#555',
                fontWeight: '500'
              }}>
                Driver's License Number *
              </label>
              <input
                type="text"
                value={driversLicense}
                onChange={(e) => setDriversLicense(e.target.value)}
                placeholder="Enter your driver's license number"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#555',
                fontWeight: '500'
              }}>
                Social Security Number *
              </label>
              <input
                type="text"
                value={ssn}
                onChange={(e) => setSSN(e.target.value)}
                placeholder="XXX-XX-XXXX"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#555',
                fontWeight: '500'
              }}>
                Current Address *
              </label>
              <textarea
                value={currentAddress}
                onChange={(e) => setCurrentAddress(e.target.value)}
                placeholder="Enter your current address"
                rows="3"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: submitting ? '#ccc' : '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1.1rem',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>

        {/* Security Notice */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#e3f2fd',
          borderRadius: '4px',
          fontSize: '0.875rem',
          color: '#1976d2'
        }}>
          <strong>Security Notice:</strong> Your information is encrypted and securely stored. 
          This link can only be used once and will expire in 7 days.
        </div>
      </div>
    </div>
  );
};

export default Reapply;
