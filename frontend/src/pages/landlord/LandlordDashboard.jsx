import React from 'react';

const LandlordDashboard = () => {
  // Mock data for demonstration
  const applications = [
    {
      id: 1,
      tenantName: 'John Doe',
      propertyAddress: '123 Main St, Boise, ID',
      status: 'APPROVED',
      identityVerified: true,
      employmentVerified: true,
      backgroundChecked: true,
      monthlyIncome: 5500,
      employer: 'Tech Corp Inc',
      submittedDate: '2026-02-01'
    },
    {
      id: 2,
      tenantName: 'Jane Smith',
      propertyAddress: '456 Oak Ave, Boise, ID',
      status: 'EMPLOYMENT_VERIFIED',
      identityVerified: true,
      employmentVerified: true,
      backgroundChecked: false,
      monthlyIncome: 4800,
      employer: 'Local Business LLC',
      submittedDate: '2026-02-03'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'APPROVED': '#4caf50',
      'DENIED': '#f44336',
      'IDENTITY_VERIFIED': '#2196f3',
      'EMPLOYMENT_VERIFIED': '#2196f3',
      'BACKGROUND_CHECKED': '#2196f3',
      'LANDLORD_REVIEW_REQUIRED': '#ff9800',
      'SUBMITTED': '#757575'
    };
    return colors[status] || '#757575';
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
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>SwiftVerify Landlord Portal</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>NO CREDIT CHECK System</span>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* NO CREDIT CHECK Notice - Prominent Display */}
        <div style={{
          backgroundColor: '#fff3cd',
          border: '3px solid #ffc107',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '2.5rem' }}>🚫💳</div>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: '0 0 0.5rem', color: '#856404', fontSize: '1.5rem', fontWeight: '700' }}>
                NO CREDIT CHECK REMINDER
              </h2>
              <p style={{ margin: '0 0 0.5rem', color: '#856404', fontSize: '1rem', lineHeight: '1.5' }}>
                <strong>This is a NO CREDIT CHECK system.</strong> You have agreed not to conduct credit checks on SwiftVerify tenants.
              </p>
              <p style={{ margin: 0, color: '#856404', fontSize: '0.9rem', lineHeight: '1.4' }}>
                ✓ Approved based on: Identity + Employment/Income + Background (optional)<br/>
                ✗ Credit checks violate your service agreement and may result in account termination
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Title */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '0.5rem' }}>
            Tenant Applications
          </h2>
          <p style={{ color: '#666', fontSize: '1rem' }}>
            Review applications based on verified identity, employment, and income only.
          </p>
        </div>

        {/* Application List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {applications.map(app => (
            <div
              key={app.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0'
              }}
            >
              {/* Application Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                paddingBottom: '1rem',
                borderBottom: '2px solid #f0f0f0'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.5rem', color: '#333' }}>
                    {app.tenantName}
                  </h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                    📍 {app.propertyAddress}
                  </p>
                </div>
                <div style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  backgroundColor: getStatusColor(app.status),
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}>
                  {app.status.replace(/_/g, ' ')}
                </div>
              </div>

              {/* Verification Status Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                {/* Identity Verification */}
                <div style={{
                  backgroundColor: app.identityVerified ? '#e8f5e9' : '#fff3e0',
                  padding: '1rem',
                  borderRadius: '6px',
                  border: `2px solid ${app.identityVerified ? '#4caf50' : '#ff9800'}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{app.identityVerified ? '✅' : '⏳'}</span>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#333' }}>Identity Verification</h4>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>
                    {app.identityVerified ? 'Driver\'s license verified' : 'Pending verification'}
                  </p>
                </div>

                {/* Employment Verification */}
                <div style={{
                  backgroundColor: app.employmentVerified ? '#e8f5e9' : '#fff3e0',
                  padding: '1rem',
                  borderRadius: '6px',
                  border: `2px solid ${app.employmentVerified ? '#4caf50' : '#ff9800'}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{app.employmentVerified ? '✅' : '⏳'}</span>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#333' }}>Employment Verified</h4>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>
                    {app.employmentVerified ? app.employer : 'Pending verification'}
                  </p>
                </div>

                {/* Background Check */}
                <div style={{
                  backgroundColor: app.backgroundChecked ? '#e8f5e9' : '#f5f5f5',
                  padding: '1rem',
                  borderRadius: '6px',
                  border: `2px solid ${app.backgroundChecked ? '#4caf50' : '#ccc'}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{app.backgroundChecked ? '✅' : '📋'}</span>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#333' }}>Background Check</h4>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>
                    {app.backgroundChecked ? 'No criminal records found' : 'Optional - not requested'}
                  </p>
                </div>
              </div>

              {/* Income Details - NO CREDIT INFO */}
              <div style={{
                backgroundColor: '#e3f2fd',
                padding: '1rem',
                borderRadius: '6px',
                marginBottom: '1rem'
              }}>
                <h4 style={{ margin: '0 0 0.75rem', fontSize: '1.1rem', color: '#1976d2' }}>
                  Income Information (NO CREDIT CHECK)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <p style={{ margin: '0 0 0.25rem', fontSize: '0.875rem', color: '#666', fontWeight: '600' }}>
                      Monthly Income
                    </p>
                    <p style={{ margin: 0, fontSize: '1.25rem', color: '#333', fontWeight: '700' }}>
                      ${app.monthlyIncome.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 0.25rem', fontSize: '0.875rem', color: '#666', fontWeight: '600' }}>
                      Employer
                    </p>
                    <p style={{ margin: 0, fontSize: '1rem', color: '#333' }}>
                      {app.employer}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 0.25rem', fontSize: '0.875rem', color: '#666', fontWeight: '600' }}>
                      Submitted
                    </p>
                    <p style={{ margin: 0, fontSize: '1rem', color: '#333' }}>
                      {new Date(app.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
                paddingTop: '1rem',
                borderTop: '1px solid #e0e0e0'
              }}>
                <button style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}>
                  Deny
                </button>
                <button style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}>
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Information Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          marginTop: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, color: '#1976d2', fontSize: '1.5rem' }}>
            SwiftVerify Screening Criteria
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div>
              <h4 style={{ color: '#4caf50', margin: '0 0 0.5rem', fontSize: '1.1rem' }}>
                ✓ What We Verify
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '2' }}>
                <li>Identity (driver's license)</li>
                <li>Employment status</li>
                <li>Monthly income</li>
                <li>Criminal background (optional)</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#f44336', margin: '0 0 0.5rem', fontSize: '1.1rem' }}>
                ✗ What We DON'T Verify
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '2' }}>
                <li><strong>Credit scores</strong></li>
                <li><strong>Credit reports</strong></li>
                <li><strong>Credit history</strong></li>
                <li><strong>Payment histories</strong></li>
              </ul>
            </div>
          </div>
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#fff3cd',
            borderRadius: '6px',
            border: '1px solid #ffc107'
          }}>
            <p style={{ margin: 0, color: '#856404', fontSize: '0.9rem', lineHeight: '1.6' }}>
              <strong>⚠️ Reminder:</strong> Conducting credit checks on SwiftVerify tenants violates your service agreement. 
              Base your rental decisions on the verified information provided above only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;
