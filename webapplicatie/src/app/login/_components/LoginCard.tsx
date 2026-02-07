'use client';

import { useState } from 'react';

import type { LoginPayload, LoginResponse } from '../_types/login';

export default function LoginCard() {
  const [gebruikersnaam, setGebruikersnaam] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: LoginPayload = { gebruikersnaam, wachtwoord };

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = (await res.json()) as LoginResponse;

    if (data.success) {
      window.location.href = '/';
    } else {
      alert(data.message ?? 'Inloggen mislukt');
    }
  };

  return (
    <div className="w-full max-w-md bg-white/95 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
      <div className="flex items-center gap-4 px-6 py-5 bg-white">
        <img
          src="/logo.svg"
          alt="ASVZ logo"
          className="w-16 h-16 object-contain"
        />
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            ASVZ Sondedashboard
          </h1>
          <p className="text-xs text-slate-500">
            Log in om de sondepompen te beheren.
          </p>
        </div>
      </div>

      <div className="h-1 bg-[#E5007D]" />

      <div className="px-6 py-6">
        <h2 className="text-base font-semibold text-slate-900 mb-1">Inloggen</h2>
        <p className="text-xs text-slate-500 mb-5">
          Gebruik uw ASVZ-account om verder te gaan.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Gebruikersnaam
            </label>
            <input
              type="text"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#E5007D] focus:ring-1 focus:ring-[#E5007D]"
              placeholder="Gebruikersnaam"
              autoComplete="username"
              value={gebruikersnaam}
              onChange={(e) => setGebruikersnaam(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Wachtwoord
            </label>
            <input
              type="password"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#E5007D] focus:ring-1 focus:ring-[#E5007D]"
              placeholder="Wachtwoord"
              autoComplete="current-password"
              value={wachtwoord}
              onChange={(e) => setWachtwoord(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#E5007D] hover:bg-[#ff3a9f] text-white font-semibold py-2 rounded-lg text-sm tracking-wide transition shadow-md"
          >
            Inloggen
          </button>
        </form>
      </div>
    </div>
  );
}
