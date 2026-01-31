import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth';
import Login from './pages/Login';
import Home from './pages/Home';
import DriverLicense from './pages/DriverLicense';
import Employment from './pages/Employment';
import BackgroundCheck from './pages/BackgroundCheck';
import Approval from './pages/Approval';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/global.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver-license"
            element={
              <ProtectedRoute>
                <DriverLicense />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employment"
            element={
              <ProtectedRoute>
                <Employment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/background-check"
            element={
              <ProtectedRoute>
                <BackgroundCheck />
              </ProtectedRoute>
            }
          />
          <Route
            path="/approval"
            element={
              <ProtectedRoute>
                <Approval />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;