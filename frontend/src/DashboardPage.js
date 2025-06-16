import React, { useState } from 'react';
import { useAuth } from './AuthContext';

export default function DashboardPage() {
  const { user, logout, update, remove, loading, error } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [edit, setEdit] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleUpdate = async e => {
    e.preventDefault();
    const ok = await update(form);
    setSuccess(ok);
    setEdit(false);
  };
  const handleDelete = async () => {
    if (window.confirm('Are you sure? This cannot be undone.')) {
      await remove();
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user?.name}</h2>
      <div>Email: {user?.email}</div>
      <div>Phone: {user?.phone}</div>
      <div>National ID: {user?.nationalID}</div>
      <button onClick={logout}>Logout</button>
      <button onClick={() => setEdit(e => !e)}>{edit ? 'Cancel' : 'Edit Profile'}</button>
      <button onClick={handleDelete} style={{ color: 'red' }}>Delete Account</button>
      {edit && (
        <form onSubmit={handleUpdate}>
          <input name="name" value={form.name} onChange={handleChange} required />
          <input name="phone" value={form.phone} onChange={handleChange} required />
          <button type="submit" disabled={loading}>Save</button>
        </form>
      )}
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Profile updated!</div>}
    </div>
  );
}
