import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Card, Button, Input, FCRANotice } from '../components/UIComponents';
import { employmentAPI } from '../utils/api';

const Employment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [verifiedIncome, setVerifiedIncome] = useState(null);

  const [employmentData, setEmploymentData] = useState({
    employerName: '',
    position: '',
    employmentType: 'full-time',
    startDate: '',
    employerPhone: '',
    supervisorName: '',
    monthlyIncome: '',
    otherIncome: '',
    otherIncomeSource: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmploymentData({ ...employmentData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await employmentAPI.submitEmployment(employmentData);
      setSuccessMessage('Employment information submitted successfully!');
      
      // Simulate income verification
      setTimeout(async () => {
        try {
          const verifyResponse = await employmentAPI.verifyIncome(employmentData);
          setVerifiedIncome({
            monthlyIncome: parseFloat(employmentData.monthlyIncome),
            otherIncome: parseFloat(employmentData.otherIncome) || 0,
            totalIncome: parseFloat(employmentData.monthlyIncome) + (parseFloat(employmentData.otherIncome) || 0),
            verified: true
          });
          setSuccessMessage('Income verified successfully! You can now proceed to background check.');
        } catch (err) {
          setError('Income verification pending. Please contact your employer to verify employment.');
        }
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit employment information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate('/background-check');
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="container" style={{ maxWidth: '800px' }}>
          <Card>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              Employment & Income Verification
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Provide your employment information to verify your income for the rental application.
            </p>
          </Card>

          <FCRANotice />

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}

          <Card title="Employment Information">
            <form onSubmit={handleSubmit}>
              <Input
                label="Employer Name"
                name="employerName"
                value={employmentData.employerName}
                onChange={handleChange}
                placeholder="ABC Company Inc."
                required
              />

              <div className="grid grid-2">
                <Input
                  label="Job Position/Title"
                  name="position"
                  value={employmentData.position}
                  onChange={handleChange}
                  placeholder="Software Engineer"
                  required
                />
                <div className="input-group">
                  <label htmlFor="employmentType" className="input-label">
                    Employment Type <span style={{ color: 'var(--danger-color)' }}>*</span>
                  </label>
                  <select
                    id="employmentType"
                    name="employmentType"
                    value={employmentData.employmentType}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="full-time">Full-Time</option>
                    <option value="part-time">Part-Time</option>
                    <option value="contract">Contract</option>
                    <option value="self-employed">Self-Employed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-2">
                <Input
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={employmentData.startDate}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Employer Phone"
                  name="employerPhone"
                  type="tel"
                  value={employmentData.employerPhone}
                  onChange={handleChange}
                  placeholder="(208) 555-0123"
                  required
                />
              </div>

              <Input
                label="Supervisor/Manager Name"
                name="supervisorName"
                value={employmentData.supervisorName}
                onChange={handleChange}
                placeholder="Jane Smith"
                required
              />

              <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>
                  Income Information
                </h3>

                <Input
                  label="Monthly Gross Income"
                  name="monthlyIncome"
                  type="number"
                  value={employmentData.monthlyIncome}
                  onChange={handleChange}
                  placeholder="5000"
                  required
                />

                <Input
                  label="Other Monthly Income (Optional)"
                  name="otherIncome"
                  type="number"
                  value={employmentData.otherIncome}
                  onChange={handleChange}
                  placeholder="0"
                />

                {employmentData.otherIncome && (
                  <Input
                    label="Source of Other Income"
                    name="otherIncomeSource"
                    value={employmentData.otherIncomeSource}
                    onChange={handleChange}
                    placeholder="e.g., Freelance work, Investments"
                  />
                )}
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
                <Button variant="secondary" onClick={() => navigate('/driver-license')}>
                  Back
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit & Verify Income'}
                </Button>
              </div>
            </form>
          </Card>

          {verifiedIncome && (
            <Card title="Verified Income Summary">
              <div style={{ backgroundColor: 'var(--background)', padding: '1.5rem', borderRadius: '0.375rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: 500 }}>Monthly Employment Income:</span>
                  <span style={{ fontWeight: 600 }}>${verifiedIncome.monthlyIncome.toLocaleString()}</span>
                </div>
                {verifiedIncome.otherIncome > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 500 }}>Other Monthly Income:</span>
                    <span style={{ fontWeight: 600 }}>${verifiedIncome.otherIncome.toLocaleString()}</span>
                  </div>
                )}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '1rem', 
                  paddingTop: '1rem', 
                  borderTop: '2px solid var(--border-color)',
                  fontSize: '1.125rem'
                }}>
                  <span style={{ fontWeight: 700 }}>Total Monthly Income:</span>
                  <span style={{ fontWeight: 700, color: 'var(--success-color)' }}>
                    ${verifiedIncome.totalIncome.toLocaleString()}
                    <span className="checkmark" style={{ marginLeft: '0.5rem' }}>✓</span>
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                <Button onClick={handleContinue}>
                  Continue to Background Check
                </Button>
              </div>
            </Card>
          )}

          <div style={{ marginTop: '2rem', padding: '1rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <p>We may contact your employer to verify employment information</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Employment;
