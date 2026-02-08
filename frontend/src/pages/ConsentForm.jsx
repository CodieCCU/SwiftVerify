import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConsentCheckbox from '../components/ConsentCheckbox';
import EmailInput from '../components/EmailInput';
import DriverLicenseInput from '../components/DriverLicenseInput';
import LegalDisclaimer from '../components/LegalDisclaimer';
import { CONSENT_CHECKBOXES, LEGAL_DISCLAIMERS } from '../utils/constants';
import { validateAllConsents } from '../utils/validators';
import { storeConsent } from '../services/verification';

const ConsentForm = () => {
  const navigate = useNavigate();
  
  const [consents, setConsents] = useState({
    employment: false,
    income: false,
    background: false,
    equifax: false,
    noSSN: false,
    dmvSSN: false,
  });
  
  const [email, setEmail] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseFile, setLicenseFile] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConsentChange = (id) => {
    setConsents(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate all consents are checked
    if (!validateAllConsents(consents)) {
      setError('All consent checkboxes must be checked to proceed');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!licenseNumber && !licenseFile) {
      setError('Driver\'s license information is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Store consent in backend
      await storeConsent(consents);
      
      // Navigate to verification status page
      navigate('/verification-status', {
        state: {
          email,
          licenseNumber,
          licenseFile: licenseFile?.name,
          consents
        }
      });
    } catch (err) {
      setError('Failed to submit. Please try again.');
      setIsSubmitting(false);
    }
  };

  const allConsentsChecked = validateAllConsents(consents);

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
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'white',
            color: '#1976d2',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          ← Back
        </button>
      </nav>

      <div style={{
        maxWidth: '800px',
        margin: '2rem auto',
        padding: '0 1rem'
      }}>
        {/* Page Title */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px 8px 0 0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ marginTop: 0, color: '#333', fontSize: '2rem' }}>
            Consent Form &amp; Verification Information
          </h2>
          <p style={{ color: '#666', lineHeight: '1.6', marginBottom: 0 }}>
            Please review and agree to all consent items below, then provide your contact and identification information.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            border: '2px solid #f44336',
            borderRadius: '4px',
            padding: '1rem',
            margin: '1rem 0',
            color: '#c62828',
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Consent Checkboxes */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <h3 style={{ marginTop: 0, color: '#1976d2', fontSize: '1.3rem' }}>
              Required Consents (All 6 Required)
            </h3>
            
            {CONSENT_CHECKBOXES.map((checkbox) => (
              <ConsentCheckbox
                key={checkbox.id}
                id={checkbox.id}
                label={checkbox.label}
                checked={consents[checkbox.id]}
                onChange={() => handleConsentChange(checkbox.id)}
              />
            ))}
            
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: allConsentsChecked ? '#e8f5e9' : '#fff3cd',
              borderRadius: '4px',
              border: `2px solid ${allConsentsChecked ? '#4caf50' : '#ffc107'}`,
            }}>
              <p style={{ 
                margin: 0, 
                color: allConsentsChecked ? '#2e7d32' : '#856404',
                fontWeight: '600',
              }}>
                {allConsentsChecked 
                  ? '✓ All consents provided - you may proceed' 
                  : '⚠️ All 6 consent checkboxes must be checked to continue'}
              </p>
            </div>
          </div>

          {/* Legal Disclaimers */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <h3 style={{ marginTop: 0, color: '#1976d2', fontSize: '1.3rem' }}>
              Important Legal Information
            </h3>
            
            <LegalDisclaimer
              title="🔒 NO SSN Storage Guarantee"
              content={LEGAL_DISCLAIMERS.NO_SSN_STORAGE}
              type="info"
            />
            
            <LegalDisclaimer
              title="📋 Equifax Work Number Consent"
              content={LEGAL_DISCLAIMERS.EQUIFAX_CONSENT}
              type="info"
            />
            
            <LegalDisclaimer
              title="🚗 DMV SSN Authorization"
              content={LEGAL_DISCLAIMERS.DMV_AUTHORIZATION}
              type="warning"
            />
          </div>

          {/* Email and License Input */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0 0 8px 8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <h3 style={{ marginTop: 0, color: '#1976d2', fontSize: '1.3rem' }}>
              Your Information
            </h3>
            
            <EmailInput
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <DriverLicenseInput
              value={licenseNumber}
              onChange={setLicenseNumber}
              onFileUpload={setLicenseFile}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!allConsentsChecked || isSubmitting}
              style={{
                width: '100%',
                padding: '1.25rem',
                backgroundColor: allConsentsChecked && !isSubmitting ? '#1976d2' : '#bdbdbd',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1.1rem',
                cursor: allConsentsChecked && !isSubmitting ? 'pointer' : 'not-allowed',
                fontWeight: '600',
                marginTop: '1rem',
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit & Begin Verification'}
            </button>
          </div>
        </form>

        {/* Data Lifecycle Notice */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>
            🔒 {LEGAL_DISCLAIMERS.DATA_LIFECYCLE}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsentForm;
