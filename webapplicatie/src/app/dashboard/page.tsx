'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import DashboardContent from './_components/DashboardContent';
import DashboardHeader from './_components/DashboardHeader';
import DashboardSidebar from './_components/DashboardSidebar';
import type { Pomp } from './_types/dashboard';

export default function DashboardPage() {
  const router = useRouter();
  const [pompen, setPompen] = useState<Pomp[]>([]);
  const [statusText, setStatusText] = useState('Wachten op data...');
  const [q, setQ] = useState('');

  useEffect(() => {
    let active = true;

    async function fetchPompen() {
      try {
        const res = await fetch('/api/pompen', { cache: 'no-store' });
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error('Pompen API returned not an array:', data);
          if (active) setPompen([]);
          return;
        }

        if (active) {
          setPompen(
            data.map((p: Pomp) => ({
              ...p,
              uniqueId: `${p.woning}_${p.id}`,
              status: p.status || 'inactief',
            }))
          );
          setStatusText('Live data');
        }
      } catch (err) {
        console.error('Fout bij laden pompen:', err);
        if (active) setPompen([]);
        if (active) setStatusText('Verbinding mislukt');
      }
    }

    fetchPompen();
    const interval = setInterval(fetchPompen, 3000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error', e);
    }
    router.push('/login');
  };

  const filteredPompen = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return pompen;
    return pompen.filter(
      (p) => p.woning.toLowerCase().includes(s) || p.id.toLowerCase().includes(s)
    );
  }, [pompen, q]);

  const stats = useMemo(() => {
    const totaal = pompen.length;
    const actief = pompen.filter((p) => p.status.toLowerCase() === 'actief').length;
    const rust = pompen.filter((p) => p.status.toLowerCase() === 'rust').length;
    const inactief = totaal - actief - rust;
    return { totaal, actief, rust, inactief };
  }, [pompen]);

  return (
    <main className="min-h-screen bg-[#E5007D]">
      <DashboardHeader statusText={statusText} onLogout={logout} />

      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <DashboardSidebar onAdmin={() => router.push('/admin')} />
        <DashboardContent
          pompen={filteredPompen}
          query={q}
          onQueryChange={setQ}
          stats={stats}
        />
      </div>
    </main>
  );
}
