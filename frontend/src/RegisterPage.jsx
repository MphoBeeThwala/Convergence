import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function RegisterPage() {
  const { register, error, loading, clearError } = useAuth();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', nationalID: '', password: ''
  });
  const navigate = useNavigate();

  // Clear error when component mounts
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
    const ok = await register(form);
    if (ok) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input 
            id="name"
            name="name" 
            placeholder="Enter your full name" 
            value={form.name} 
            onChange={handleChange} 
            required 
          />
        </div>
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
          <label htmlFor="phone">Phone Number</label>
          <input 
            id="phone"
            name="phone" 
            type="tel"
            placeholder="Enter your phone number" 
            value={form.phone} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="nationalID">National ID</label>
          <input 
            id="nationalID"
            name="nationalID" 
            placeholder="Enter your national ID" 
            value={form.nationalID} 
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
            placeholder="Enter your password (min 8 chars, uppercase + number)" 
            value={form.password} 
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
