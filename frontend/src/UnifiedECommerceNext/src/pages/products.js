import { useState, useEffect } from 'react';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default function ProductListPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`${publicRuntimeConfig.NEXT_PUBLIC_API_URL}/products`);
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}
