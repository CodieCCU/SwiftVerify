import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        username,
        password
      });

      const { token: authToken, mfaRequired, mfaSessionId } = response.data;

      if (mfaRequired) {
        return {
          success: true,
          mfaRequired: true,
          mfaSessionId
        };
      }

      // No MFA required, complete login
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setIsAuthenticated(true);
      setUser({ username });
      
      return {
        success: true,
        mfaRequired: false
      };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const verifyMFA = async (mfaSessionId, code) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/mfa/verify`,
        { code },
        {
          headers: {
            'X-MFA-Session': mfaSessionId
          }
        }
      );

      const { token: authToken } = response.data;
      
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setIsAuthenticated(true);
      
      // Decode JWT to extract username (simple base64 decode - in production use a JWT library)
      try {
        const payload = JSON.parse(atob(authToken.split('.')[1]));
        setUser({ username: payload.username || 'user' });
      } catch (e) {
        // Fallback if JWT parsing fails
        setUser({ username: 'user' });
      }
      
      return {
        success: true
      };
    } catch (error) {
      console.error('MFA verification failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'MFA verification failed'
      };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post(`${API_BASE_URL}/logout`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      token,
      login, 
      verifyMFA,
      logout 
    }}>
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
