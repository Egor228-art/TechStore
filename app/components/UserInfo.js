'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function UserInfo() {
  const [mounted, setMounted] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="header-contacts">
        <div className="phone">8-800-555-35-35</div>
        <div className="work-time">Круглосуточно</div>
      </div>
    )
  }

  return (
    <div className="header-contacts">
      <div className="phone">8-800-555-35-35</div>
      <div className="work-time">Круглосуточно</div>
      {session?.user && (
        <div className="user-badge" style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#0052CC' }}>
          👤 {session.user.name || session.user.email.split('@')[0]}
        </div>
      )}
    </div>
  )
}