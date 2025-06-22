import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Optionally, persist token in localStorage for demo
  useEffect(() => {
    const saved = localStorage.getItem('auth');
    if (saved) {
      try {
        const { user, token } = JSON.parse(saved);
        setUser(user);
        setToken(token);
      } catch (err) {
        console.error('Error parsing saved auth data:', err);
        localStorage.removeItem('auth');
      }
    }
  }, []);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('auth', JSON.stringify({ user, token }));
    } else {
      localStorage.removeItem('auth');
    }
  }, [user, token]);

  const register = async (data) => {
    setLoading(true); 
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/auth/register`, data);
      setUser(res.data.user);
      setToken(res.data.token);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      console.error('Registration error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data) => {
    setLoading(true); 
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, data);
      setUser(res.data.user);
      setToken(res.data.token);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      console.error('Login error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
  };

  const update = async (data) => {
    setLoading(true); 
    setError(null);
    try {
      const res = await axios.put(`${API_URL}/auth/update`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Update failed. Please try again.';
      setError(errorMessage);
      console.error('Update error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    setLoading(true); 
    setError(null);
    try {
      await axios.delete(`${API_URL}/auth/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Delete failed. Please try again.';
      setError(errorMessage);
      console.error('Delete error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      error, 
      register, 
      login, 
      logout, 
      update, 
      remove,
      clearError 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
