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

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h2>Добро пожаловать, {session.user.name || session.user.email.split('@')[0]}!</h2>
          <div className="user-email">📧 {session.user.email}</div>
        </div>
        <button onClick={() => signOut({ callbackUrl: "/" })} style={{ background: "var(--danger)" }}>
          Выйти
        </button>
      </div>

      <div className="grid" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h3>🛒 Корзина</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{cartCount} товаров</p>
          <Link href="/cart" className="btn">Перейти в корзину</Link>
        </div>
        <div className="card">
          <h3>📦 Заказы</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{orders.length}</p>
          <Link href="/orders" className="btn">История заказов</Link>
        </div>
        <div className="card">
          <h3>🏆 Бонусная программа</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>5% кэшбэк</p>
          <p>На все покупки</p>
        </div>
      </div>

      {orders.length > 0 && (
        <div className="card">
          <h3>Последние заказы</h3>
          {orders.slice(0, 3).map(order => (
            <div key={order.id} style={{ padding: '1rem 0', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <span>Заказ #{order.id}</span>
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
                <span>{order.total.toLocaleString()} ₽</span>
              </div>
            </div>
          ))}
          <Link href="/orders" style={{ display: 'inline-block', marginTop: '1rem' }}>Все заказы →</Link>
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