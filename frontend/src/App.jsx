import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth';

// Tenant-facing pages
import LandingPageEnhanced from './pages/LandingPageEnhanced';
import PropertyListings from './pages/PropertyListings';
import PropertyDetails from './pages/PropertyDetails';
import Home from './pages/Home';
import Login from './pages/Login';
import DriversLicense from './pages/DriversLicense';
import BackgroundCheckStatus from './pages/BackgroundCheckStatus';
import IncomeVerificationStatus from './pages/IncomeVerificationStatus';
import ApprovalDenialScreen from './pages/ApprovalDenialScreen';
import LeaseSigning from './pages/LeaseSigning';
import ThankYouPage from './pages/ThankYouPage';
import VerificationProcessing from './pages/VerificationProcessing';
import VerificationResult from './pages/VerificationResult';

// Landlord-facing pages
import LandlordLogin from './pages/landlord/LandlordLogin';
import LandlordDashboard from './pages/landlord/LandlordDashboard';
import PropertyManagement from './pages/landlord/PropertyManagement';
import ApplicationTracking from './pages/landlord/ApplicationTracking';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';

import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPageEnhanced />} />
          <Route path="/properties" element={<PropertyListings />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          
          {/* Tenant authentication and verification flow */}
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/drivers-license" element={<ProtectedRoute><DriversLicense /></ProtectedRoute>} />
          <Route path="/background-check-status" element={<ProtectedRoute><BackgroundCheckStatus /></ProtectedRoute>} />
          <Route path="/income-verification-status" element={<ProtectedRoute><IncomeVerificationStatus /></ProtectedRoute>} />
          <Route path="/approval-denial" element={<ProtectedRoute><ApprovalDenialScreen /></ProtectedRoute>} />
          <Route path="/lease-signing" element={<ProtectedRoute><LeaseSigning /></ProtectedRoute>} />
          <Route path="/thank-you" element={<ProtectedRoute><ThankYouPage /></ProtectedRoute>} />
          
          {/* Legacy routes (for backward compatibility) */}
          <Route path="/verification-processing" element={<ProtectedRoute><VerificationProcessing /></ProtectedRoute>} />
          <Route path="/verification-result" element={<ProtectedRoute><VerificationResult /></ProtectedRoute>} />
          
          {/* Landlord portal routes */}
          <Route path="/landlord/login" element={<LandlordLogin />} />
          <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
          <Route path="/landlord/properties" element={<PropertyManagement />} />
          <Route path="/landlord/applications" element={<ApplicationTracking />} />
          
          {/* Admin portal routes */}
          <Route path="/sv-admin-portal/login" element={<AdminLogin />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;