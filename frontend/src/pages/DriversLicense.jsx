import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DriversLicense = () => {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseFile, setLicenseFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLicenseFile(file);
      setError('');
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!licenseNumber.trim()) {
      setError('Please enter a driver\'s license number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/verify-license', {
        licenseNumber: licenseNumber,
        method: 'manual'
      });

      // Navigate to approval/denial screen with verification results
      navigate('/verification-result', { state: response.data });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify license. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (!licenseFile) {
      setError('Please select a license image to scan');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('license', licenseFile);
      formData.append('method', 'scan');

      const response = await axios.post('/api/verify-license', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Navigate to approval/denial screen with verification results
      navigate('/verification-result', { state: response.data });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process license scan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h1>Driver's License Verification</h1>
      <p>Please provide your driver's license information using one of the methods below:</p>

      {error && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          padding: '12px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {/* Manual Input Section */}
      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        padding: '20px', 
        marginBottom: '30px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2 style={{ marginTop: 0 }}>Option 1: Manual Entry</h2>
        <form onSubmit={handleManualSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="licenseNumber" style={{ display: 'block', marginBottom: '5px' }}>
              Driver's License Number:
            </label>
            <input
              id="licenseNumber"
              type="text"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              placeholder="Enter your license number"
              style={{ 
                width: '100%', 
                padding: '10px',
                fontSize: '16px',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Verifying...' : 'Submit License Number'}
          </button>
        </form>
      </div>

      {/* Scan/Upload Section */}
      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        padding: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2 style={{ marginTop: 0 }}>Option 2: Scan/Upload License</h2>
        <form onSubmit={handleScanSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="licenseFile" style={{ display: 'block', marginBottom: '5px' }}>
              Upload Driver's License Image:
            </label>
            <input
              id="licenseFile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ 
                width: '100%',
                padding: '10px',
                fontSize: '16px'
              }}
              disabled={loading}
            />
            {licenseFile && (
              <p style={{ marginTop: '10px', color: '#28a745' }}>
                Selected: {licenseFile.name}
              </p>
            )}
          </div>
          <button 
            type="submit"
            disabled={loading}
            style={{ 
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Processing...' : 'Scan & Verify License'}
          </button>
        </form>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button 
          onClick={() => navigate('/home')}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default DriversLicense;
