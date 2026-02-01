import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth';
import Home from './pages/Home';
import Login from './pages/Login';
import DriversLicense from './pages/DriversLicense';
import VerificationProcessing from './pages/VerificationProcessing';
import VerificationResult from './pages/VerificationResult';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/drivers-license" element={<ProtectedRoute><DriversLicense /></ProtectedRoute>} />
          <Route path="/verification-processing" element={<ProtectedRoute><VerificationProcessing /></ProtectedRoute>} />
          <Route path="/verification-result" element={<ProtectedRoute><VerificationResult /></ProtectedRoute>} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;