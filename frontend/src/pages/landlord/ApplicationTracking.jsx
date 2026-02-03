import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicationCard from '../../components/ApplicationCard';

const ApplicationTracking = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock applications data
  const applications = [
    {
      id: 1,
      applicantName: 'John Doe',
      email: 'john.doe@email.com',
      propertyAddress: '123 Main Street',
      applicationDate: '2026-02-01',
      status: 'approved',
      incomeVerified: true,
      backgroundCheckPassed: true,
      leaseSent: false
    },
    {
      id: 2,
      applicantName: 'Jane Smith',
      email: 'jane.smith@email.com',
      propertyAddress: '456 Oak Avenue',
      applicationDate: '2026-02-02',
      status: 'pending',
      incomeVerified: true,
      backgroundCheckPassed: true,
      leaseSent: false
    },
    {
      id: 3,
      applicantName: 'Bob Johnson',
      email: 'bob.johnson@email.com',
      propertyAddress: '789 Pine Drive',
      applicationDate: '2026-01-30',
      status: 'lease_sent',
      incomeVerified: true,
      backgroundCheckPassed: true,
      leaseSent: true
    },
    {
      id: 4,
      applicantName: 'Alice Williams',
      email: 'alice.w@email.com',
      propertyAddress: '321 Elm Court',
      applicationDate: '2026-01-28',
      status: 'denied',
      incomeVerified: false,
      backgroundCheckPassed: true,
      leaseSent: false
    },
    {
      id: 5,
      applicantName: 'Charlie Brown',
      email: 'charlie.b@email.com',
      propertyAddress: '654 Maple Lane',
      applicationDate: '2026-01-25',
      status: 'lease_signed',
      incomeVerified: true,
      backgroundCheckPassed: true,
      leaseSent: true
    }
  ];

  const filteredApplications = filterStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === filterStatus);

  const handleLogout = () => {
    sessionStorage.removeItem('landlordAuth');
    sessionStorage.removeItem('landlordEmail');
    navigate('/landlord/login');
  };

  const handleSendLease = (applicationId) => {
    alert(`Lease sent to applicant ${applicationId}. In production, this would trigger email with lease document.`);
  };

  const handleViewDetails = (applicationId) => {
    alert(`Viewing details for application ${applicationId}. In production, this would open a detailed view.`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a2e' }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#16213e',
        padding: '1rem 2rem',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#e94560',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem'
          }}>
            🏢
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>Landlord Portal</h1>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#a0a0a0' }}>SwiftVerify</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/landlord/dashboard')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}
          >
            ← Dashboard
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#e94560',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            margin: '0 0 0.5rem 0',
            fontSize: '2rem',
            color: 'white',
            fontWeight: '700'
          }}>
            Application Tracking
          </h2>
          <p style={{
            margin: 0,
            color: '#a0a0a0',
            fontSize: '0.875rem'
          }}>
            Monitor and manage all tenant applications
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{
          backgroundColor: '#16213e',
          padding: '1rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            {[
              { value: 'all', label: 'All Applications' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'lease_sent', label: 'Lease Sent' },
              { value: 'lease_signed', label: 'Lease Signed' },
              { value: 'denied', label: 'Denied' }
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilterStatus(value)}
                style={{
                  padding: '0.75rem 1.25rem',
                  backgroundColor: filterStatus === value ? '#e94560' : '#0f3460',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s'
                }}
              >
                {label}
                <span style={{
                  marginLeft: '0.5rem',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '10px',
                  fontSize: '0.75rem'
                }}>
                  {value === 'all' ? applications.length : applications.filter(app => app.status === value).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        <div style={{
          backgroundColor: '#16213e',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '1.5rem',
              color: 'white',
              fontWeight: '600'
            }}>
              {filterStatus === 'all' ? 'All Applications' : `${filterStatus.replace('_', ' ').toUpperCase()} Applications`}
            </h3>
            <div style={{
              color: '#a0a0a0',
              fontSize: '0.875rem'
            }}>
              {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
            </div>
          </div>

          {filteredApplications.length > 0 ? (
            <div>
              {filteredApplications.map(application => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onSendLease={handleSendLease}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#a0a0a0'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
              <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>No Applications Found</h3>
              <p>There are no applications with the selected status</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#16213e',
        color: 'white',
        padding: '2rem',
        textAlign: 'center',
        marginTop: '4rem',
        borderTop: '1px solid rgba(233, 69, 96, 0.2)'
      }}>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem' }}>
          © 2026 SwiftVerify - Landlord Portal
        </p>
      </footer>
    </div>
  );
};

export default ApplicationTracking;
