'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import AppSidebar from '../_components/AppSidebar';
import DashboardContent from './_components/DashboardContent';
import DashboardHeader from './_components/DashboardHeader';
import type { DashboardEvent, Pomp } from './_types/dashboard';

export default function DashboardPage() {
  const router = useRouter();
  const [pompen, setPompen] = useState<Pomp[]>([]);
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [statusText, setStatusText] = useState('Wachten op data...');
  const [q, setQ] = useState('');

  useEffect(() => {
    let active = true;

    async function fetchDashboardData() {
      try {
        const [pompenRes, eventsRes] = await Promise.all([
          fetch('/api/pompen', { cache: 'no-store' }),
          fetch('/api/pompen/events', { cache: 'no-store' }),
        ]);

        const pompenData = (await pompenRes.json()) as unknown;
        const eventsData = (await eventsRes.json()) as unknown;

        if (!Array.isArray(pompenData) || !Array.isArray(eventsData)) {
          console.error('Dashboard API returned invalid data', { pompenData, eventsData });
          if (active) {
            setPompen([]);
            setEvents([]);
            setStatusText('Geen geldige data');
          }
          return;
        }

        if (active) {
          setPompen(
            pompenData.map((p: Pomp) => ({
              ...p,
              uniqueId: `${p.woning}_${p.id}`,
              status: p.status || 'inactief',
            }))
          );
          setEvents((eventsData as DashboardEvent[]).slice(0, 6));
          setStatusText('Live data');
        }
      } catch (err) {
        console.error('Fout bij laden dashboard:', err);
        if (active) {
          setPompen([]);
          setEvents([]);
          setStatusText('Verbinding mislukt');
        }
      }
    }

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 3000);

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
        <div className="hidden lg:block">
          <AppSidebar />
        </div>
        <DashboardContent
          pompen={filteredPompen}
          events={events}
          query={q}
          onQueryChange={setQ}
          stats={stats}
        />
      </div>
    </main>
  );
}
