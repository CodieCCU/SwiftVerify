import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VerificationResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};

  const {
    approved = false,
    licenseNumber = 'N/A',
    propertyName = 'N/A',
    unitNumber = 'N/A',
    tenantIncome = 0,
    apartmentCost = 0,
    gapWaiverNeeded = false,
    additionalFundingProvided = false,
    fundingAmount = 0,
    message = 'No verification data available'
  } = data;

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      {/* Header with approval/denial status */}
      <div style={{
        backgroundColor: approved ? '#d4edda' : '#f8d7da',
        color: approved ? '#155724' : '#721c24',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0 }}>
          {approved ? '✓ Verification Approved' : '✗ Verification Denied'}
        </h1>
        <p style={{ margin: '10px 0 0 0', fontSize: '18px' }}>{message}</p>
      </div>

      {/* License Information */}
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2 style={{ marginTop: 0 }}>License Information</h2>
        <div style={{ lineHeight: '1.8' }}>
          <strong>License Number:</strong> {licenseNumber}
        </div>
      </div>

      {/* Property Information */}
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2 style={{ marginTop: 0 }}>Property Information</h2>
        <div style={{ lineHeight: '1.8' }}>
          <div><strong>Property Name:</strong> {propertyName}</div>
          <div><strong>Unit Number:</strong> {unitNumber}</div>
          <div><strong>Monthly Rent:</strong> ${apartmentCost.toLocaleString()}</div>
        </div>
      </div>

      {/* Income and Financial Information */}
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2 style={{ marginTop: 0 }}>Income & Financial Details</h2>
        <div style={{ lineHeight: '1.8' }}>
          <div><strong>Tenant Monthly Income:</strong> ${tenantIncome.toLocaleString()}</div>
          <div><strong>Income-to-Rent Ratio:</strong> {
            apartmentCost > 0 
              ? ((tenantIncome / apartmentCost) * 100).toFixed(2) + '%'
              : 'N/A'
          }</div>
        </div>
      </div>

      {/* SwiftVerify Assistance */}
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2 style={{ marginTop: 0 }}>SwiftVerify Assistance</h2>
        <div style={{ lineHeight: '1.8' }}>
          <div>
            <strong>Gap Waiver:</strong> {
              gapWaiverNeeded 
                ? <span style={{ color: '#28a745' }}>✓ Approved</span>
                : <span style={{ color: '#6c757d' }}>Not Required</span>
            }
          </div>
          {gapWaiverNeeded && (
            <div style={{ marginTop: '5px', fontSize: '14px', color: '#666' }}>
              SwiftVerify will cover the income gap to meet rental requirements.
            </div>
          )}
          
          <div style={{ marginTop: '10px' }}>
            <strong>Additional Funding:</strong> {
              additionalFundingProvided
                ? <span style={{ color: '#28a745' }}>✓ ${fundingAmount.toLocaleString()} Provided</span>
                : <span style={{ color: '#6c757d' }}>Not Provided</span>
            }
          </div>
          {additionalFundingProvided && (
            <div style={{ marginTop: '5px', fontSize: '14px', color: '#666' }}>
              SwiftVerify will provide additional funding to support your rental application.
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        justifyContent: 'center',
        marginTop: '30px'
      }}>
        <button
          onClick={() => navigate('/home')}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Return to Home
        </button>
        {!approved && (
          <button
            onClick={() => navigate('/drivers-license')}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default VerificationResult;
