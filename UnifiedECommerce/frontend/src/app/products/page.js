/* eslint-disable no-undef */
'use client';
import { useState, useEffect } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://unifiedecommerce.onrender.com';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/shop`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        setError('Network error. Please try again.');
        console.error('Products fetch error:', err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Products</h2>
        
        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-gray-500">{product.description}</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                  ${product.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && !error && (
          <p className="text-gray-500 text-center">No products available.</p>
        )}
      </div>
    </div>
  );
}
