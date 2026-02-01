import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

const AdminDashboard = () => {
  const [deletionReport, setDeletionReport] = useState(null);
  const [jobLogs, setJobLogs] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch deletion report
      const reportResponse = await fetch(`${apiUrl}/api/deletion-reports?date=${selectedDate}`);
      if (reportResponse.ok) {
        const reportData = await reportResponse.json();
        setDeletionReport(reportData);
      }

      // Fetch deletion job logs
      const jobLogsResponse = await fetch(`${apiUrl}/api/deletion-job-logs?limit=10`);
      if (jobLogsResponse.ok) {
        const jobLogsData = await jobLogsResponse.json();
        setJobLogs(jobLogsData || []);
      }

      // Fetch recent audit logs
      const auditLogsResponse = await fetch(`${apiUrl}/api/audit-logs?limit=20`);
      if (auditLogsResponse.ok) {
        const auditLogsData = await auditLogsResponse.json();
        setAuditLogs(auditLogsData || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessNotifications = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/process-notifications`, {
        method: 'POST',
      });
      if (response.ok) {
        const result = await response.json();
        alert(`Processed ${result.total} notifications: ${result.sent} sent, ${result.failed} failed`);
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error processing notifications:', error);
      alert('Failed to process notifications');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '2rem' }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

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
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>SwiftVerify - Admin Dashboard</h1>
        <div>
          <span style={{ marginRight: '1rem' }}>Admin: {user?.username}</span>
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
        {/* Deletion Report */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, color: '#333' }}>Deletion Report</h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
          {deletionReport && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>Total Deletions</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1976d2' }}>
                  {deletionReport.total_deletions}
                </div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>Successful</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4caf50' }}>
                  {deletionReport.successful_deletions}
                </div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#ffebee', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>Failed</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f44336' }}>
                  {deletionReport.failed_deletions}
                </div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#fff3e0', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>Notifications Sent</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff9800' }}>
                  {deletionReport.notifications_sent}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Actions</h3>
          <button
            onClick={handleProcessNotifications}
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
            Process Pending Notifications
          </button>
        </div>

        {/* Deletion Job Logs */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Recent Deletion Jobs</h3>
          {jobLogs.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Time</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Deleted</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Failed</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jobLogs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>
                        {new Date(log.job_execution_time).toLocaleString()}
                      </td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>
                        {log.records_deleted}
                      </td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>
                        {log.records_failed}
                      </td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          backgroundColor: log.execution_status === 'COMPLETED' ? '#e8f5e9' : '#ffebee',
                          color: log.execution_status === 'COMPLETED' ? '#4caf50' : '#f44336'
                        }}>
                          {log.execution_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: '#666' }}>No deletion jobs recorded yet.</p>
          )}
        </div>

        {/* Audit Logs */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Recent Audit Logs</h3>
          {auditLogs.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Timestamp</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Record ID</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee', fontSize: '0.875rem' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee', fontSize: '0.875rem', fontFamily: 'monospace' }}>
                        {log.record_reference_id.substring(0, 16)}...
                      </td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          backgroundColor: '#e3f2fd',
                          color: '#1976d2'
                        }}>
                          {log.action}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: '#666' }}>No audit logs available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
