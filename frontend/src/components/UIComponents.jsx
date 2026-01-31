import React from 'react';

export const Button = ({ children, variant = 'primary', onClick, type = 'button', disabled = false, className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, name, type = 'text', value, onChange, placeholder, required = false, validated = false }) => {
  return (
    <div className="input-group">
      <label htmlFor={name} className="input-label">
        {label} {required && <span style={{ color: 'var(--danger-color)' }}>*</span>}
        {validated && <span className="checkmark">✓</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="input-field"
      />
    </div>
  );
};

export const Card = ({ title, children, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {title && <h2 className="card-title">{title}</h2>}
      {children}
    </div>
  );
};

export const FCRANotice = () => {
  return (
    <div className="fcra-notice">
      <p>
        <strong>FCRA Compliance Notice:</strong> All information collected is handled securely in compliance with the Fair Credit Reporting Act (FCRA). 
        Your personal information is encrypted and protected. By proceeding, you consent to the collection and verification of your information 
        for rental application purposes.
      </p>
    </div>
  );
};
