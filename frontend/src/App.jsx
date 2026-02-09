import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth';

// Tenant Flow Pages
import LandingPage from './pages/LandingPage';
import ConsentForm from './pages/ConsentForm';
import VerificationStatus from './pages/VerificationStatus';
import DecisionScreen from './pages/DecisionScreen';
import LeaseSigning from './pages/LeaseSigning';
import ThankYou from './pages/ThankYou';
import UnsubscribePage from './pages/UnsubscribePage';

// Legacy pages (for backward compatibility)
import Home from './pages/Home';
import DriversLicense from './pages/DriversLicense';
import VerificationProcessing from './pages/VerificationProcessing';
import VerificationResult from './pages/VerificationResult';

// Landlord Pages
import LandlordLogin from './pages/landlord/LandlordLogin';
import LandlordAgreement from './pages/landlord/LandlordAgreement';
import LandlordDashboard from './pages/landlord/LandlordDashboard';
import PropertyManagement from './pages/landlord/PropertyManagement';
import ApplicationTracking from './pages/landlord/ApplicationTracking';

// Components
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Main Tenant Verification Flow */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/consent" element={<ConsentForm />} />
          <Route path="/verification-status" element={<VerificationStatus />} />
          <Route path="/decision" element={<DecisionScreen />} />
          <Route path="/lease-signing" element={<LeaseSigning />} />
          <Route path="/thank-you" element={<ThankYou />} />
          
          {/* Email Unsubscribe */}
          <Route path="/unsubscribe/:token" element={<UnsubscribePage />} />
          
          {/* Legacy routes (backward compatibility) */}
          <Route path="/home" element={<Home />} />
          <Route path="/drivers-license" element={<DriversLicense />} />
          <Route path="/verification-processing" element={<VerificationProcessing />} />
          <Route path="/verification-result" element={<VerificationResult />} />
          
          {/* Landlord Portal */}
          <Route path="/landlord/login" element={<LandlordLogin />} />
          <Route path="/landlord/agreement" element={<LandlordAgreement />} />
          <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
          <Route path="/landlord/properties" element={<PropertyManagement />} />
          <Route path="/landlord/applications/:propertyId" element={<ApplicationTracking />} />
          <Route path="/landlord/applications" element={<ApplicationTracking />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;