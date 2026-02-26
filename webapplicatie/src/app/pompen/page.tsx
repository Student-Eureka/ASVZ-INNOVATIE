'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import AppSidebar from '../_components/AppSidebar';
import PompenHeader from './_components/PompenHeader';
import PompenList from './_components/PompenList';
import PompenSearch from './_components/PompenSearch';
import PompenSideExtras from './_components/PompenSideExtras';
import { POMPEN } from './_data/pompen';

export default function PompenOverzichtPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPompen = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return POMPEN.filter(
      (pomp) =>
        pomp.name.toLowerCase().includes(term) ||
        pomp.location.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#E30059] font-sans flex flex-col">
      <PompenHeader />

      <div className="flex-1 px-0 md:px-8 pb-0 md:pb-8 flex flex-col md:flex-row gap-0 md:gap-8 overflow-hidden">
        <div className="hidden md:block w-64 shrink-0 py-2">
          <AppSidebar>
            <PompenSideExtras />
          </AppSidebar>
        </div>

        <div className="flex-1 flex flex-col gap-4 md:gap-6 overflow-hidden bg-[#F8F9FA] rounded-t-3xl md:rounded-[40px] shadow-2xl p-4 md:p-8 relative">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 pb-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Actieve Pompen
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Beheer status per woning
              </p>
            </div>

            <PompenSearch value={searchTerm} onChange={setSearchTerm} />
          </div>

          <div className="hidden md:grid grid-cols-12 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <div className="col-span-4">Locatie</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-3">Batterij</div>
            <div className="col-span-2 text-right">Actie</div>
          </div>

          <PompenList items={filteredPompen} onSelect={(id) => router.push(`/pompen/${id}`)} />
        </div>
      </div>
    </div>
  );
}
