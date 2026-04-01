"use client";

export const dynamic = 'force-dynamic'

export default function AboutPage() {
  return (
    <div>
      <div className="page-hero">
        <h1>О магазине TechStore</h1>
        <p>Лучшая электроника для цифровой жизни</p>
      </div>
      <div className="container">
        <div className="grid" style={{ marginBottom: '2rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem' }}>🏆</div>
            <h3>5 лет на рынке</h3>
            <p>Более 50 000 довольных клиентов</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem' }}>⭐</div>
            <h3>4.8 из 5</h3>
            <p>Средняя оценка покупателей</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem' }}>🚚</div>
            <h3>Бесплатная доставка</h3>
            <p>При заказе от 10 000 ₽</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem' }}>🔧</div>
            <h3>Гарантия 2 года</h3>
            <p>На все товары</p>
          </div>
        </div>
        <div className="card">
          <h2>Наша миссия</h2>
          <p>Сделать современную электронику доступной каждому. Мы предлагаем только проверенные товары с официальной гарантией.</p>
        </div>
      </div>
    </div>
  );
}