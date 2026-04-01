"use client";

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/?login=true');
    }
    if (session) {
      fetchOrders();
    }
  }, [session, status]);

  const fetchOrders = async () => {
    const res = await fetch('/api/orders');
    const data = await res.json();
    if (data.success) setOrders(data.orders);
    setLoading(false);
  };

  const getStatusText = (status) => {
    const statuses = {
      pending: { text: 'Ожидает обработки', class: 'pending' },
      completed: { text: 'Выполнен', class: 'completed' },
      shipped: { text: 'Отправлен', class: 'shipped' }
    };
    return statuses[status] || { text: status, class: 'pending' };
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Загрузка...</div>;
  }

  return (
    <div className="container">
      <div className="page-hero">
        <h1>Мои заказы</h1>
        <p>История ваших покупок</p>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '1rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
          <h2>У вас пока нет заказов</h2>
          <p>Перейдите в каталог, чтобы сделать первый заказ</p>
          <a href="/products" className="btn" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Перейти в каталог
          </a>
        </div>
      ) : (
        orders.map(order => {
          const statusInfo = getStatusText(order.status);
          return (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <strong>Заказ #{order.id}</strong>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray)' }}>
                    {new Date(order.created_at).toLocaleString()}
                  </div>
                </div>
                <span className={`order-status ${statusInfo.class}`}>
                  {statusInfo.text}
                </span>
              </div>
              <div>
                <div>Сумма: <strong>{order.total.toLocaleString()} ₽</strong></div>
                <div>Адрес: {order.address}</div>
                <div>Телефон: {order.phone}</div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}