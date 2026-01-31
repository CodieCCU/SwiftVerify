import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Card, Button, Input, FCRANotice } from '../components/UIComponents';
import { backgroundCheckAPI } from '../utils/api';

const BackgroundCheck = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [checkSubmitted, setCheckSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  const [backgroundData, setBackgroundData] = useState({
    previousAddress: '',
    previousCity: '',
    previousState: '',
    previousZip: '',
    yearsAtPrevious: '',
    hasConvictions: 'no',
    convictionDetails: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBackgroundData({ ...backgroundData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!consentGiven) {
      setError('You must provide consent for the background check to proceed.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await backgroundCheckAPI.submitBackgroundCheck({
        ...backgroundData,
        consent: consentGiven
      });

      setCheckSubmitted(true);
      
      // Simulate background check processing
      setTimeout(async () => {
        try {
          const response = await backgroundCheckAPI.getBackgroundCheckResults();
          setResults({
            status: 'completed',
            criminalRecord: {
              status: 'clear',
              details: 'No criminal records found'
            },
            creditCheck: {
              status: 'good',
              score: 720,
              details: 'Good credit standing'
            },
            evictionHistory: {
              status: 'clear',
              details: 'No eviction records found'
            },
            completedAt: new Date().toISOString()
          });
        } catch (err) {
          setError('Failed to retrieve background check results.');
        }
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit background check. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate('/approval');
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="container" style={{ maxWidth: '800px' }}>
          <Card>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              Background & Credit Check
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Complete your background and credit verification as part of the rental application process.
            </p>
          </Card>

          <FCRANotice />

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {!checkSubmitted ? (
            <>
              <Card title="Background Information">
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', fontWeight: 600 }}>
                    Previous Address (if moved within last 2 years)
                  </h3>

                  <Input
                    label="Previous Street Address"
                    name="previousAddress"
                    value={backgroundData.previousAddress}
                    onChange={handleChange}
                    placeholder="456 Oak Avenue"
                  />

                  <div className="grid grid-3">
                    <Input
                      label="City"
                      name="previousCity"
                      value={backgroundData.previousCity}
                      onChange={handleChange}
                      placeholder="Boise"
                    />
                    <Input
                      label="State"
                      name="previousState"
                      value={backgroundData.previousState}
                      onChange={handleChange}
                      placeholder="ID"
                    />
                    <Input
                      label="ZIP Code"
                      name="previousZip"
                      value={backgroundData.previousZip}
                      onChange={handleChange}
                      placeholder="83702"
                    />
                  </div>

                  <Input
                    label="Years at Previous Address"
                    name="yearsAtPrevious"
                    type="number"
                    value={backgroundData.yearsAtPrevious}
                    onChange={handleChange}
                    placeholder="2"
                  />

                  <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', fontWeight: 600 }}>
                      Criminal History Disclosure
                    </h3>

                    <div className="input-group">
                      <label className="input-label">
                        Have you ever been convicted of a felony or misdemeanor? 
                        <span style={{ color: 'var(--danger-color)' }}> *</span>
                      </label>
                      <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="hasConvictions"
                            value="no"
                            checked={backgroundData.hasConvictions === 'no'}
                            onChange={handleChange}
                            style={{ marginRight: '0.5rem' }}
                          />
                          No
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="hasConvictions"
                            value="yes"
                            checked={backgroundData.hasConvictions === 'yes'}
                            onChange={handleChange}
                            style={{ marginRight: '0.5rem' }}
                          />
                          Yes
                        </label>
                      </div>
                    </div>

                    {backgroundData.hasConvictions === 'yes' && (
                      <div className="input-group">
                        <label htmlFor="convictionDetails" className="input-label">
                          Please provide details:
                        </label>
                        <textarea
                          id="convictionDetails"
                          name="convictionDetails"
                          value={backgroundData.convictionDetails}
                          onChange={handleChange}
                          className="input-field"
                          rows="4"
                          placeholder="Please describe the nature of the conviction(s), date(s), and jurisdiction(s)"
                          required
                        />
                      </div>
                    )}
                  </div>

                  <div style={{ 
                    marginTop: '2rem', 
                    paddingTop: '2rem', 
                    borderTop: '1px solid var(--border-color)',
                    backgroundColor: '#FEF3C7',
                    padding: '1.5rem',
                    borderRadius: '0.375rem'
                  }}>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', fontWeight: 600 }}>
                      Authorization & Consent
                    </h3>
                    <label style={{ display: 'flex', alignItems: 'start', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={consentGiven}
                        onChange={(e) => setConsentGiven(e.target.checked)}
                        style={{ marginRight: '0.75rem', marginTop: '0.25rem' }}
                      />
                      <span style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                        I hereby authorize SwiftVerify and its authorized agents to conduct a comprehensive background 
                        check, including but not limited to criminal records, credit history, eviction records, and 
                        employment verification. I understand this information will be used to evaluate my rental 
                        application in accordance with the Fair Credit Reporting Act (FCRA) and applicable state laws.
                      </span>
                    </label>
                  </div>

                  <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
                    <Button variant="secondary" onClick={() => navigate('/employment')}>
                      Back
                    </Button>
                    <Button type="submit" disabled={loading || !consentGiven}>
                      {loading ? 'Processing...' : 'Submit Background Check'}
                    </Button>
                  </div>
                </form>
              </Card>
            </>
          ) : results ? (
            <>
              <Card title="Background Check Results">
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ 
                    display: 'inline-block',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    backgroundColor: '#D1FAE5',
                    color: '#065F46',
                    fontWeight: 600
                  }}>
                    ✓ Background Check Completed
                  </div>
                </div>

                <div className="grid" style={{ gap: '1rem' }}>
                  <div style={{ 
                    padding: '1.5rem', 
                    backgroundColor: 'var(--background)', 
                    borderRadius: '0.375rem',
                    border: '2px solid var(--success-color)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Criminal Record Check</h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {results.criminalRecord.details}
                        </p>
                      </div>
                      <span className="checkmark" style={{ fontSize: '1.5rem', width: '2rem', height: '2rem', lineHeight: '2rem' }}>
                        ✓
                      </span>
                    </div>
                  </div>

                  <div style={{ 
                    padding: '1.5rem', 
                    backgroundColor: 'var(--background)', 
                    borderRadius: '0.375rem',
                    border: '2px solid var(--success-color)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Credit Check</h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          Score: {results.creditCheck.score} - {results.creditCheck.details}
                        </p>
                      </div>
                      <span className="checkmark" style={{ fontSize: '1.5rem', width: '2rem', height: '2rem', lineHeight: '2rem' }}>
                        ✓
                      </span>
                    </div>
                  </div>

                  <div style={{ 
                    padding: '1.5rem', 
                    backgroundColor: 'var(--background)', 
                    borderRadius: '0.375rem',
                    border: '2px solid var(--success-color)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Eviction History</h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {results.evictionHistory.details}
                        </p>
                      </div>
                      <span className="checkmark" style={{ fontSize: '1.5rem', width: '2rem', height: '2rem', lineHeight: '2rem' }}>
                        ✓
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ 
                  marginTop: '2rem', 
                  padding: '1rem', 
                  backgroundColor: '#D1FAE5',
                  borderRadius: '0.375rem',
                  textAlign: 'center'
                }}>
                  <p style={{ fontWeight: 600, color: '#065F46' }}>
                    🎉 Congratulations! Your background check has been completed successfully.
                  </p>
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                  <Button onClick={handleContinue}>
                    Continue to Approval
                  </Button>
                </div>
              </Card>
            </>
          ) : (
            <Card title="Processing Background Check">
              <div className="loading">
                <p style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
                  Please wait while we process your background check...
                </p>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: 'var(--border-color)', 
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginTop: '1rem'
                }}>
                  <div style={{ 
                    width: '60%', 
                    height: '100%', 
                    backgroundColor: 'var(--primary-color)',
                    animation: 'progress 2s ease-in-out infinite'
                  }} />
                </div>
                <p style={{ fontSize: '0.875rem', marginTop: '1rem', color: 'var(--text-secondary)' }}>
                  This may take a few moments...
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default BackgroundCheck;
