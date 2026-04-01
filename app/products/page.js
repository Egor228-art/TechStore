"use client";

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch(`/api/products?category=${category}`);
    const data = await res.json();
    if (data.success) setProducts(data.products);
    setLoading(false);
  };

  const categories = [
    { id: 'all', name: 'Все товары', icon: '📦' },
    { id: 'phones', name: 'Смартфоны', icon: '📱' },
    { id: 'laptops', name: 'Ноутбуки', icon: '💻' },
    { id: 'audio', name: 'Аудио', icon: '🎧' },
    { id: 'tablets', name: 'Планшеты', icon: '📟' },
    { id: 'wearables', name: 'Умные часы', icon: '⌚' },
  ];

  return (
    <div>
      <div className="page-hero">
        <h1>Каталог товаров</h1>
        <p>Выберите технику для цифровой жизни</p>
      </div>

      <div className="container">
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={category === cat.id ? 'active' : ''}
              onClick={() => setCategory(cat.id)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>Загрузка...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p>Товаров в этой категории пока нет</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}