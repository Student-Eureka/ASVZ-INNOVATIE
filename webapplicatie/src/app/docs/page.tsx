'use client';

import { useState } from 'react';

import { getContent, TOPICS } from './_data/topics';
import TopicGrid from './_components/TopicGrid';
import TopicModal from './_components/TopicModal';
import type { TopicId } from './_types/docs';

export default function DocumentatiePage() {
  const [activeId, setActiveId] = useState<TopicId | null>(null);

  const activeContent = activeId ? getContent(activeId) : null;

  return (
    <main className="min-h-screen bg-[#E5007D] flex flex-col">
      <header className="w-full bg-white/90 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="ASVZ logo"
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                Uitleg &amp; handleiding
              </h1>
              <p className="text-xs text-slate-500">
                Klik op een onderdeel om een korte uitleg te zien.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <TopicGrid topics={TOPICS} onSelect={setActiveId} />
        </div>
      </div>

      {activeContent && (
        <TopicModal content={activeContent} onClose={() => setActiveId(null)} />
      )}
    </main>
  );
}
