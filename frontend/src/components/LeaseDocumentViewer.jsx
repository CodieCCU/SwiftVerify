import React from 'react';

const LeaseDocumentViewer = ({ documentUrl, propertyAddress, rent, leaseTerms }) => {
  // In production, this would integrate with a PDF viewer library
  // For now, we'll create a mock lease document display
  
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid #333'
      }}>
        <h2 style={{
          margin: '0 0 0.5rem 0',
          fontSize: '1.75rem',
          color: '#333'
        }}>
          RESIDENTIAL LEASE AGREEMENT
        </h2>
        <p style={{
          margin: 0,
          color: '#666',
          fontSize: '0.875rem'
        }}>
          Boise, Idaho
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{
          fontSize: '1.25rem',
          color: '#333',
          marginBottom: '1rem'
        }}>
          Property Details
        </h3>
        <div style={{
          padding: '1rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '6px'
        }}>
          <p style={{ margin: '0.5rem 0' }}>
            <strong>Property Address:</strong> {propertyAddress}
          </p>
          <p style={{ margin: '0.5rem 0' }}>
            <strong>Monthly Rent:</strong> ${rent?.toLocaleString()}/month
          </p>
          <p style={{ margin: '0.5rem 0' }}>
            <strong>Lease Term:</strong> {leaseTerms?.duration || '12 months'}
          </p>
          <p style={{ margin: '0.5rem 0' }}>
            <strong>Start Date:</strong> {leaseTerms?.startDate || new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{
          fontSize: '1.25rem',
          color: '#333',
          marginBottom: '1rem'
        }}>
          Terms and Conditions
        </h3>
        <div style={{
          fontSize: '0.875rem',
          lineHeight: '1.6',
          color: '#555'
        }}>
          <p><strong>1. Rent Payment:</strong> Tenant agrees to pay ${rent?.toLocaleString()} on the 1st of each month.</p>
          <p><strong>2. Security Deposit:</strong> A security deposit equal to one month's rent is required.</p>
          <p><strong>3. Utilities:</strong> Tenant is responsible for all utilities unless otherwise specified.</p>
          <p><strong>4. Maintenance:</strong> Tenant agrees to maintain the property in good condition.</p>
          <p><strong>5. Pets:</strong> {leaseTerms?.petsAllowed ? 'Pets allowed with additional deposit.' : 'No pets allowed without prior written consent.'}</p>
          <p><strong>6. Termination:</strong> Either party may terminate with 30 days written notice.</p>
          <p><strong>7. Late Fees:</strong> A late fee of $50 will be charged for rent paid after the 5th of the month.</p>
          <p><strong>8. Smoking:</strong> Smoking is prohibited inside the property.</p>
        </div>
      </div>

      <div style={{
        padding: '1.5rem',
        backgroundColor: '#e3f2fd',
        borderRadius: '6px',
        marginTop: '2rem'
      }}>
        <p style={{
          margin: 0,
          fontSize: '0.875rem',
          color: '#1976d2',
          lineHeight: '1.6'
        }}>
          <strong>Important:</strong> Please read this lease agreement carefully. By signing below, you acknowledge that you have read, understood, and agree to all terms and conditions outlined in this document.
        </p>
      </div>
    </div>
  );
};

export default LeaseDocumentViewer;
