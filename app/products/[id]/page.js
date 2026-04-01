"use client";

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    const res = await fetch(`/api/products/${id}`);
    const data = await res.json();
    if (data.success) {
      setProduct(data.product);
    } else {
      router.push('/products');
    }
    setLoading(false);
  };

  const addToCart = async () => {
    if (!session) {
      setMessage('Войдите в аккаунт чтобы добавить товар');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setAdding(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity })
      });
      if (res.ok) {
        setMessage('Товар добавлен в корзину!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Ошибка при добавлении');
    }
    setAdding(false);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Загрузка...</div>;
  }

  if (!product) return null;

  return (
    <div className="container">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '2rem', background: 'white', borderRadius: '1rem', padding: '2rem' }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '8rem' }}>{product.image || '📦'}</div>
        </div>
        <div style={{ flex: 2 }}>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{product.name}</h1>
          <div style={{ color: 'var(--accent)', marginBottom: '1rem' }}>⭐ {product.rating} / 5</div>
          <p style={{ color: 'var(--gray)', marginBottom: '1.5rem' }}>{product.description}</p>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '1rem' }}>
            {product.price.toLocaleString()} ₽
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Количество: </label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
              style={{ width: '80px', marginLeft: '0.5rem' }}
            />
            <span style={{ marginLeft: '0.5rem', color: 'var(--gray)' }}>В наличии: {product.stock} шт.</span>
          </div>
          <button className="btn" onClick={addToCart} disabled={adding}>
            {adding ? 'Добавление...' : '🛒 Добавить в корзину'}
          </button>
          {message && <p className="cart-message" style={{ marginTop: '1rem' }}>{message}</p>}
        </div>
      </div>
    </div>
  );
}