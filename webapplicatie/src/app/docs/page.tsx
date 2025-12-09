'use client';

import { useState, type ReactNode } from 'react';

type TopicId = 'login' | 'dashboard' | 'select-pomp' | 'pomp' | 'logboek' | 'waarom';

interface Topic {
  id: TopicId;
  titel: string;
  subtitel: string;
}

const TOPICS: Topic[] = [
  { id: 'login', titel: 'Inloggen', subtitel: 'Scherm 1' },
  { id: 'dashboard', titel: 'Dashboard', subtitel: 'Scherm 2' },
  { id: 'select-pomp', titel: 'Selecteer pomp', subtitel: 'Scherm 3' },
  { id: 'pomp', titel: 'Pompscherm', subtitel: 'Scherm 4' },
  { id: 'logboek', titel: 'Status & logboek', subtitel: 'Scherm 5' },
  { id: 'waarom', titel: 'Waarom deze uitleg?', subtitel: '' },
];

interface ContentBlock {
  title: string;
  body: ReactNode;
}

function getContent(id: TopicId): ContentBlock | null {
  switch (id) {
    case 'login':
      return {
        title: 'Inloggen (Scherm 1)',
        body: (
          <>
            <p className="text-sm text-slate-600 mb-2">
              Op het <span className="font-semibold">inlogscherm</span> vult u
              uw gebruikersnaam en wachtwoord in. Na een geldige login gaat u
              automatisch naar het dashboard.
            </p>
            <p className="text-sm text-slate-600">
              Dit scherm zorgt ervoor dat alleen bevoegde medewerkers toegang
              hebben tot het sondepomp-dashboard.
            </p>
          </>
        ),
      };
    case 'dashboard':
      return {
        title: 'Dashboard (Scherm 2)',
        body: (
          <>
            <p className="text-sm text-slate-600 mb-2">
              Het <span className="font-semibold">dashboard</span> is het
              startpunt na het inloggen. Hier staan de belangrijkste knoppen en
              tegels bij elkaar.
            </p>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
              <li>
                <span className="font-semibold">Actieve pompen</span> – overzicht van beschikbare pompen.
              </li>
              <li>
                <span className="font-semibold">Start/stop pomp</span> – bediening van de gekozen pomp.
              </li>
              <li>
                <span className="font-semibold">Status / logboek</span> – laatste meldingen en gebeurtenissen.
              </li>
              <li>
                <span className="font-semibold">Documentatie</span> – opent deze uitleg.
              </li>
            </ul>
          </>
        ),
      };
    case 'select-pomp':
      return {
        title: 'Selecteer pomp (Scherm 3)',
        body: (
          <>
            <p className="text-sm text-slate-600 mb-2">
              In <span className="font-semibold">“Selecteer pomp”</span> kiest
              u welke pomp u wilt bekijken of bedienen.
            </p>
            <p className="text-sm text-slate-600">
              Elke tegel toont de naam van de pomp en een korte status, zoals
              “Start klaar” of “Niet in gebruik”. Na het kiezen gaat u naar het
              pompscherm van die pomp.
            </p>
          </>
        ),
      };
    case 'pomp':
      return {
        title: 'Pompscherm (Scherm 4)',
        body: (
          <>
            <p className="text-sm text-slate-600 mb-2">
              Het <span className="font-semibold">pompscherm</span> toont
              details van de geselecteerde pomp, zoals de actuele status
              (bijvoorbeeld “Draait” of “Gestopt”).
            </p>
            <p className="text-sm text-slate-600">
              Vanuit dit scherm kan de pomp gestart of gestopt worden, afhankelijk
              van de bevoegdheden en de situatie op de afdeling.
            </p>
          </>
        ),
      };
    case 'logboek':
      return {
        title: 'Status & logboek (Scherm 5)',
        body: (
          <>
            <p className="text-sm text-slate-600 mb-2">
              Het <span className="font-semibold">statuslogboek</span> laat een
              chronologisch overzicht zien van belangrijke gebeurtenissen.
            </p>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 mb-2">
              <li>Starten of stoppen van een pomp.</li>
              <li>Wijzigingen in ingestelde toevoer / debiet.</li>
              <li>Storingen of meldingen van een pomp.</li>
            </ul>
            <p className="text-sm text-slate-600">
              Per regel ziet u de tijd, de betreffende pomp en een korte
              omschrijving. Dit helpt bij terugzoeken en overdracht tussen diensten.
            </p>
          </>
        ),
      };
    case 'waarom':
      return {
        title: 'Waarom deze uitleg?',
        body: (
          <>
            <p className="text-sm text-slate-600 mb-2">
              Deze ingebouwde uitleg is bedoeld voor gebruikers die minder
              ervaring hebben met de sondepomp of met digitale dashboards.
            </p>
            <p className="text-sm text-slate-600">
              Doordat de uitleg in de applicatie zelf zit, hoeft u geen papieren
              handleiding op te zoeken. Dit maakt het werken veiliger en
              overzichtelijker, ook in drukke situaties.
            </p>
          </>
        ),
      };
    default:
      return null;
  }
}

export default function DocumentatiePage() {
  const [activeId, setActiveId] = useState<TopicId | null>(null);

  const activeContent = activeId ? getContent(activeId) : null;

  return (
    <main className="min-h-screen bg-[#E5007D] flex flex-col">
      {/* Header */}
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

      {/* Content */}
      <div className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid gap-4 md:grid-cols-3">
            {TOPICS.map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => setActiveId(topic.id)}
                className="bg-white/95 hover:bg-white rounded-2xl shadow-md border border-slate-200 px-4 py-4 text-left transition active:scale-[0.99]"
              >
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                  {topic.subtitel || 'Info'}
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {topic.titel}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Popup / modal */}
      {activeContent && (
        <div className="fixed inset-0 z-20 flex items-center justify-center px-4">
          {/* Donkere overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setActiveId(null)}
          />

          {/* Modal card */}
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 px-6 py-5 z-30">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h2 className="text-sm font-semibold text-slate-900">
                {activeContent.title}
              </h2>
              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>
            <div>{activeContent.body}</div>
          </div>
        </div>
      )}
    </main>
  );
}
