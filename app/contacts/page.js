"use client";

export const dynamic = 'force-dynamic'

export default function ContactsPage() {
  return (
    <div>
      <div className="page-hero">
        <h1>Контакты</h1>
        <p>Свяжитесь с нами любым удобным способом</p>
      </div>
      <div className="container">
        <div className="grid">
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem' }}>📞</div>
            <h3>Телефон</h3>
            <p>8-800-555-35-35</p>
            <p>Бесплатно по России</p>
            <p>Ежедневно 9:00-21:00</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem' }}>✉️</div>
            <h3>Email</h3>
            <p>info@techstore.ru</p>
            <p>support@techstore.ru</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem' }}>📍</div>
            <h3>Магазины</h3>
            <p>Москва, ул. Технологическая, 15</p>
            <p>Санкт-Петербург, пр. Невский, 100</p>
          </div>
        </div>
      </div>
    </div>
  );
}