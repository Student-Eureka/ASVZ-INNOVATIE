"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import mqtt from "mqtt";

// --- TYPES ---
interface Pomp {
  uniqueId: string;
  id: string;
  woning: string;
  status: string;
}

// --- CONFIGURATIE ---
const MQTT_BROKER = "ws://10.1.1.237:9001"; 
const MQTT_USER = "admin_user";
const MQTT_PASS = "EurekaAdmin1!";


// --- HELPERS ---
function clsx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function StatusPill({ status }: { status: string }) {
  const isAan = status.toLowerCase() === "actief";
  const isRust = status.toLowerCase() === "rust";

  const color = isAan
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : isRust
    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
    : "bg-slate-50 text-slate-500 border-slate-200";

  return (
    <span className={clsx("inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold border", color)}>
      {status}
    </span>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm px-4 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

// --- DASHBOARD ---
export default function DashboardPage() {
  const router = useRouter();
  const [pompen, setPompen] = useState<Pomp[]>([]);
  const [statusText, setStatusText] = useState("Verbinden met MQTT...");
  const [q, setQ] = useState("");

  // --- INITIAL LOAD + MQTT ---
  useEffect(() => {
    // 1️⃣ Fetch pompen uit API
    async function fetchPompen() {
      try {
        const res = await fetch("/api/pompen");
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Pompen API returned not an array:", data);
          setPompen([]); // fallback
          return;
        }

        setPompen(data.map(p => ({
          ...p,
          uniqueId: `${p.woning}_${p.id}`,
          status: p.status || "inactief" // fallback
        })));
      } catch (err) {
        console.error("Fout bij laden pompen:", err);
        setPompen([]); // fallback
      }
    }

    fetchPompen();

    // 2️⃣ MQTT verbinding
    const client = mqtt.connect(MQTT_BROKER, {  // TCP in plaats van WS
    username: MQTT_USER,
    password: MQTT_PASS,
    clientId: `dash_${Math.random().toString(16).slice(3)}`,
    reconnectPeriod: 5000, // probeer elke 5 seconden opnieuw bij disconnect
  });

    client.on("connect", () => {
      setStatusText("Live verbonden");
      console.log("MQTT Verbonden!");
      client.subscribe("asvz/+/+/+"); // alle woningen/pompen
    });

    client.on("reconnect", () => {
      console.log("MQTT probeert opnieuw te verbinden...");
      setStatusText("Verbinding opnieuw...");
    });

    client.on("close", () => {
      console.log("MQTT verbinding gesloten");
      setStatusText("Verbinding gesloten");
    });

    client.on("offline", () => {
      console.log("MQTT offline");
      setStatusText("Client offline");
    });

    client.on("error", (err) => {
      console.error("MQTT Fout:", err);
      setStatusText("Verbinding mislukt");
    });

    client.on("message", async (topic: string, message: Buffer) => {
      const [_, woningId, pompId, type] = topic.split("/");
      if (type !== "status") return;

      const statusMsg = message.toString();
      const uniqueId = `${woningId}_${pompId}`;

      setPompen(prev => {
        const exists = prev.find(p => p.uniqueId === uniqueId);
        if (exists) {
          return prev.map(p => p.uniqueId === uniqueId ? { ...p, status: statusMsg } : p);
        } else {
          return [...prev, { uniqueId, id: pompId, woning: woningId, status: statusMsg }];
        }
      });

      try {
        await fetch("/api/pompen/status", {
          method: "POST",
          body: JSON.stringify({ pomp_id: pompId, woning: woningId, status: statusMsg }),
          headers: { "Content-Type": "application/json" }
        });
      } catch (err) {
        console.error("Fout bij posten status:", err);
      }
    });


    client.on("error", (err: Error) => {
      console.error("MQTT Fout:", err);
      setStatusText("Verbinding mislukt");
    });

    return () => { client.end(); };
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout error", e);
    }
    router.push("/login");
  };

  // --- FILTERS & STATS ---
  const filteredPompen = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return pompen;
    return pompen.filter(p => p.woning.toLowerCase().includes(s) || p.id.toLowerCase().includes(s));
  }, [pompen, q]);

  const stats = useMemo(() => {
    const totaal = pompen.length;
    const actief = pompen.filter(p => p.status.toLowerCase() === "actief").length;
    const rust = pompen.filter(p => p.status.toLowerCase() === "rust").length;
    const inactief = totaal - actief - rust;
    return { totaal, actief, rust, inactief };
  }, [pompen]);

  return (
    <main className="min-h-screen bg-[#E5007D]">
      <header className="sticky top-0 z-20 bg-white/90 border-b border-slate-200 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="ASVZ Logo" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Sonde Dashboard</h1>
              <p className="text-xs text-slate-500">
                <span className={statusText === "Live verbonden" ? "text-green-600 font-bold" : "text-orange-500"}>
                  ● {statusText}
                </span>
              </p>
            </div>
          </div>
          <button onClick={logout} className="text-sm font-semibold text-slate-500 hover:text-[#E5007D]">Uitloggen</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <aside className="rounded-3xl bg-white border border-slate-200 shadow-sm p-3 h-fit hidden lg:block">
          <nav className="space-y-1">
            <button className="w-full text-left px-3 py-2 rounded-2xl text-sm font-semibold bg-slate-900 text-white transition">Overzicht Pompen</button>
            <button onClick={() => router.push('/admin')} className="w-full text-left px-3 py-2 rounded-2xl text-sm font-semibold hover:bg-slate-100 text-slate-900 transition">Beheer / Admin</button>
          </nav>
        </aside>

        <section className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <StatCard label="Gevonden Pompen" value={stats.totaal} />
            <StatCard label="Actief" value={stats.actief} />
            <StatCard label="Rust" value={stats.rust} />
            <StatCard label="Inactief" value={stats.inactief} />
          </div>

          <div className="rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div className="p-5 border-b border-slate-200">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Zoek op woning of pomp..."
                className="w-full md:w-64 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#E5007D]"
              />
            </div>

            <div className="p-5 overflow-x-auto">
              <table className="w-full text-sm text-slate-900">
                <thead>
                  <tr className="text-left text-xs text-slate-500 uppercase tracking-wide">
                    <th className="py-2 pl-2">Woning</th>
                    <th className="py-2">Pomp ID</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPompen.map((pomp) => (
                    <tr key={pomp.uniqueId} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 pl-2 font-bold text-[#E5007D]">{pomp.woning.replace('_', ' ').toUpperCase()}</td>
                      <td className="py-4 text-slate-500 font-medium">{pomp.id.replace('_', ' ')}</td>
                      <td className="py-4"><StatusPill status={pomp.status} /></td>
                    </tr>
                  ))}
                  {filteredPompen.length === 0 && (
                    <tr><td colSpan={3} className="py-8 text-center text-slate-500">Wachten op signalen...</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
