import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider } from './auth';
import Home from './pages/Home';
import Login from './pages/Login';
import DriversLicense from './pages/DriversLicense';
import VerificationProcessing from './pages/VerificationProcessing';
import VerificationResult from './pages/VerificationResult';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <ProtectedRoute path="/home" component={Home} />
          <ProtectedRoute path="/drivers-license" component={DriversLicense} />
          <ProtectedRoute path="/verification-processing" component={VerificationProcessing} />
          <ProtectedRoute path="/verification-result" component={VerificationResult} />
          <Redirect from="/" to="/login" />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;