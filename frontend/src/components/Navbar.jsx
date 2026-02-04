import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="navbar-brand">SwiftVerify</Link>
        {isAuthenticated && (
          <ul className="navbar-nav">
            <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
            <li><Link to="/driver-license" className="nav-link">Verification</Link></li>
            <li><Link to="/employment" className="nav-link">Employment</Link></li>
            <li><Link to="/background-check" className="nav-link">Background</Link></li>
            <li><Link to="/approval" className="nav-link">Approval</Link></li>
            <li>
              <span className="nav-link" style={{ cursor: 'default' }}>
                {user?.name || user?.email}
              </span>
            </li>
            <li>
              <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
