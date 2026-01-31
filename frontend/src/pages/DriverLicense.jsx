import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Card, Button, Input, FCRANotice } from '../components/UIComponents';
import { verificationAPI } from '../utils/api';

const DriverLicense = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: License, 2: SSN
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [licenseData, setLicenseData] = useState({
    firstName: '',
    lastName: '',
    licenseNumber: '',
    dateOfBirth: '',
    state: '',
    expirationDate: '',
    address: '',
    city: '',
    zipCode: ''
  });

  const [ssnData, setSSNData] = useState({
    ssn: '',
    confirmSSN: ''
  });

  const [validatedFields, setValidatedFields] = useState({});

  const handleLicenseChange = (e) => {
    const { name, value } = e.target;
    setLicenseData({ ...licenseData, [name]: value });
    
    // Simple validation - mark as validated if field has value
    if (value.trim()) {
      setValidatedFields({ ...validatedFields, [name]: true });
    }
  };

  const handleSSNChange = (e) => {
    const { name, value } = e.target;
    setSSNData({ ...ssnData, [name]: value });
  };

  const handleLicenseSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await verificationAPI.submitDriverLicense(licenseData);
      setSuccessMessage('Driver\'s license verified successfully!');
      setTimeout(() => {
        setStep(2);
        setSuccessMessage('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify driver\'s license. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  const handleSSNSubmit = async (e) => {
    e.preventDefault();
    
    if (ssnData.ssn !== ssnData.confirmSSN) {
      setError('SSN numbers do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await verificationAPI.submitSSN({ ssn: ssnData.ssn });
      setSuccessMessage('SSN verified successfully! Redirecting to employment verification...');
      setTimeout(() => {
        navigate('/employment');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify SSN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="container" style={{ maxWidth: '800px' }}>
          <Card>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              Identity Verification
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {step === 1 
                ? 'Please provide your driver\'s license information for identity verification.'
                : 'Complete your identity verification with your Social Security Number.'}
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

          {step === 1 ? (
            <Card title="Driver's License Information">
              <form onSubmit={handleLicenseSubmit}>
                <div className="grid grid-2">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={licenseData.firstName}
                    onChange={handleLicenseChange}
                    placeholder="John"
                    required
                    validated={validatedFields.firstName}
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={licenseData.lastName}
                    onChange={handleLicenseChange}
                    placeholder="Doe"
                    required
                    validated={validatedFields.lastName}
                  />
                </div>

                <div className="grid grid-2">
                  <Input
                    label="License Number"
                    name="licenseNumber"
                    value={licenseData.licenseNumber}
                    onChange={handleLicenseChange}
                    placeholder="DL123456789"
                    required
                    validated={validatedFields.licenseNumber}
                  />
                  <Input
                    label="State"
                    name="state"
                    value={licenseData.state}
                    onChange={handleLicenseChange}
                    placeholder="ID"
                    required
                    validated={validatedFields.state}
                  />
                </div>

                <div className="grid grid-2">
                  <Input
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={licenseData.dateOfBirth}
                    onChange={handleLicenseChange}
                    required
                    validated={validatedFields.dateOfBirth}
                  />
                  <Input
                    label="Expiration Date"
                    name="expirationDate"
                    type="date"
                    value={licenseData.expirationDate}
                    onChange={handleLicenseChange}
                    required
                    validated={validatedFields.expirationDate}
                  />
                </div>

                <Input
                  label="Street Address"
                  name="address"
                  value={licenseData.address}
                  onChange={handleLicenseChange}
                  placeholder="123 Main Street"
                  required
                  validated={validatedFields.address}
                />

                <div className="grid grid-2">
                  <Input
                    label="City"
                    name="city"
                    value={licenseData.city}
                    onChange={handleLicenseChange}
                    placeholder="Boise"
                    required
                    validated={validatedFields.city}
                  />
                  <Input
                    label="ZIP Code"
                    name="zipCode"
                    value={licenseData.zipCode}
                    onChange={handleLicenseChange}
                    placeholder="83702"
                    required
                    validated={validatedFields.zipCode}
                  />
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
                  <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify License'}
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card title="Social Security Number">
              <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                Your SSN is required for identity verification and background checks. 
                This information is encrypted and stored securely.
              </p>

              <form onSubmit={handleSSNSubmit}>
                <Input
                  label="Social Security Number"
                  name="ssn"
                  type="password"
                  value={ssnData.ssn}
                  onChange={handleSSNChange}
                  placeholder="XXX-XX-XXXX"
                  required
                />
                <Input
                  label="Confirm Social Security Number"
                  name="confirmSSN"
                  type="password"
                  value={ssnData.confirmSSN}
                  onChange={handleSSNChange}
                  placeholder="XXX-XX-XXXX"
                  required
                />

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
                  <Button variant="secondary" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Verifying...' : 'Continue to Employment'}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <div style={{ marginTop: '2rem', padding: '1rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <p>🔒 All information is encrypted with AES-256 encryption</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DriverLicense;
