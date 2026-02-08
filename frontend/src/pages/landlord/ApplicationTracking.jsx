import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPropertyApplications, sendLease, setWaiver } from '../../services/landlord';
import { validateWaiverAmount } from '../../utils/validators';

const ApplicationTracking = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [waiverAmount, setWaiverAmount] = useState('');
  const [showWaiverModal, setShowWaiverModal] = useState(false);

  useEffect(() => {
    if (propertyId) {
      fetchApplications();
    }
  }, [propertyId]);

  const fetchApplications = async () => {
    const result = await getPropertyApplications(propertyId || 'all');
    if (result.success) {
      setApplications(result.applications);
    }
  };

  const handleSendLease = async (applicationId) => {
    const result = await sendLease({ applicationId });
    if (result.success) {
      alert('Lease sent successfully!');
      fetchApplications();
    }
  };

  const handleSetWaiver = async (applicationId) => {
    const amount = parseFloat(waiverAmount);
    
    if (!validateWaiverAmount(amount)) {
      alert('Waiver amount must be between $0.01 and $200.00');
      return;
    }
    
    if (amount > 200) {
      alert('Waiver amounts above $200 are automatically handled by SwiftVerify');
      return;
    }
    
    const result = await setWaiver({ applicationId, waiverAmount: amount });
    if (result.success) {
      alert(`Waiver amount of $${amount.toFixed(2)} set successfully`);
      setShowWaiverModal(false);
      setWaiverAmount('');
      fetchApplications();
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'APPROVED': '#4caf50',
      'DENIED': '#f44336',
      'PENDING': '#ff9800',
    };
    return colors[status] || '#757575';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#1976d2',
        padding: '1rem 2rem',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>Application Tracking</h1>
        <button
          onClick={() => navigate('/landlord/dashboard')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'white',
            color: '#1976d2',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          ← Back to Dashboard
        </button>
      </nav>

      <div style={{
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '0 1rem',
      }}>
        {/* NO CREDIT CHECK Reminder */}
        <div style={{
          backgroundColor: '#fff3cd',
          border: '2px solid #ffc107',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '2rem',
        }}>
          <p style={{ margin: 0, color: '#856404', fontWeight: '600' }}>
            🚫💳 NO CREDIT CHECK - All decisions based on identity, employment, and income only
          </p>
        </div>

        <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '2rem' }}>
          Tenant Applications
        </h2>

        {/* Applications List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {applications.map(app => (
            <div
              key={app.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                paddingBottom: '1rem',
                borderBottom: '2px solid #f0f0f0',
              }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.5rem', color: '#333' }}>
                    {app.tenantName}
                  </h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                    📧 {app.tenantEmail}
                  </p>
                </div>
                <div style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  backgroundColor: getStatusColor(app.status),
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                }}>
                  {app.status}
                </div>
              </div>

              {/* Verification Details */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem',
              }}>
                <div>
                  <p style={{ margin: '0 0 0.25rem', fontSize: '0.875rem', color: '#666' }}>
                    Identity Verified
                  </p>
                  <p style={{ margin: 0, fontSize: '1.1rem', color: app.identityVerified ? '#4caf50' : '#999' }}>
                    {app.identityVerified ? '✅ Yes' : '⏳ Pending'}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 0.25rem', fontSize: '0.875rem', color: '#666' }}>
                    Employment Verified
                  </p>
                  <p style={{ margin: 0, fontSize: '1.1rem', color: app.employmentVerified ? '#4caf50' : '#999' }}>
                    {app.employmentVerified ? '✅ ' + app.employer : '⏳ Pending'}
                  </p>
                </div>
                {app.monthlyIncome && (
                  <div>
                    <p style={{ margin: '0 0 0.25rem', fontSize: '0.875rem', color: '#666' }}>
                      Monthly Income (NO CREDIT)
                    </p>
                    <p style={{ margin: 0, fontSize: '1.1rem', color: '#333', fontWeight: '600' }}>
                      ${app.monthlyIncome?.toLocaleString()}
                    </p>
                  </div>
                )}
                <div>
                  <p style={{ margin: '0 0 0.25rem', fontSize: '0.875rem', color: '#666' }}>
                    Background Check
                  </p>
                  <p style={{ margin: 0, fontSize: '1.1rem', color: app.backgroundChecked ? '#4caf50' : '#999' }}>
                    {app.backgroundChecked ? '✅ Clear' : '⏳ Pending'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              {app.status === 'APPROVED' && (
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #e0e0e0',
                }}>
                  <button
                    onClick={() => {
                      setSelectedApp(app.id);
                      setShowWaiverModal(true);
                    }}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#ff9800',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '600',
                    }}
                  >
                    Set Waiver ($0.01-$200)
                  </button>
                  <button
                    onClick={() => handleSendLease(app.id)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '600',
                    }}
                  >
                    Send Lease
                  </button>
                </div>
              )}

              <p style={{ margin: '1rem 0 0', fontSize: '0.875rem', color: '#999' }}>
                Submitted: {new Date(app.submittedDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {applications.length === 0 && (
          <div style={{
            backgroundColor: 'white',
            padding: '3rem',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
            <h3 style={{ color: '#666' }}>No applications yet</h3>
            <p style={{ color: '#999' }}>Applications will appear here when tenants submit them</p>
          </div>
        )}
      </div>

      {/* Waiver Modal */}
      {showWaiverModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '100%',
          }}>
            <h3 style={{ marginTop: 0, color: '#1976d2' }}>Set Waiver Amount</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              Enter waiver amount between $0.01 and $200.00
            </p>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Waiver Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="200"
                value={waiverAmount}
                onChange={(e) => setWaiverAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{
              backgroundColor: '#fff3cd',
              padding: '1rem',
              borderRadius: '4px',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              color: '#856404',
            }}>
              ⚠️ Waivers above $200 are automatically handled by SwiftVerify
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => handleSetWaiver(selectedApp)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Set Waiver
              </button>
              <button
                onClick={() => {
                  setShowWaiverModal(false);
                  setWaiverAmount('');
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: 'white',
                  color: '#666',
                  border: '2px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationTracking;
