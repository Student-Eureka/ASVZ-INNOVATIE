'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/pompen', label: 'Pompen' },
  { href: '/docs', label: 'Documentatie' },
  { href: '/admin', label: 'Admin' },
];

function isActive(pathname: string, href: string) {
  if (href === '/pompen') return pathname === '/pompen' || pathname.startsWith('/pompen/');
  return pathname === href;
}

export default function AppSidebar({ children }: { children?: ReactNode }) {
  // Sidebar met dynamische Admin-tab op basis van rol.
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadRole() {
      try {
        // Rol ophalen zodat de Admin-tab alleen voor admins zichtbaar is.
        const res = await fetch('/api/me', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as { role?: string };
        if (!active) return;
        setIsAdmin(data.role === 'admin');
      } catch {
        if (!active) return;
        setIsAdmin(false);
      }
    }

    loadRole();
    return () => {
      active = false;
    };
  }, []);

  const items = NAV_ITEMS.filter((item) => item.href !== '/admin' || isAdmin);

  return (
    <aside className="rounded-3xl bg-white border border-slate-200 shadow-sm p-3 h-fit">
      <nav className="space-y-1">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block w-full text-left px-3 py-2 rounded-2xl text-sm font-semibold transition ${
                active
                  ? 'bg-slate-900 text-white'
                  : 'hover:bg-slate-100 text-slate-900'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {children && <div className="mt-4 pt-4 border-t border-slate-200">{children}</div>}
    </aside>
  );
}
