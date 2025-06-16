import React, { useState } from 'react';
import { useAuth } from './AuthContext';

export default function RegisterPage() {
  const { register, error, loading } = useAuth();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', nationalID: '', password: ''
  });
  const [success, setSuccess] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = async e => {
    e.preventDefault();
    const ok = await register(form);
    setSuccess(ok);
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
        <input name="nationalID" placeholder="National ID" value={form.nationalID} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit" disabled={loading}>Register</button>
      </form>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Registration successful!</div>}
    </div>
  );
}
