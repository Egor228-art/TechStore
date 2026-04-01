"use client";

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/?login=true');
    }
    if (session) {
      fetchCart();
    }
  }, [session, status]);

  const fetchCart = async () => {
    const res = await fetch('/api/cart');
    const data = await res.json();
    if (data.success) setCart(data.cart);
    setLoading(false);
  };

  const updateQuantity = async (productId, quantity) => {
    setUpdating(true);
    await fetch('/api/cart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity })
    });
    fetchCart();
    setUpdating(false);
  };

  const removeItem = async (productId) => {
    await updateQuantity(productId, 0);
  };

  const clearCart = async () => {
    await fetch('/api/cart', { method: 'DELETE' });
    fetchCart();
  };

  const createOrder = async () => {
    if (!address || !phone) {
      alert('Укажите адрес доставки и телефон');
      return;
    }
    setOrdering(true);
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, phone })
    });
    if (res.ok) {
      alert('Заказ оформлен! Спасибо за покупку!');
      router.push('/orders');
    } else {
      const error = await res.json();
      alert(error.error);
    }
    setOrdering(false);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Загрузка...</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="container">
        <div className="empty-cart">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
          <h2>Корзина пуста</h2>
          <p>Добавьте товары из каталога</p>
          <Link href="/products" className="btn" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-hero" style={{ marginBottom: '2rem' }}>
        <h1>Корзина</h1>
        <p>Товары в вашей корзине</p>
      </div>

      <div className="cart-page">
        {cart.map(item => (
          <div key={item.product_id} className="cart-item">
            <div className="cart-item-info">
              <div className="cart-item-title">{item.name}</div>
              <div className="cart-item-price">{item.price.toLocaleString()} ₽</div>
            </div>
            <div className="cart-item-actions">
              <input
                type="number"
                min="1"
                max={item.stock}
                value={item.quantity}
                onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value))}
                className="cart-quantity"
                disabled={updating}
              />
              <button onClick={() => removeItem(item.product_id)} style={{ background: 'var(--danger)' }}>
                Удалить
              </button>
            </div>
          </div>
        ))}

        <div className="cart-summary">
          <h3>Оформление заказа</h3>
          <input
            type="text"
            placeholder="Адрес доставки"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Телефон"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div className="cart-total">
            Итого: {total.toLocaleString()} ₽
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button onClick={clearCart} style={{ background: 'var(--gray)' }}>
              Очистить корзину
            </button>
            <button onClick={createOrder} disabled={ordering}>
              {ordering ? 'Оформление...' : 'Оформить заказ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}