"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";

// --- TYPES ---
interface Pomp {
  id: string | number;
  naam: string;
  status: string; // Bijv: "Aan", "Uit", "Storing"
}

// --- UTILITY ---
function clsx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

// --- COMPONENT: Status Badge ---
function StatusPill({ status }: { status: string }) {
  const isAan = status.toLowerCase() === "aan";
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold border",
        isAan
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-slate-50 text-slate-500 border-slate-200"
      )}
    >
      {status}
    </span>
  );
}

// --- COMPONENT: StatCard ---
function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm px-4 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();

  // --- STATE ---
  const [pompen, setPompen] = useState<Pomp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  // --- DATA OPHALEN ---
  useEffect(() => {
    const haalPompenOp = async () => {
      try {
        // PAS OP: Vervang dit door het juiste IP-adres van je Pi
        const res = await fetch("http://192.168.x.x/api/pompen.php");
        if (!res.ok) throw new Error("Kon data niet ophalen");
        
        const data = (await res.json()) as Pomp[];
        setPompen(data);
      } catch (err) {
        console.error(err);
        setError("Kan geen verbinding maken met de Pi.");
      } finally {
        setLoading(false);
      }
    };

    haalPompenOp();
    
    // Ververs elke 5 seconden
    const interval = setInterval(haalPompenOp, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- UITLOGGEN ---
  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  // --- FILTERS & STATS ---
  const filteredPompen = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return pompen;
    return pompen.filter((p) => 
      p.naam.toLowerCase().includes(s) || String(p.id).includes(s)
    );
  }, [pompen, q]);

  const stats = useMemo(() => {
    const totaal = pompen.length;
    const aan = pompen.filter((p) => p.status.toLowerCase() === "aan").length;
    const uit = totaal - aan;
    return { totaal, aan, uit };
  }, [pompen]);

  return (
    <main className="min-h-screen bg-[#E5007D]">
      
      {/* Topbar */}
      <header className="sticky top-0 z-20 bg-white/90 border-b border-slate-200 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            
            {/* HIER IS DE WIJZIGING: LOGO UIT PUBLIC MAP */}
            <img 
              src="/logo.svg" 
              alt="ASVZ Logo" 
              className="w-10 h-10 object-contain" 
            />

            <div>
              <h1 className="text-lg font-semibold text-slate-900">Sonde Dashboard</h1>
              <p className="text-xs text-slate-500">Actueel pompenoverzicht</p>
            </div>
          </div>
          
          <button 
             onClick={logout} 
             className="text-sm font-semibold text-slate-500 hover:text-[#E5007D]"
          >
            Uitloggen
          </button>
        </div>
      </header>

      {/* Layout */}
      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        
        {/* Sidebar */}
        <aside className="rounded-3xl bg-white border border-slate-200 shadow-sm p-3 h-fit hidden lg:block">
          <nav className="space-y-1">
            <button className="w-full text-left px-3 py-2 rounded-2xl text-sm font-semibold bg-slate-900 text-white transition">
              Overzicht Pompen
            </button>
            <button 
              onClick={() => router.push('/admin')}
              className="w-full text-left px-3 py-2 rounded-2xl text-sm font-semibold hover:bg-slate-100 text-slate-900 transition"
            >
              Beheer / Admin
            </button>
            <button className="w-full text-left px-3 py-2 rounded-2xl text-sm font-semibold hover:bg-slate-100 text-slate-900 transition text-slate-400 cursor-not-allowed">
              Logboek (Coming soon)
            </button>
          </nav>
        </aside>

        {/* Content */}
        <section className="space-y-6">
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard label="Totaal Pompen" value={stats.totaal} />
            <StatCard label="Nu Actief" value={stats.aan} />
            <StatCard label="In Rust / Uit" value={stats.uit} />
          </div>

          {/* Tabel Container */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-sm">
            
            {/* Tabel Header / Zoekbalk */}
            <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Zoek op pompnaam of ID..."
                className="w-full md:w-64 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#E5007D]"
              />
              <button 
                onClick={() => alert("Nieuwe pomp toevoegen?")}
                className="hidden md:block rounded-2xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-800"
              >
                + Pomp
              </button>
            </div>

            {/* De Lijst */}
            <div className="p-5 overflow-x-auto">
                {loading && <p className="text-center text-slate-500 py-4">Gegevens ophalen...</p>}
                {error && <p className="text-center text-red-500 py-4 font-bold">{error}</p>}

                {!loading && !error && (
                  <table className="w-full text-sm text-slate-900">
                    <thead>
                      <tr className="text-left text-xs text-slate-500 uppercase tracking-wide">
                        <th className="py-2 pl-2">Naam</th>
                        <th className="py-2">ID</th>
                        <th className="py-2">Status</th>
                        <th className="py-2 text-right pr-2">Actie</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPompen.map((pomp) => (
                        <tr key={pomp.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 pl-2 font-semibold">{pomp.naam}</td>
                          <td className="py-4 text-slate-500">{pomp.id}</td>
                          <td className="py-4">
                             <StatusPill status={pomp.status} />
                          </td>
                          <td className="py-4 text-right pr-2">
                            <button className="text-xs font-bold text-[#E5007D] hover:underline">
                              Bekijk
                            </button>
                          </td>
                        </tr>
                      ))}
                      
                      {filteredPompen.length === 0 && (
                        <tr>
                            <td colSpan={4} className="py-8 text-center text-slate-500">
                                Geen pompen gevonden.
                            </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
            </div>
          </div>

        </section>
      </div>
    </main>
  );
}