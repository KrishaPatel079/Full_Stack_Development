import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      toast.success('Login successful! 🚀');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await axios.post('/api/auth/signup', { name, email, password });
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      toast.success('Account created successfully! 🎉');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Signup failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post('/api/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
      toast.success('Logged out successfully! 👋');
    }
  };

  const updateProfile = async (updates) => {
    try {
      const response = await axios.put('/api/auth/profile', updates);
      setUser(response.data.user);
      toast.success('Profile updated successfully! ✨');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Profile update failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await axios.post('/api/auth/change-password', { currentPassword, newPassword });
      toast.success('Password changed successfully! 🔐');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Password change failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    token,
    login,
    signup,
    logout,
    updateProfile,
    changePassword,
    fetchUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
