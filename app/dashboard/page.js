"use client";

export const dynamic = 'force-dynamic'

import { useSession, signOut, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && session?.user?.id) {
      fetch('/api/orders').then(res => res.json()).then(data => {
        if (data.success) setOrders(data.orders);
      });
      fetch('/api/cart').then(res => res.json()).then(data => {
        if (data.success) {
          const total = data.cart.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(total);
        }
      });
    }
  }, [mounted, session]);

  if (status === "loading" || !mounted) {
    return <div style={{ textAlign: "center", padding: "4rem" }}>Загрузка...</div>;
  }

  if (!session) {
    router.push("/");
    return null;
  }

  const getStatusClass = (status) => {
    const classes = {
      pending: 'status-pending',
      completed: 'status-completed',
      shipped: 'status-active',
      new: 'status-new'
    };
    return classes[status] || 'status-pending';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Ожидает обработки',
      completed: 'Выполнен',
      shipped: 'Отправлен',
      new: 'Новое'
    };
    return texts[status] || status;
  };

  return (
    <div>
      {/* Шапка дашборда */}
      <div className="dashboard-header">
        <div>
          <h2>Добро пожаловать, {session.user.name || session.user.email.split('@')[0]}!</h2>
          <div className="user-email">📧 {session.user.email}</div>
        </div>
        <button onClick={() => signOut({ callbackUrl: "/" })}>
          Выйти
        </button>
      </div>

      {/* Статистика */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>🛒 Товаров в корзине</h3>
          <div className="stat-number">{cartCount}</div>
          <Link href="/cart" className="btn">Перейти в корзину</Link>
        </div>
        <div className="stat-card">
          <h3>📦 Всего заказов</h3>
          <div className="stat-number">{orders.length}</div>
          <button className="btn" onClick={() => setActiveTab('orders')}>История заказов</button>
        </div>
        <div className="stat-card">
          <h3>🏆 Бонусная программа</h3>
          <div className="stat-number">5%</div>
          <p>кэшбэк на все покупки</p>
        </div>
      </div>

      {/* Табы навигации */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-dashboard ${activeTab === 'overview' ? 'active' : ''}`} 
          onClick={() => setActiveTab('overview')}
        >
          📊 Обзор
        </button>
        <button 
          className={`tab-dashboard ${activeTab === 'orders' ? 'active' : ''}`} 
          onClick={() => setActiveTab('orders')}
        >
          📦 Мои заказы
        </button>
        <button 
          className={`tab-dashboard ${activeTab === 'cart' ? 'active' : ''}`} 
          onClick={() => router.push('/cart')}
        >
          🛒 Корзина ({cartCount})
        </button>
        <button 
          className={`tab-dashboard ${activeTab === 'new' ? 'active' : ''}`} 
          onClick={() => setActiveTab('new')}
        >
          ➕ Новый заказ
        </button>
      </div>

      {/* Обзор */}
      {activeTab === 'overview' && (
        <>
          {orders.length > 0 && (
            <div className="item-card" style={{ marginBottom: '1.5rem' }}>
              <h3>📦 Последние заказы</h3>
              {orders.slice(0, 3).map(order => (
                <div key={order.id} style={{ 
                  padding: '0.75rem 0', 
                  borderBottom: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <span>Заказ #{order.id}</span>
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                    {order.total.toLocaleString()} ₽
                  </span>
                  <span className={getStatusClass(order.status)}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              ))}
              <button 
                className="btn" 
                onClick={() => setActiveTab('orders')}
                style={{ marginTop: '1rem', background: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)' }}
              >
                Все заказы →
              </button>
            </div>
          )}

          {/* Быстрые действия */}
          <div className="quick-actions">
            <h3>⚡ Быстрые действия</h3>
            <div className="quick-actions-buttons">
              <button onClick={() => router.push('/products')}>
                🛍️ В каталог
              </button>
              <button onClick={() => setActiveTab('new')}>
                ➕ Оформить заказ
              </button>
              <button onClick={() => router.push('/cart')}>
                🛒 Перейти в корзину
              </button>
            </div>
          </div>
        </>
      )}

      {/* Мои заказы */}
      {activeTab === 'orders' && (
        <>
          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <h3>У вас пока нет заказов</h3>
              <p>Перейдите в каталог, чтобы сделать первый заказ</p>
              <Link href="/products" className="btn">Перейти в каталог</Link>
            </div>
          ) : (
            <div className="items-grid">
              {orders.map(order => (
                <div key={order.id} className="item-card">
                  <h3>Заказ #{order.id}</h3>
                  <p><strong>Сумма:</strong> {order.total.toLocaleString()} ₽</p>
                  <p><strong>Дата:</strong> {new Date(order.created_at).toLocaleString()}</p>
                  <p><strong>Адрес:</strong> {order.address}</p>
                  <p><strong>Телефон:</strong> {order.phone}</p>
                  <div className="item-actions">
                    <span className={getStatusClass(order.status)}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Оформление заказа */}
      {activeTab === 'new' && (
        <div className="policy-form">
          <h3>Оформление заказа</h3>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const res = await fetch('/api/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                address: formData.get('address'),
                phone: formData.get('phone')
              })
            });
            if (res.ok) {
              alert('Заказ оформлен! Спасибо за покупку!');
              setActiveTab('orders');
              fetch('/api/orders').then(res => res.json()).then(data => {
                if (data.success) setOrders(data.orders);
              });
              fetch('/api/cart').then(res => res.json()).then(data => {
                if (data.success) {
                  const total = data.cart.reduce((sum, item) => sum + item.quantity, 0);
                  setCartCount(total);
                }
              });
            } else {
              const error = await res.json();
              alert(error.error || 'Ошибка при оформлении заказа');
            }
          }}>
            <input name="address" placeholder="Адрес доставки" required />
            <input name="phone" placeholder="Телефон" required />
            <button type="submit">Оформить заказ</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <SessionProvider>
      <Suspense fallback={<div style={{ textAlign: "center", padding: "4rem" }}>Загрузка...</div>}>
        <DashboardContent />
      </Suspense>
    </SessionProvider>
  );
}