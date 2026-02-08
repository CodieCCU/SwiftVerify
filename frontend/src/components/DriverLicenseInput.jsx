import React, { useState } from 'react';
import { validateLicenseNumber } from '../utils/validators';

/**
 * Driver's license input component with manual entry and file upload options
 */
const DriverLicenseInput = ({ 
  value, 
  onChange, 
  onFileUpload,
  required = true 
}) => {
  const [inputMethod, setInputMethod] = useState('manual'); // 'manual' or 'upload'
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const handleManualChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (error && validateLicenseNumber(newValue)) {
      setError('');
    }
  };

  const handleBlur = () => {
    if (inputMethod === 'manual' && value && !validateLicenseNumber(value)) {
      setError('License number must be at least 5 characters');
    } else if (required && !value) {
      setError('Driver\'s license is required');
    } else {
      setError('');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      if (onFileUpload) {
        onFileUpload(file);
      }
      setError('');
      // In production, this would extract license number from image
      console.log('License file uploaded:', file.name);
    }
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '0.5rem', 
        color: '#555',
        fontWeight: '500',
      }}>
        Driver's License {required && '*'}
      </label>
      
      {/* Input method selector */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
      }}>
        <button
          type="button"
          onClick={() => {
            setInputMethod('manual');
            setFileName('');
          }}
          style={{
            flex: 1,
            padding: '0.75rem',
            backgroundColor: inputMethod === 'manual' ? '#1976d2' : 'white',
            color: inputMethod === 'manual' ? 'white' : '#1976d2',
            border: '2px solid #1976d2',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          Manual Entry
        </button>
        <button
          type="button"
          onClick={() => setInputMethod('upload')}
          style={{
            flex: 1,
            padding: '0.75rem',
            backgroundColor: inputMethod === 'upload' ? '#1976d2' : 'white',
            color: inputMethod === 'upload' ? 'white' : '#1976d2',
            border: '2px solid #1976d2',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          Upload File
        </button>
      </div>

      {/* Manual input */}
      {inputMethod === 'manual' && (
        <input
          type="text"
          value={value}
          onChange={handleManualChange}
          onBlur={handleBlur}
          required={required}
          placeholder="Enter your driver's license number"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: error ? '2px solid #f44336' : '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem',
            boxSizing: 'border-box',
          }}
        />
      )}

      {/* File upload */}
      {inputMethod === 'upload' && (
        <div>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="license-file-upload"
          />
          <label
            htmlFor="license-file-upload"
            style={{
              display: 'block',
              width: '100%',
              padding: '0.75rem',
              border: '2px dashed #1976d2',
              borderRadius: '4px',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: '#f5f5f5',
              color: '#1976d2',
              fontWeight: '500',
            }}
          >
            {fileName || '📄 Click to upload driver\'s license (image or PDF)'}
          </label>
          {fileName && (
            <div style={{
              marginTop: '0.5rem',
              padding: '0.5rem',
              backgroundColor: '#e8f5e9',
              borderRadius: '4px',
              fontSize: '0.875rem',
              color: '#2e7d32',
            }}>
              ✓ File uploaded: {fileName}
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{ 
          color: '#f44336', 
          marginTop: '0.25rem',
          fontSize: '0.875rem',
        }}>
          {error}
        </div>
      )}
      
      <div style={{ 
        color: '#666', 
        marginTop: '0.25rem',
        fontSize: '0.875rem',
      }}>
        Your license information is encrypted and stored securely for 30 days
      </div>
    </div>
  );
};

export default DriverLicenseInput;
