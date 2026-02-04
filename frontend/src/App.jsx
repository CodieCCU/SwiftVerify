import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth';
import Home from './pages/Home';
import Login from './pages/Login';
import DriversLicense from './pages/DriversLicense';
import VerificationProcessing from './pages/VerificationProcessing';
import VerificationResult from './pages/VerificationResult';
import LandingPage from './pages/LandingPage';
import LandlordAgreement from './pages/landlord/LandlordAgreement';
import LandlordDashboard from './pages/landlord/LandlordDashboard';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/drivers-license" element={<ProtectedRoute><DriversLicense /></ProtectedRoute>} />
          <Route path="/verification-processing" element={<ProtectedRoute><VerificationProcessing /></ProtectedRoute>} />
          <Route path="/verification-result" element={<ProtectedRoute><VerificationResult /></ProtectedRoute>} />
          <Route path="/landlord/agreement" element={<LandlordAgreement />} />
          <Route path="/landlord/dashboard" element={<ProtectedRoute><LandlordDashboard /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;