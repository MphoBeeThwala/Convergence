import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export default function LoginPage() {
  const { login, error, loading, clearError } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [success, setSuccess] = useState(false);

  // Clear error when component mounts or form changes
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    // Clear error when user starts typing
    if (error) clearError();
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess(false);
    const ok = await login(form);
    setSuccess(ok);
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            id="email"
            name="email" 
            type="email" 
            placeholder="Enter your email" 
            value={form.email} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            id="password"
            name="password" 
            type="password" 
            placeholder="Enter your password" 
            value={form.password} 
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Login successful! Redirecting...</div>}
    </div>
  );
}
