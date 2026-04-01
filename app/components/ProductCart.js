'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const addToCart = async () => {
    if (!session) {
      setMessage('Войдите в аккаунт чтобы добавить товар');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      });
      if (res.ok) {
        setMessage('Товар добавлен в корзину!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Ошибка при добавлении');
    }
    setLoading(false);
  };

  return (
    <div className="product-card">
      <Link href={`/products/${product.id}`} className="product-link">
        <div className="product-image">{product.image || '📦'}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">{product.price.toLocaleString()} ₽</div>
        <div className="product-rating">⭐ {product.rating}</div>
      </Link>
      <button className="btn-add" onClick={addToCart} disabled={loading}>
        {loading ? 'Добавление...' : '🛒 В корзину'}
      </button>
      {message && <p className="cart-message">{message}</p>}
    </div>
  );
}