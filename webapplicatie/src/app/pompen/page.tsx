'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import AppSidebar from '../_components/AppSidebar';
import PompenHeader from './_components/PompenHeader';
import PompenList from './_components/PompenList';
import PompenSearch from './_components/PompenSearch';
import PompenSideExtras from './_components/PompenSideExtras';
import { mapPompenToItems } from './_data/pompen';
import type { PompApiRecord, PompItem } from './_types/pompen';

export default function PompenOverzichtPage() {
  const router = useRouter();
  const [items, setItems] = useState<PompItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusText, setStatusText] = useState('Wachten op data...');

  useEffect(() => {
    let active = true;

    async function fetchPompen() {
      try {
        const res = await fetch('/api/pompen', { cache: 'no-store' });
        const data = (await res.json()) as unknown;

        if (!Array.isArray(data)) {
          if (active) {
            setItems([]);
            setStatusText('Geen geldige data');
          }
          return;
        }

        if (active) {
          setItems(mapPompenToItems(data as PompApiRecord[]));
          setStatusText('Live data');
        }
      } catch (error) {
        console.error('Fout bij laden pompen:', error);
        if (active) {
          setItems([]);
          setStatusText('Verbinding mislukt');
        }
      }
    }

    fetchPompen();
    const interval = setInterval(fetchPompen, 3000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const filteredPompen = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return items;
    }

    return items.filter((pomp) =>
      [pomp.name, pomp.location, pomp.id, pomp.woning, String(pomp.status)].some((value) =>
        value.toLowerCase().includes(term)
      )
    );
  }, [items, searchTerm]);

  return (
    <main className="min-h-screen bg-[#E5007D]">
      <PompenHeader statusText={statusText} />

      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <div className="hidden lg:block">
          <AppSidebar>
            <PompenSideExtras />
          </AppSidebar>
        </div>

        <section className="space-y-6">
          <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Actieve pompen</h2>
                <p className="text-sm text-slate-500">
                  Overzicht van pompen met de laatst ontvangen MQTT-status.
                </p>
              </div>

              <PompenSearch value={searchTerm} onChange={setSearchTerm} />
            </div>

            <div className="hidden md:grid grid-cols-12 px-10 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-slate-100">
              <div className="col-span-4">Locatie</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-3">Laatste update</div>
              <div className="col-span-2 text-right">Actie</div>
            </div>

            <div className="p-5">
              <PompenList
                items={filteredPompen}
                onSelect={(id) => router.push(`/pompen/${id}`)}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
