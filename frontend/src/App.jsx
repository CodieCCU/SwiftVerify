import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth';
import Home from './pages/Home';
import Login from './pages/Login';
import DriversLicense from './pages/DriversLicense';
import VerificationResult from './pages/VerificationResult';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/drivers-license" element={<ProtectedRoute><DriversLicense /></ProtectedRoute>} />
          <Route path="/verification-result" element={<ProtectedRoute><VerificationResult /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;