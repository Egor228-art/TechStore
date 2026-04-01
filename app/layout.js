import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { Providers } from './providers'
import Navigation from './components/Navigation'
import UserInfo from './components/UserInfo'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TechStore | Магазин электроники',
  description: 'Смартфоны, ноутбуки, наушники и аксессуары. Доставка по всей России.',
}

function Header() {
  return (
    <header className="main-header">
      <div className="header-content">
        <Link href="/" className="logo-link" style={{ textDecoration: 'none' }}>
          <div className="logo">
            <h1>⚡ TechStore</h1>
            <p className="logo-subtitle">Магазин электроники</p>
          </div>
        </Link>
        <UserInfo />
      </div>
      <Navigation />
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>⚡ TechStore</h3>
          <p>Магазин электроники</p>
          <p>© 2026 Все права защищены</p>
        </div>
        <div className="footer-section">
          <h3>Каталог</h3>
          <Link href="/products?category=phones">Смартфоны</Link>
          <Link href="/products?category=laptops">Ноутбуки</Link>
          <Link href="/products?category=audio">Наушники</Link>
          <Link href="/products?category=tablets">Планшеты</Link>
        </div>
        <div className="footer-section">
          <h3>Покупателям</h3>
          <Link href="/about">О магазине</Link>
          <Link href="/contacts">Контакты</Link>
          <Link href="/blog">Обзоры</Link>
          <Link href="/faq">FAQ</Link>
        </div>
        <div className="footer-section">
          <h3>Контакты</h3>
          <p>📞 8-800-555-35-35</p>
          <p>📧 info@techstore.ru</p>
          <p>📍 Москва, ул. Технологическая, 15</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Работаем для вас ежедневно 9:00-21:00</p>
      </div>
    </footer>
  )
}

function RootLayoutContent({ children }) {
  return (
    <>
      <Header />
      <main className="container">{children}</main>
      <Footer />
    </>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Providers>
          <RootLayoutContent>{children}</RootLayoutContent>
        </Providers>
      </body>
    </html>
  )
}