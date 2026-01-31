import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth'; // Assume you have an Auth context
import Home from './pages/Home';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <ProtectedRoute path="/home" component={Home} />
          <Redirect from="/" to="/login" />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;