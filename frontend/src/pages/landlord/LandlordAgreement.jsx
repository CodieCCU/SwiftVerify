import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandlordAgreement = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    landlordName: '',
    landlordEmail: '',
    propertyManagementCompany: '',
    acknowledgments: {
      readAndUnderstand: false,
      noCreditCheckSystem: false,
      withoutCreditEvaluation: false,
      willNotConductCreditChecks: false,
      beforeAndAfter: false,
      accountTermination: false,
      rentalDecisionCriteria: false,
      fairHousingCompliance: false,
    },
    legalAcknowledgment: false,
    signature: '',
  });

  const [errors, setErrors] = useState({});
  const [showTerms, setShowTerms] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === 'legalAcknowledgment') {
      setFormData(prev => ({
        ...prev,
        legalAcknowledgment: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        acknowledgments: {
          ...prev.acknowledgments,
          [name]: checked
        }
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.landlordName.trim()) {
      newErrors.landlordName = 'Name is required';
    }
    
    if (!formData.landlordEmail.trim()) {
      newErrors.landlordEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.landlordEmail)) {
      newErrors.landlordEmail = 'Valid email is required';
    }
    
    if (!formData.signature.trim()) {
      newErrors.signature = 'Digital signature is required';
    }
    
    const allAcknowledgmentsChecked = Object.values(formData.acknowledgments).every(v => v === true);
    if (!allAcknowledgmentsChecked) {
      newErrors.acknowledgments = 'All acknowledgments must be checked';
    }
    
    if (!formData.legalAcknowledgment) {
      newErrors.legalAcknowledgment = 'You must accept the legal terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // In a real application, this would submit to the backend API
      // const response = await fetch('/api/landlord/agreement/accept', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...formData,
      //     timestamp: new Date().toISOString(),
      //     ipAddress: 'captured-on-server'
      //   })
      // });
      
      // For now, simulate success
      console.log('Agreement accepted:', formData);
      alert('Agreement accepted successfully! You can now access the landlord dashboard.');
      navigate('/landlord/dashboard');
    } catch (error) {
      console.error('Error submitting agreement:', error);
      alert('Error submitting agreement. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <nav style={{
        backgroundColor: '#1976d2',
        padding: '1rem 2rem',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>SwiftVerify</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>NO CREDIT CHECK Platform</span>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
        {/* Warning Banner */}
        <div style={{
          backgroundColor: '#fff3cd',
          border: '2px solid #ffc107',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '2rem' }}>⚠️</div>
            <div>
              <h2 style={{ margin: '0 0 0.5rem', color: '#856404', fontSize: '1.5rem' }}>
                IMPORTANT: NO CREDIT CHECK AGREEMENT
              </h2>
              <p style={{ margin: 0, color: '#856404', fontSize: '1rem', lineHeight: '1.5' }}>
                SwiftVerify is a <strong>NO CREDIT CHECK</strong> tenant screening system. 
                You must agree NOT to conduct credit checks on tenants before using this platform.
              </p>
            </div>
          </div>
        </div>

        {/* Agreement Form */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginTop: 0, color: '#333', fontSize: '2rem' }}>
            Landlord Agreement
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Contact Information */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#1976d2', fontSize: '1.3rem', marginBottom: '1rem' }}>
                Contact Information
              </h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="landlordName"
                  value={formData.landlordName}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    border: errors.landlordName ? '2px solid #d32f2f' : '1px solid #ccc',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter your full legal name"
                />
                {errors.landlordName && (
                  <p style={{ color: '#d32f2f', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
                    {errors.landlordName}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="landlordEmail"
                  value={formData.landlordEmail}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    border: errors.landlordEmail ? '2px solid #d32f2f' : '1px solid #ccc',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="your.email@example.com"
                />
                {errors.landlordEmail && (
                  <p style={{ color: '#d32f2f', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
                    {errors.landlordEmail}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  Property Management Company (Optional)
                </label>
                <input
                  type="text"
                  name="propertyManagementCompany"
                  value={formData.propertyManagementCompany}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Company name (if applicable)"
                />
              </div>
            </div>

            {/* Key Terms Summary */}
            <div style={{
              backgroundColor: '#e3f2fd',
              border: '2px solid #1976d2',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{ marginTop: 0, color: '#1976d2', fontSize: '1.3rem' }}>
                What You're Agreeing To
              </h3>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                <li><strong>SwiftVerify is a NO CREDIT CHECK system</strong></li>
                <li>Tenants are approved based ONLY on: Identity + Employment + Background (optional)</li>
                <li><strong>You CANNOT conduct credit checks</strong> on SwiftVerify tenants</li>
                <li>This applies BEFORE and AFTER tenant selection</li>
                <li>Violation may result in account termination</li>
              </ul>
              <button
                type="button"
                onClick={() => setShowTerms(!showTerms)}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}
              >
                {showTerms ? 'Hide Full Terms' : 'View Full Terms'}
              </button>
              {showTerms && (
                <div style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  fontSize: '0.9rem',
                  lineHeight: '1.6'
                }}>
                  <p><strong>Full terms available in AgreementTerms.md</strong></p>
                  <p>By using SwiftVerify, you agree to screen tenants WITHOUT credit checks and base decisions solely on identity verification, employment/income verification, and optional criminal background checks.</p>
                  <p><a href="/docs/AgreementTerms.md" target="_blank" style={{ color: '#1976d2' }}>Read Complete Agreement Terms →</a></p>
                </div>
              )}
            </div>

            {/* Acknowledgments */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#1976d2', fontSize: '1.3rem', marginBottom: '1rem' }}>
                Required Acknowledgments *
              </h3>
              
              <div style={{
                backgroundColor: errors.acknowledgments ? '#ffebee' : '#fafafa',
                border: errors.acknowledgments ? '2px solid #d32f2f' : '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '1.5rem'
              }}>
                {[
                  { key: 'readAndUnderstand', label: 'I have read and understand this entire agreement' },
                  { key: 'noCreditCheckSystem', label: 'I understand SwiftVerify is a NO CREDIT CHECK screening system' },
                  { key: 'withoutCreditEvaluation', label: 'I understand tenants are approved/denied WITHOUT credit evaluation' },
                  { key: 'willNotConductCreditChecks', label: 'I agree NOT to conduct credit checks on SwiftVerify tenants' },
                  { key: 'beforeAndAfter', label: 'I understand this prohibition applies BEFORE and AFTER tenant selection' },
                  { key: 'accountTermination', label: 'I understand violation may result in account termination and legal liability' },
                  { key: 'rentalDecisionCriteria', label: 'I will base rental decisions on identity, employment, and background checks only' },
                  { key: 'fairHousingCompliance', label: 'I will comply with all applicable Fair Housing and consumer protection laws' },
                ].map(({ key, label }) => (
                  <div key={key} style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name={key}
                        checked={formData.acknowledgments[key]}
                        onChange={handleCheckboxChange}
                        style={{
                          marginTop: '0.25rem',
                          marginRight: '0.75rem',
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{ fontSize: '1rem', lineHeight: '1.5', color: '#333' }}>
                        {label}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
              
              {errors.acknowledgments && (
                <p style={{ color: '#d32f2f', fontSize: '0.875rem', margin: '0.5rem 0 0' }}>
                  {errors.acknowledgments}
                </p>
              )}
            </div>

            {/* Digital Signature */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#1976d2', fontSize: '1.3rem', marginBottom: '1rem' }}>
                Digital Signature
              </h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  Type your full name to sign *
                </label>
                <input
                  type="text"
                  name="signature"
                  value={formData.signature}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '1.2rem',
                    fontFamily: 'cursive',
                    border: errors.signature ? '2px solid #d32f2f' : '2px solid #1976d2',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                    backgroundColor: '#f9f9f9'
                  }}
                  placeholder="Your full legal name"
                />
                {errors.signature && (
                  <p style={{ color: '#d32f2f', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
                    {errors.signature}
                  </p>
                )}
              </div>

              <div style={{
                backgroundColor: errors.legalAcknowledgment ? '#ffebee' : '#fafafa',
                border: errors.legalAcknowledgment ? '2px solid #d32f2f' : '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '1rem'
              }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="legalAcknowledgment"
                    checked={formData.legalAcknowledgment}
                    onChange={handleCheckboxChange}
                    style={{
                      marginTop: '0.25rem',
                      marginRight: '0.75rem',
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ fontSize: '1rem', lineHeight: '1.5', color: '#333' }}>
                    By checking this box and typing my name above, I electronically sign this agreement 
                    and agree to be legally bound by all terms and conditions. I certify that I have 
                    authority to bind the landlord/property management entity to this agreement.
                  </span>
                </label>
              </div>
              
              {errors.legalAcknowledgment && (
                <p style={{ color: '#d32f2f', fontSize: '0.875rem', margin: '0.5rem 0 0' }}>
                  {errors.legalAcknowledgment}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div style={{
              borderTop: '2px solid #e0e0e0',
              paddingTop: '2rem',
              textAlign: 'center'
            }}>
              <button
                type="submit"
                style={{
                  padding: '1rem 3rem',
                  fontSize: '1.2rem',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              >
                Accept Agreement & Continue
              </button>
              <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
                Signed: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          marginTop: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#666' }}>
            Questions about this agreement? Contact us:
          </p>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Legal:</strong> <a href="mailto:legal@swiftverify.com" style={{ color: '#1976d2' }}>legal@swiftverify.com</a> | 
            <strong> Compliance:</strong> <a href="mailto:compliance@swiftverify.com" style={{ color: '#1976d2' }}>compliance@swiftverify.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandlordAgreement;
