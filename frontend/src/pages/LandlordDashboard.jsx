import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const LandlordDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications');

  useEffect(() => {
    if (user?.role !== 'landlord' && user?.role !== 'admin') {
      navigate('/home');
      return;
    }
    
    fetchApplications();
    fetchAnalytics();
  }, []);

  const fetchApplications = async () => {
    try {
      // Mock token - in production this would come from login
      const token = 'mock-token';
      const response = await axios.get(`${API_BASE_URL}/landlord/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      // Mock data fallback
      setApplications([
        {
          id: 1,
          email: 'tenant1@example.com',
          drivers_license: 'ABC123456',
          status: 'PENDING_LANDLORD_REVIEW',
          current_stage: 4,
          total_stages: 5,
          flags_count: 1,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          email: 'tenant2@example.com',
          drivers_license: 'XYZ789012',
          status: 'APPROVED',
          current_stage: 5,
          total_stages: 5,
          flags_count: 0,
          created_at: new Date().toISOString()
        }
      ]);
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = 'mock-token';
      const response = await axios.get(`${API_BASE_URL}/landlord/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalytics({
        total_applications: 10,
        approved_count: 6,
        denied_count: 2,
        pending_count: 2,
        flagged_count: 3
      });
    }
  };

  const handleReviewApplication = (app) => {
    setSelectedApp(app);
  };

  const handleApprove = async (reasoning) => {
    if (!selectedApp) return;
    
    try {
      const token = 'mock-token';
      await axios.post(
        `${API_BASE_URL}/landlord/applications/${selectedApp.id}/review`,
        {
          decision: 'APPROVED',
          reasoning: reasoning || 'Application meets all criteria'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('Application approved successfully');
      setSelectedApp(null);
      fetchApplications();
    } catch (error) {
      console.error('Error approving application:', error);
      alert('Approved (mock mode - backend unavailable)');
      setSelectedApp(null);
    }
  };

  const handleDeny = async (reasoning) => {
    if (!selectedApp) return;
    
    try {
      const token = 'mock-token';
      await axios.post(
        `${API_BASE_URL}/landlord/applications/${selectedApp.id}/review`,
        {
          decision: 'DENIED',
          reasoning: reasoning || 'Application does not meet criteria'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('Application denied successfully');
      setSelectedApp(null);
      fetchApplications();
    } catch (error) {
      console.error('Error denying application:', error);
      alert('Denied (mock mode - backend unavailable)');
      setSelectedApp(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    const colors = {
      'APPROVED': '#4caf50',
      'DENIED': '#f44336',
      'PENDING_LANDLORD_REVIEW': '#ff9800',
      'PENDING': '#2196f3',
      'BACKGROUND_CHECK': '#9c27b0',
      'EMPLOYMENT_VERIFICATION': '#3f51b5',
      'IDENTITY_VERIFICATION': '#00bcd4'
    };
    return colors[status] || '#9e9e9e';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Navigation Bar */}
      <nav style={{
        backgroundColor: '#1976d2',
        padding: '1rem 2rem',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        {/* Tabs */}
        <div style={{ marginBottom: '2rem', borderBottom: '2px solid #ddd' }}>
          <button
            onClick={() => setActiveTab('applications')}
            style={{
              padding: '1rem 2rem',
              backgroundColor: activeTab === 'applications' ? '#1976d2' : 'transparent',
              color: activeTab === 'applications' ? 'white' : '#666',
              border: 'none',
              borderBottom: activeTab === 'applications' ? '3px solid #1976d2' : 'none',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '1rem'
            }}
          >
            Applications
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              padding: '1rem 2rem',
              backgroundColor: activeTab === 'analytics' ? '#1976d2' : 'transparent',
              color: activeTab === 'analytics' ? 'white' : '#666',
              border: 'none',
              borderBottom: activeTab === 'analytics' ? '3px solid #1976d2' : 'none',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '1rem'
            }}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            style={{
              padding: '1rem 2rem',
              backgroundColor: activeTab === 'policies' ? '#1976d2' : 'transparent',
              color: activeTab === 'policies' ? 'white' : '#666',
              border: 'none',
              borderBottom: activeTab === 'policies' ? '3px solid #1976d2' : 'none',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '1rem'
            }}
          >
            Screening Policies
          </button>
        </div>

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Tenant Applications</h2>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid #e3f2fd', borderTop: '4px solid #1976d2', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              </div>
            ) : applications.length === 0 ? (
              <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '8px', textAlign: 'center', color: '#666' }}>
                No applications yet
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {applications.map(app => (
                  <div key={app.id} style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                        {app.email}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
                        Application ID: {app.id} | License: {app.drivers_license?.substring(0, 4)}****
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: getStatusColor(app.status),
                          color: 'white',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {app.status.replace(/_/g, ' ')}
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#666' }}>
                          Stage {app.current_stage}/{app.total_stages}
                        </span>
                        {app.flags_count > 0 && (
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: '#ff9800',
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {app.flags_count} Flag{app.flags_count > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      {app.status === 'PENDING_LANDLORD_REVIEW' && (
                        <button
                          onClick={() => handleReviewApplication(app)}
                          style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                        >
                          Review
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analytics && (
          <div>
            <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Application Analytics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1976d2', marginBottom: '0.5rem' }}>
                  {analytics.total_applications}
                </div>
                <div style={{ color: '#666' }}>Total Applications</div>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4caf50', marginBottom: '0.5rem' }}>
                  {analytics.approved_count}
                </div>
                <div style={{ color: '#666' }}>Approved</div>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f44336', marginBottom: '0.5rem' }}>
                  {analytics.denied_count}
                </div>
                <div style={{ color: '#666' }}>Denied</div>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff9800', marginBottom: '0.5rem' }}>
                  {analytics.pending_count}
                </div>
                <div style={{ color: '#666' }}>Pending Review</div>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9c27b0', marginBottom: '0.5rem' }}>
                  {analytics.flagged_count}
                </div>
                <div style={{ color: '#666' }}>Flagged</div>
              </div>
            </div>
          </div>
        )}

        {/* Policies Tab */}
        {activeTab === 'policies' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Screening Policies</h2>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                Configure your automated screening criteria. Applications that don't meet these criteria will be flagged for manual review.
              </p>
              <div style={{ backgroundColor: '#e3f2fd', padding: '1rem', borderRadius: '4px', fontSize: '0.875rem', color: '#1976d2' }}>
                <strong>Coming Soon:</strong> Full screening policy management interface
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedApp && (
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
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Review Application</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <p><strong>Email:</strong> {selectedApp.email}</p>
              <p><strong>License:</strong> {selectedApp.drivers_license}</p>
              <p><strong>Status:</strong> {selectedApp.status}</p>
              <p><strong>Stages Completed:</strong> {selectedApp.current_stage}/{selectedApp.total_stages}</p>
              {selectedApp.flags_count > 0 && (
                <p style={{ color: '#ff9800', fontWeight: 'bold' }}>
                  <strong>Flags:</strong> {selectedApp.flags_count} issue(s) requiring review
                </p>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Decision Reasoning (optional):
              </label>
              <textarea
                id="reasoning"
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your reasoning for this decision..."
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => {
                  const reasoning = document.getElementById('reasoning').value;
                  handleApprove(reasoning);
                }}
                style={{
                  flex: 1,
                  padding: '1rem',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Approve
              </button>
              <button
                onClick={() => {
                  const reasoning = document.getElementById('reasoning').value;
                  handleDeny(reasoning);
                }}
                style={{
                  flex: 1,
                  padding: '1rem',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Deny
              </button>
              <button
                onClick={() => setSelectedApp(null)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  backgroundColor: 'white',
                  color: '#666',
                  border: '2px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LandlordDashboard;
