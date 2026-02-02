import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Admin credentials
const ADMIN_USER = {
  username: 'ADMINSWIFTVERIFYCODIE',
  password: 'Marine@781227@@@',
  role: 'admin',
  permissions: ['all']
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    // Admin authentication with absolute control
    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
      setIsAuthenticated(true);
      setUser({
        username: ADMIN_USER.username,
        role: ADMIN_USER.role,
        permissions: ADMIN_USER.permissions,
        isAdmin: true
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  // Admin helper function to check permissions
  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.permissions.includes('all')) return true;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};