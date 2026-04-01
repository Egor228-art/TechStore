"use client";

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import ProductCard from "./components/ProductCard";

function HomeContentWithParams() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", name: "", phone: "" });
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    setMounted(true);
    if (searchParams?.get('login') === 'true') {
      setIsModalOpen(true);
    }
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async (cat = category) => {
    const res = await fetch(`/api/products?category=${cat}`);
    const data = await res.json();
    if (data.success) setProducts(data.products);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    fetchProducts(cat);
  };

  if (status === "loading" || !mounted) {
    return <div style={{ textAlign: "center", padding: "4rem" }}>Загрузка...</div>;
  }

  if (session) {
    router.push("/dashboard");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (res?.error) setError("Неверный email или пароль");
      else {
        setIsModalOpen(false);
        router.push("/dashboard");
      }
    } else {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error);
      else {
        await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });
        setIsModalOpen(false);
        router.push("/dashboard");
      }
    }
  };

  return (
    <div>
      <div className="hero">
        <h1>TechStore — всё для цифровой жизни</h1>
        <p>Смартфоны, ноутбуки, наушники и аксессуары по лучшим ценам</p>
        <button className="btn" onClick={() => setIsModalOpen(true)} style={{ marginTop: "2rem", fontSize: "1.1rem", padding: "1rem 2rem" }}>
          Войти в аккаунт
        </button>
      </div>

      <div className="category-filters">
        <button className={category === 'all' ? 'active' : ''} onClick={() => handleCategoryChange('all')}>Все товары</button>
        <button className={category === 'phones' ? 'active' : ''} onClick={() => handleCategoryChange('phones')}>📱 Смартфоны</button>
        <button className={category === 'laptops' ? 'active' : ''} onClick={() => handleCategoryChange('laptops')}>💻 Ноутбуки</button>
        <button className={category === 'audio' ? 'active' : ''} onClick={() => handleCategoryChange('audio')}>🎧 Аудио</button>
        <button className={category === 'tablets' ? 'active' : ''} onClick={() => handleCategoryChange('tablets')}>📟 Планшеты</button>
        <button className={category === 'wearables' ? 'active' : ''} onClick={() => handleCategoryChange('wearables')}>⌚ Умные часы</button>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="form-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            <div className="form-tabs">
              <button className={`tab-btn ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Вход</button>
              <button className={`tab-btn ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Регистрация</button>
            </div>
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <input type="text" placeholder="Ваше имя" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                  <input type="tel" placeholder="Телефон" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </>
              )}
              <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              <input type="password" placeholder="Пароль" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
              {error && <p className="error">{error}</p>}
              <button type="submit">{isLogin ? "Войти" : "Зарегистрироваться"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function HomeContent() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "4rem" }}>Загрузка...</div>}>
      <HomeContentWithParams />
    </Suspense>
  );
}

export default function Home() {
  return (
    <SessionProvider>
      <HomeContent />
    </SessionProvider>
  );
}