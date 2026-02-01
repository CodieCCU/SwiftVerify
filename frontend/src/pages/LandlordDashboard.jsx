import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import axios from 'axios';

const LandlordDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [tenantEmail, setTenantEmail] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  // SECURITY NOTE: Hardcoded landlord ID for demo purposes only
  // In production, this MUST:
  // 1. Come from an authenticated session (JWT token)
  // 2. Be validated on the backend for every request
  // 3. Include proper authorization checks (user can only access their own data)
  const landlordId = 1;

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/landlord/applications?landlord_id=${landlordId}`);
      setApplications(response.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load applications. Please try again.');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateLink = async () => {
    if (!selectedUnit || !tenantEmail) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/landlord/reapplication-link', {
        landlord_id: landlordId,
        unit_id: selectedUnit.unit_id,
        tenant_email: tenantEmail
      });

      const fullLink = `${window.location.origin}/reapply?token=${response.data.token}`;
      setGeneratedLink(fullLink);
    } catch (err) {
      alert('Failed to create reapplication link');
      console.error('Error creating link:', err);
    }
  };

  const closeLinkModal = () => {
    setShowLinkModal(false);
    setSelectedUnit(null);
    setTenantEmail('');
    setGeneratedLink('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    alert('Link copied to clipboard!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#4caf50';
      case 'denied':
        return '#f44336';
      case 'pending':
        return '#ff9800';
      default:
        return '#9e9e9e';
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <nav style={{
        backgroundColor: '#1976d2',
        padding: '1rem 2rem',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>SwiftVerify - Landlord Dashboard</h1>
        <div>
          <span style={{ marginRight: '1rem' }}>Welcome, {user?.username}</span>
          <button
            onClick={handleLogout}
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
            Logout
          </button>
        </div>
      </nav>

      <div style={{
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '0 1rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{ margin: 0, color: '#333' }}>Tenant Applications</h2>
            <button
              onClick={fetchApplications}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Refresh
            </button>
          </div>

          {loading && <p>Loading applications...</p>}
          {error && <p style={{ color: '#f44336' }}>{error}</p>}

          {!loading && !error && applications.length === 0 && (
            <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
              No applications found.
            </p>
          )}

          {!loading && !error && applications.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Property</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Unit</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Rent</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Utilities</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Date</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Contact</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem' }}>{app.property_name}</td>
                      <td style={{ padding: '1rem' }}>{app.unit_number}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          backgroundColor: getStatusColor(app.status) + '20',
                          color: getStatusColor(app.status),
                          fontWeight: '500',
                          fontSize: '0.875rem'
                        }}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>${app.rent_amount.toFixed(2)}</td>
                      <td style={{ padding: '1rem' }}>${app.utilities_cost.toFixed(2)}</td>
                      <td style={{ padding: '1rem' }}>
                        {new Date(app.application_date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#666' }}>
                        {app.email_partial}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {app.status === 'denied' && (
                          <button
                            onClick={() => {
                              setSelectedUnit(app);
                              setShowLinkModal(true);
                            }}
                            style={{
                              padding: '0.5rem 0.75rem',
                              backgroundColor: '#4caf50',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.875rem'
                            }}
                          >
                            Send Reapply Link
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Privacy Notice */}
        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '1rem',
          borderRadius: '4px',
          fontSize: '0.875rem',
          color: '#1976d2'
        }}>
          <strong>Privacy Notice:</strong> Sensitive tenant information (SSN, Driver's License, Personal Addresses) 
          is encrypted and not displayed to protect tenant privacy. Only application status and unit information is shown.
        </div>
      </div>

      {/* Create Link Modal */}
      {showLinkModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ marginTop: 0 }}>Create Reapplication Link</h3>
            
            {selectedUnit && (
              <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <p style={{ margin: '0.25rem 0' }}><strong>Property:</strong> {selectedUnit.property_name}</p>
                <p style={{ margin: '0.25rem 0' }}><strong>Unit:</strong> {selectedUnit.unit_number}</p>
                <p style={{ margin: '0.25rem 0' }}><strong>Rent:</strong> ${selectedUnit.rent_amount.toFixed(2)}</p>
              </div>
            )}

            {!generatedLink ? (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Tenant Email
                  </label>
                  <input
                    type="email"
                    value={tenantEmail}
                    onChange={(e) => setTenantEmail(e.target.value)}
                    placeholder="tenant@example.com"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button
                    onClick={handleCreateLink}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: '#1976d2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Generate Link
                  </button>
                  <button
                    onClick={closeLinkModal}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: '#f5f5f5',
                      color: '#333',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{
                  marginBottom: '1rem',
                  padding: '1rem',
                  backgroundColor: '#e8f5e9',
                  borderRadius: '4px',
                  border: '1px solid #4caf50'
                }}>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#4caf50', fontWeight: '500' }}>
                    Link Generated Successfully!
                  </p>
                  <p style={{ 
                    margin: 0, 
                    wordBreak: 'break-all', 
                    fontSize: '0.875rem',
                    fontFamily: 'monospace',
                    padding: '0.5rem',
                    backgroundColor: 'white',
                    borderRadius: '4px'
                  }}>
                    {generatedLink}
                  </p>
                </div>

                <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#666' }}>
                  <p>• This link will expire in 7 days</p>
                  <p>• It can only be used once</p>
                  <p>• Send this link to: {tenantEmail}</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={copyToClipboard}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={closeLinkModal}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: '#1976d2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Done
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordDashboard;
