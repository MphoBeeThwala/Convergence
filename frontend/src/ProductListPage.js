import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api') + '/shop';

// Custom hook for debouncing input
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function ProductListPage() {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', image: '' });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchProducts = async (query = '') => {
    try {
      setProductsLoading(true);
      // Use the new /search endpoint. If query is empty, it returns all products.
      const res = await axios.get(`${API_URL}/search?q=${query}`);
      setProducts(res.data);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => { 
    fetchProducts(debouncedSearchQuery); 
  }, [debouncedSearchQuery]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleAdd = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await axios.post(API_URL, form, { headers: { Authorization: `Bearer ${token}` } });
      setForm({ name: '', description: '', price: '', image: '' });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = product => {
    setEditing(product.id);
    setForm(product);
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await axios.put(`${API_URL}/${editing}`, form, { headers: { Authorization: `Bearer ${token}` } });
      setEditing(null);
      setForm({ name: '', description: '', price: '', image: '' });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setError(null);
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ name: '', description: '', price: '', image: '' });
  };

  return (
    <div className="dashboard-container">
      <h2>Products</h2>
      
      {user && (
        <form onSubmit={editing ? handleUpdate : handleAdd} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input 
              id="name"
              name="name" 
              placeholder="Enter product name" 
              value={form.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input 
              id="description"
              name="description" 
              placeholder="Enter product description" 
              value={form.description} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <input 
              id="price"
              name="price" 
              type="number" 
              step="0.01"
              min="0"
              placeholder="Enter price" 
              value={form.price} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Image URL (optional)</label>
            <input 
              id="image"
              name="image" 
              type="url"
              placeholder="Enter image URL" 
              value={form.image} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : (editing ? 'Update' : 'Add')} Product
            </button>
            {editing && (
              <button type="button" onClick={cancelEdit} className="cancel-btn">
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {error && <div className="error">{error}</div>}
      
      {productsLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading products...</div>
      ) : (
        <div className="products-section">
          <div className="search-and-header">
            <h3>Available Products ({products.length})</h3>
            <div className="search-bar form-group">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          {products.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>
              {searchQuery ? 'No products match your search.' : 'No products available yet.'}
            </p>
          ) : (
            <ul className="product-list">
              {products.map(p => (
                <li key={p.id} className="product-item">
                  <div className="product-info">
                    <h4>{p.name}</h4>
                    <p className="product-price">${parseFloat(p.price).toFixed(2)}</p>
                    <p className="product-description">{p.description}</p>
                    {p.image && (
                      <img src={p.image} alt={p.name} onError={(e) => e.target.style.display = 'none'} />
                    )}
                    <p className="product-owner">By: {p.owner}</p>
                    <p className="product-date">Added: {new Date(p.createdAt).toLocaleDateString()}</p>
                  </div>
                  {user && (user.email === p.owner || user.role === 'admin') && (
                    <div className="product-actions">
                      <button onClick={() => handleEdit(p)}>Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="delete-btn">Delete</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
