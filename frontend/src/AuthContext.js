import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://unifiedecommerce.onrender.com/api/auth'; // Adjust if backend runs elsewhere

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
      const { user, token } = JSON.parse(saved);
      setUser(user);
      setToken(token);
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
    setLoading(true); setError(null);
    try {
      const res = await axios.post(`${API_URL}/register`, data);
      setUser(res.data.user);
      setToken(res.data.token);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data) => {
    setLoading(true); setError(null);
    try {
      const res = await axios.post(`${API_URL}/login`, data);
      setUser(res.data.user);
      setToken(res.data.token);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const update = async (data) => {
    setLoading(true); setError(null);
    try {
      const res = await axios.put(`${API_URL}/update`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    setLoading(true); setError(null);
    try {
      await axios.delete(`${API_URL}/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, register, login, logout, update, remove }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
