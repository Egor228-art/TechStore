'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import CartIcon from './CartIcon'

export default function Navigation() {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isActive = (path) => pathname === path ? 'active' : ''

  if (!mounted) {
    return (
      <nav className="main-nav">
        <div className="nav-container">
          <div className="nav-links">
            <Link href="/">Главная</Link>
            <Link href="/products">Каталог</Link>
            <Link href="/about">О магазине</Link>
            <Link href="/contacts">Контакты</Link>
            <Link href="/blog">Обзоры</Link>
            <Link href="/faq">FAQ</Link>
          </div>
          <Link href="/?login=true" className="nav-login">Войти</Link>
        </div>
      </nav>
    )
  }

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <div className="nav-links">
          <Link href="/" className={isActive('/')}>Главная</Link>
          <Link href="/products" className={isActive('/products')}>Каталог</Link>
          <Link href="/about" className={isActive('/about')}>О магазине</Link>
          <Link href="/contacts" className={isActive('/contacts')}>Контакты</Link>
          <Link href="/blog" className={isActive('/blog')}>Обзоры</Link>
          <Link href="/faq" className={isActive('/faq')}>FAQ</Link>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <CartIcon />
          {session?.user ? (
            <Link href="/dashboard" className="nav-user">
              👤 {session.user.name || session.user.email.split('@')[0]}
            </Link>
          ) : (
            <Link href="/?login=true" className="nav-login">Войти</Link>
          )}
        </div>
      </div>
    </nav>
  )
}