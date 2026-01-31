import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Card, Button, FCRANotice } from '../components/UIComponents';
import { approvalAPI } from '../utils/api';

const Approval = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [approvalDetails, setApprovalDetails] = useState(null);
  const [signatureData, setSignatureData] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Fetch property and approval details
    const fetchDetails = async () => {
      try {
        const [propertyRes, approvalRes] = await Promise.all([
          approvalAPI.getPropertyDetails(),
          approvalAPI.getApprovalDetails()
        ]);
        
        setPropertyDetails(propertyRes.data || {
          address: '123 Main Street, Apt 4B',
          city: 'Boise',
          state: 'ID',
          zipCode: '83702',
          bedrooms: 2,
          bathrooms: 2,
          squareFeet: 1200,
          monthlyRent: 1500,
          securityDeposit: 1500,
          availableDate: '2026-03-01'
        });
        
        setApprovalDetails(approvalRes.data || {
          verifiedIncome: 5500,
          monthlyRent: 1500,
          utilities: 150,
          internet: 80,
          totalMonthlyExpense: 1730,
          incomeToRentRatio: 3.67,
          approved: true
        });
      } catch (err) {
        console.error('Failed to fetch details:', err);
        // Use mock data if API fails
        setPropertyDetails({
          address: '123 Main Street, Apt 4B',
          city: 'Boise',
          state: 'ID',
          zipCode: '83702',
          bedrooms: 2,
          bathrooms: 2,
          squareFeet: 1200,
          monthlyRent: 1500,
          securityDeposit: 1500,
          availableDate: '2026-03-01'
        });
        
        setApprovalDetails({
          verifiedIncome: 5500,
          monthlyRent: 1500,
          utilities: 150,
          internet: 80,
          totalMonthlyExpense: 1730,
          incomeToRentRatio: 3.67,
          approved: true
        });
      }
    };

    fetchDetails();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
    }
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    setSignatureData(canvas.toDataURL());
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
  };

  const handleSubmit = async () => {
    if (!signatureData) {
      setError('Please provide your signature before submitting.');
      return;
    }

    if (!agreed) {
      setError('You must agree to the terms and conditions.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await approvalAPI.submitSignature({ signature: signatureData });
      await approvalAPI.finalizeAgreement();
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit agreement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!propertyDetails || !approvalDetails) {
    return (
      <>
        <Navbar />
        <div className="loading">Loading approval details...</div>
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
            <Card>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--success-color)' }}>
                Congratulations!
              </h1>
              <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Your rental application has been approved and finalized!
              </p>
              
              <div style={{ 
                backgroundColor: 'var(--background)', 
                padding: '2rem', 
                borderRadius: '0.5rem',
                marginBottom: '2rem'
              }}>
                <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Next Steps:</h3>
                <ol style={{ textAlign: 'left', paddingLeft: '1.5rem', lineHeight: '2' }}>
                  <li>You will receive a copy of your signed agreement via email</li>
                  <li>The landlord will contact you within 24 hours to arrange key pickup</li>
                  <li>Security deposit payment instructions will be sent to you</li>
                  <li>Move-in date: {new Date(propertyDetails.availableDate).toLocaleDateString()}</li>
                </ol>
              </div>

              <Button onClick={() => navigate('/dashboard')}>
                Return to Dashboard
              </Button>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="container" style={{ maxWidth: '900px' }}>
          <Card>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              Application Approval & Agreement
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Review your application details and sign the rental agreement to finalize your approval.
            </p>
          </Card>

          {approvalDetails.approved && (
            <div style={{ 
              backgroundColor: '#D1FAE5',
              border: '2px solid var(--success-color)',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <h2 style={{ color: '#065F46', fontSize: '1.5rem', fontWeight: 700 }}>
                ✅ You are Pre-Approved!
              </h2>
              <p style={{ color: '#065F46', marginTop: '0.5rem' }}>
                Your application has been reviewed and approved. Complete the signing process below.
              </p>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <Card title="Property Details">
            <div className="grid grid-2">
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Address</h4>
                <p>{propertyDetails.address}</p>
                <p>{propertyDetails.city}, {propertyDetails.state} {propertyDetails.zipCode}</p>
              </div>
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Unit Details</h4>
                <p>{propertyDetails.bedrooms} Bedrooms, {propertyDetails.bathrooms} Bathrooms</p>
                <p>{propertyDetails.squareFeet} sq ft</p>
              </div>
            </div>

            <div style={{ 
              marginTop: '1.5rem', 
              paddingTop: '1.5rem', 
              borderTop: '1px solid var(--border-color)' 
            }}>
              <div className="grid grid-2">
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Monthly Rent</h4>
                  <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                    ${propertyDetails.monthlyRent.toLocaleString()}/mo
                  </p>
                </div>
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Security Deposit</h4>
                  <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                    ${propertyDetails.securityDeposit.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Available From</h4>
              <p>{new Date(propertyDetails.availableDate).toLocaleDateString()}</p>
            </div>
          </Card>

          <Card title="Financial Summary">
            <div style={{ backgroundColor: 'var(--background)', padding: '1.5rem', borderRadius: '0.375rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 500 }}>Verified Monthly Income:</span>
                <span style={{ fontWeight: 700, color: 'var(--success-color)' }}>
                  ${approvalDetails.verifiedIncome.toLocaleString()}
                  <span className="checkmark" style={{ marginLeft: '0.5rem' }}>✓</span>
                </span>
              </div>

              <div style={{ 
                marginTop: '1.5rem', 
                paddingTop: '1.5rem', 
                borderTop: '1px solid var(--border-color)' 
              }}>
                <h4 style={{ fontWeight: 600, marginBottom: '1rem' }}>Monthly Expenses</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Rent:</span>
                  <span>${approvalDetails.monthlyRent.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Estimated Utilities:</span>
                  <span>${approvalDetails.utilities.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Internet/Cable:</span>
                  <span>${approvalDetails.internet.toLocaleString()}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '2px solid var(--border-color)',
                  fontSize: '1.125rem',
                  fontWeight: 700
                }}>
                  <span>Total Monthly Expenses:</span>
                  <span>${approvalDetails.totalMonthlyExpense.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ 
                marginTop: '1.5rem', 
                padding: '1rem',
                backgroundColor: '#D1FAE5',
                borderRadius: '0.375rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: '#065F46' }}>Income-to-Rent Ratio:</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#065F46' }}>
                    {approvalDetails.incomeToRentRatio.toFixed(2)}x
                    <span className="checkmark" style={{ marginLeft: '0.5rem' }}>✓</span>
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#065F46', marginTop: '0.5rem' }}>
                  Excellent! Your income is {approvalDetails.incomeToRentRatio.toFixed(2)} times the monthly rent.
                </p>
              </div>
            </div>
          </Card>

          <Card title="Rental Agreement">
            <div style={{ 
              backgroundColor: 'var(--background)', 
              padding: '1.5rem', 
              borderRadius: '0.375rem',
              maxHeight: '300px',
              overflowY: 'auto',
              fontSize: '0.875rem',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ fontWeight: 600, marginBottom: '1rem' }}>RESIDENTIAL LEASE AGREEMENT</h4>
              
              <p style={{ marginBottom: '1rem' }}>
                This Residential Lease Agreement ("Agreement") is entered into as of {new Date().toLocaleDateString()}, 
                between the Landlord and the Tenant for the property located at {propertyDetails.address}, 
                {propertyDetails.city}, {propertyDetails.state} {propertyDetails.zipCode}.
              </p>

              <p style={{ marginBottom: '1rem' }}>
                <strong>1. TERM:</strong> The term of this lease shall commence on {new Date(propertyDetails.availableDate).toLocaleDateString()} 
                and continue for a period of twelve (12) months.
              </p>

              <p style={{ marginBottom: '1rem' }}>
                <strong>2. RENT:</strong> Tenant agrees to pay ${propertyDetails.monthlyRent.toLocaleString()} per month, 
                due on the first day of each month.
              </p>

              <p style={{ marginBottom: '1rem' }}>
                <strong>3. SECURITY DEPOSIT:</strong> Tenant shall deposit with Landlord the sum of 
                ${propertyDetails.securityDeposit.toLocaleString()} as security for the performance of Tenant's obligations.
              </p>

              <p style={{ marginBottom: '1rem' }}>
                <strong>4. USE OF PREMISES:</strong> The premises shall be used and occupied by Tenant exclusively as a 
                private single-family residence.
              </p>

              <p style={{ marginBottom: '1rem' }}>
                <strong>5. MAINTENANCE AND REPAIRS:</strong> Tenant will keep the premises in clean and sanitary condition 
                and promptly notify Landlord of any needed repairs.
              </p>

              <p style={{ marginBottom: '1rem' }}>
                <strong>6. UTILITIES:</strong> Tenant shall be responsible for payment of all utilities and services, 
                except as otherwise provided.
              </p>

              <p style={{ marginBottom: '1rem' }}>
                <strong>7. DEFAULT:</strong> If Tenant fails to comply with any of the terms of this Agreement, 
                or abandons the premises, Tenant shall be in default.
              </p>

              <p>
                Additional terms and conditions apply as outlined in the full agreement provided separately.
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'start', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  style={{ marginRight: '0.75rem', marginTop: '0.25rem' }}
                />
                <span>
                  I have read and agree to the terms and conditions of this Rental Agreement. I understand that 
                  my electronic signature below has the same legal effect as a handwritten signature.
                </span>
              </label>
            </div>

            <h4 style={{ fontWeight: 600, marginBottom: '1rem' }}>Tenant Signature</h4>
            <div style={{ marginBottom: '1rem' }}>
              <canvas
                ref={canvasRef}
                width={700}
                height={200}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                style={{
                  border: '2px solid var(--border-color)',
                  borderRadius: '0.375rem',
                  cursor: 'crosshair',
                  width: '100%',
                  maxWidth: '700px',
                  backgroundColor: '#fff'
                }}
              />
            </div>
            <Button variant="secondary" onClick={clearSignature} style={{ marginBottom: '1rem' }}>
              Clear Signature
            </Button>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Date: {new Date().toLocaleDateString()}
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
              <Button variant="secondary" onClick={() => navigate('/background-check')}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={loading || !agreed || !signatureData}>
                {loading ? 'Submitting...' : 'Finalize Agreement'}
              </Button>
            </div>
          </Card>

          <FCRANotice />
        </div>
      </div>
    </>
  );
};

export default Approval;
