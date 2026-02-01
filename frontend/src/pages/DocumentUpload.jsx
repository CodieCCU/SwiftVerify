import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const DocumentUpload = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const [documentType, setDocumentType] = useState('income_proof');
  const [lowDepositMode, setLowDepositMode] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only PDF and image files (JPEG, PNG) are allowed');
        return;
      }
      
      setSelectedFile(file);
      setError('');
      setUploadSuccess(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('documentType', documentType);
      formData.append('lowDepositMode', lowDepositMode);

      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setUploadSuccess(true);
        setSelectedFile(null);
        // Reset file input
        document.getElementById('fileInput').value = '';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleContinue = () => {
    navigate('/drivers-license');
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <nav style={{
        backgroundColor: '#1976d2',
        padding: '1rem 2rem',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>SwiftVerify</h1>
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
        maxWidth: '800px',
        margin: '2rem auto',
        padding: '0 1rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#333' }}>
            Document Upload
          </h2>
          <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Upload supporting documents to expedite your verification process and 
            explore low or no security deposit options.
          </p>

          {uploadSuccess && (
            <div style={{
              backgroundColor: '#e8f5e9',
              color: '#2e7d32',
              padding: '1rem',
              borderRadius: '4px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>✓</span>
              <span>Document uploaded successfully!</span>
            </div>
          )}

          {error && (
            <div style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '1rem',
              borderRadius: '4px',
              marginBottom: '1.5rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleUpload}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={lowDepositMode}
                  onChange={(e) => setLowDepositMode(e.target.checked)}
                  style={{ marginRight: '0.5rem' }}
                />
                <span style={{ color: '#555' }}>
                  Apply for low/no security deposit program
                </span>
              </label>
              
              {lowDepositMode && (
                <div style={{
                  backgroundColor: '#fff3e0',
                  padding: '1rem',
                  borderRadius: '4px',
                  marginBottom: '1rem',
                  fontSize: '0.875rem',
                  color: '#e65100'
                }}>
                  <strong>Low Deposit Program:</strong> Upload proof of steady income 
                  (pay stubs, employment letter, or bank statements) to qualify for 
                  reduced or waived security deposit requirements.
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#555',
                fontWeight: '500'
              }}>
                Document Type
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              >
                <option value="income_proof">Income Proof (Pay Stub/Employment Letter)</option>
                <option value="bank_statement">Bank Statement</option>
                <option value="tax_return">Tax Return</option>
                <option value="other">Other Supporting Document</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#555',
                fontWeight: '500'
              }}>
                Select Document
              </label>
              <input
                id="fileInput"
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ 
                color: '#666', 
                marginTop: '0.5rem',
                fontSize: '0.875rem'
              }}>
                Accepted formats: PDF, JPEG, PNG (Max 10MB)
              </div>
            </div>

            {selectedFile && (
              <div style={{
                backgroundColor: '#f5f5f5',
                padding: '1rem',
                borderRadius: '4px',
                marginBottom: '1.5rem'
              }}>
                <strong>Selected File:</strong> {selectedFile.name}
                <br />
                <span style={{ fontSize: '0.875rem', color: '#666' }}>
                  Size: {(selectedFile.size / 1024).toFixed(2)} KB
                </span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                type="submit"
                disabled={uploading || !selectedFile}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '1rem',
                  backgroundColor: uploading || !selectedFile ? '#ccc' : '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  cursor: uploading || !selectedFile ? 'not-allowed' : 'pointer',
                  fontWeight: '500'
                }}
              >
                {uploading ? 'Uploading...' : 'Upload Document'}
              </button>
              
              <button
                type="button"
                onClick={handleContinue}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '1rem',
                  backgroundColor: 'white',
                  color: '#1976d2',
                  border: '2px solid #1976d2',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                {uploadSuccess ? 'Continue to Verification' : 'Skip for Now'}
              </button>
            </div>
          </form>

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#e3f2fd',
            borderRadius: '4px',
            fontSize: '0.875rem',
            color: '#1976d2'
          }}>
            <strong>🔒 Privacy & Security:</strong> All documents are encrypted during 
            transmission and storage. Your information is kept confidential and used 
            only for verification purposes in compliance with housing regulations.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
