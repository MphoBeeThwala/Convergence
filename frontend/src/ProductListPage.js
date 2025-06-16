import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_URL = 'https://unifiedecommerce.onrender.com/api/shop';

export default function ProductListPage() {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', image: '' });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    const res = await axios.get(API_URL);
    setProducts(res.data);
  };
  useEffect(() => { fetchProducts(); }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleAdd = async e => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post(API_URL, form, { headers: { Authorization: `Bearer ${token}` } });
      setForm({ name: '', description: '', price: '', image: '' });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Add failed');
    }
  };

  const handleEdit = product => {
    setEditing(product.id);
    setForm(product);
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setError(null);
    try {
      await axios.put(`${API_URL}/${editing}`, form, { headers: { Authorization: `Bearer ${token}` } });
      setEditing(null);
      setForm({ name: '', description: '', price: '', image: '' });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Products</h2>
      {user && (
        <form onSubmit={editing ? handleUpdate : handleAdd}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
          <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
          <button type="submit">{editing ? 'Update' : 'Add'} Product</button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', description: '', price: '', image: '' }); }}>Cancel</button>}
        </form>
      )}
      {error && <div className="error">{error}</div>}
      <ul>
        {products.map(p => (
          <li key={p.id} style={{ margin: '1rem 0', borderBottom: '1px solid #eee' }}>
            <strong>{p.name}</strong> - ${p.price}<br />
            <span>{p.description}</span><br />
            {p.image && <img src={p.image} alt={p.name} style={{ maxWidth: 100 }} />}<br />
            <span style={{ fontSize: '0.8em', color: '#888' }}>By: {p.owner}</span>
            {user && (user.email === p.owner || user.role === 'admin') && (
              <>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)} style={{ color: 'red' }}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
