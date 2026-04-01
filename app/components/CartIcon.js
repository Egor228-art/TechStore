'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function CartIcon() {
  const { data: session } = useSession();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (session) {
      fetch('/api/cart')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            const total = data.cart.reduce((sum, item) => sum + item.quantity, 0);
            setCount(total);
          }
        });
    }
  }, [session]);

  return (
    <Link href="/cart" className="cart-icon">
      🛒 {count > 0 && <span className="cart-count">{count}</span>}
    </Link>
  );
}