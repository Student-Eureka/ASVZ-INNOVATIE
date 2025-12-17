'use client';

import { useMemo, useState } from 'react';

type Role = 'user' | 'admin';
type NavId = 'users' | 'permissions' | 'audit';

type UserRow = { id: string; name: string; email: string; role: Role; lastLogin?: string };
type PageRule = { id: string; label: string; path: string; userCan: boolean; adminCan: boolean };

function clsx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(' ');
}

function RolePill({ role }: { role: Role }) {
  const isAdmin = role === 'admin';
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold border',
        isAdmin ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-50 text-slate-700 border-slate-200'
      )}
    >
      {role}
    </span>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm px-4 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default function AdminPanelPage() {
  const [nav, setNav] = useState<NavId>('users');
  const [q, setQ] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  // mock data (later: fetch van PHP)
  const [users, setUsers] = useState<UserRow[]>([
    { id: 'u1', name: 'Val', email: 'val@example.com', role: 'admin', lastLogin: '2025-12-15 08:55' },
    { id: 'u2', name: 'Medewerker', email: 'user@example.com', role: 'user', lastLogin: '2025-12-14 16:11' },
  ]);

  const [rules, setRules] = useState<PageRule[]>([
    { id: 'r1', label: 'Inloggen', path: '/login', userCan: true, adminCan: true },
    { id: 'r2', label: 'Dashboard', path: '/dashboard', userCan: true, adminCan: true },
    { id: 'r3', label: 'Selecteer pomp', path: '/select-pomp', userCan: true, adminCan: true },
    { id: 'r4', label: 'Pompscherm', path: '/pomp', userCan: true, adminCan: true },
    { id: 'r5', label: 'Status & logboek', path: '/logboek', userCan: true, adminCan: true },
    { id: 'r6', label: 'Admin panel', path: '/admin', userCan: false, adminCan: true },
  ]);

  // fake save hooks
  function saveUsers(next: UserRow[]) {
    setUsers(next);
    console.log('SAVE USERS -> PHP API', next);
  }
  function saveRules(next: PageRule[]) {
    setRules(next);
    console.log('SAVE RULES -> PHP API', next);
  }

  const filteredUsers = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;
    return users.filter((u) => [u.name, u.email, u.role].some((x) => (x || '').toLowerCase().includes(s)));
  }, [users, q]);

  const stats = useMemo(() => {
    const admins = users.filter((u) => u.role === 'admin').length;
    const normal = users.length - admins;
    const lockedForUser = rules.filter((r) => !r.userCan).length;
    return { admins, normal, lockedForUser };
  }, [users, rules]);

  return (
    <main className="min-h-screen bg-[#E5007D]">
      {/* Topbar */}
      <header className="sticky top-0 z-20 bg-white/90 border-b border-slate-200 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="ASVZ logo" className="w-9 h-9 object-contain" />
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Admin Panel</h1>
              <p className="text-xs text-slate-500">Users & toegang beheren</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
              <span className="text-xs text-slate-500">Actief:</span>
              <span className="text-xs font-semibold text-slate-900 capitalize">{nav}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="rounded-3xl bg-white/95 border border-slate-200 shadow-sm p-3 h-fit">
          <nav className="space-y-1">
            <button
              onClick={() => setNav('users')}
              className={clsx(
                'w-full text-left px-3 py-2 rounded-2xl text-sm font-semibold transition',
                nav === 'users' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-900'
              )}
            >
              Gebruikers
              <p className={clsx('text-xs font-normal mt-0.5', nav === 'users' ? 'text-white/80' : 'text-slate-500')}>
                Rollen & accounts
              </p>
            </button>

            <button
              onClick={() => setNav('permissions')}
              className={clsx(
                'w-full text-left px-3 py-2 rounded-2xl text-sm font-semibold transition',
                nav === 'permissions' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-900'
              )}
            >
              Toegang
              <p className={clsx('text-xs font-normal mt-0.5', nav === 'permissions' ? 'text-white/80' : 'text-slate-500')}>
                Pagina rechten
              </p>
            </button>

            <button
              onClick={() => setNav('audit')}
              className={clsx(
                'w-full text-left px-3 py-2 rounded-2xl text-sm font-semibold transition',
                nav === 'audit' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-900'
              )}
            >
              Audit
              <p className={clsx('text-xs font-normal mt-0.5', nav === 'audit' ? 'text-white/80' : 'text-slate-500')}>
                Log (placeholder)
              </p>
            </button>
          </nav>
        </aside>

        {/* Content */}
        <section className="space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard label="Admins" value={String(stats.admins)} />
            <StatCard label="Users" value={String(stats.normal)} />
            <StatCard label="Geblokkeerd voor user" value={String(stats.lockedForUser)} />
          </div>

          {/* USERS */}
          {nav === 'users' && (
            <div className="rounded-3xl bg-white/95 border border-slate-200 shadow-sm">
              <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Gebruikers</h2>
                  <p className="text-xs text-slate-500">Zoek, voeg toe en wijzig rollen.</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Zoek op naam, email, rol…"
                    className="w-full md:w-64 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                  <button
                    onClick={() => setShowAdd(true)}
                    className="rounded-2xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-800"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div className="p-5 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-500">
                      <th className="py-2">Naam</th>
                      <th className="py-2">Email</th>
                      <th className="py-2">Rol</th>
                      <th className="py-2">Laatste login</th>
                      <th className="py-2 text-right">Actie</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="border-t border-slate-200">
                        <td className="py-3 font-semibold text-slate-900">{u.name}</td>
                        <td className="py-3 text-slate-600">{u.email}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <RolePill role={u.role} />
                            <select
                              className="rounded-xl border border-slate-200 bg-white px-2 py-1 text-sm"
                              value={u.role}
                              onChange={(e) => {
                                const role = e.target.value as Role;
                                saveUsers(users.map((x) => (x.id === u.id ? { ...x, role } : x)));
                              }}
                            >
                              <option value="user">user</option>
                              <option value="admin">admin</option>
                            </select>
                          </div>
                        </td>
                        <td className="py-3 text-slate-600">{u.lastLogin || '—'}</td>
                        <td className="py-3 text-right">
                          <button
                            className="text-xs text-slate-500 hover:text-slate-900"
                            onClick={() => {
                              // placeholder: later delete endpoint
                              console.log('DELETE USER', u.id);
                            }}
                          >
                            Verwijder
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">
                          Geen gebruikers gevonden.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PERMISSIONS */}
          {nav === 'permissions' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="rounded-3xl bg-white/95 border border-slate-200 shadow-sm">
                <div className="p-5 border-b border-slate-200">
                  <h2 className="text-base font-semibold text-slate-900">Pagina rechten</h2>
                  <p className="text-xs text-slate-500">Zet aan/uit per rol.</p>
                </div>
                <div className="p-5 space-y-3">
                  {rules.map((r) => (
                    <div key={r.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{r.label}</p>
                          <p className="text-xs text-slate-500">{r.path}</p>
                        </div>
                        <button
                          className="text-xs text-slate-500 hover:text-slate-900"
                          onClick={() => console.log('OPEN', r.path)}
                        >
                          Open
                        </button>
                      </div>

                      <div className="mt-3 flex items-center gap-6 text-sm">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={r.userCan}
                            onChange={(e) => {
                              saveRules(rules.map((x) => (x.id === r.id ? { ...x, userCan: e.target.checked } : x)));
                            }}
                          />
                          <span className="text-slate-700">user</span>
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={r.adminCan}
                            onChange={(e) => {
                              saveRules(rules.map((x) => (x.id === r.id ? { ...x, adminCan: e.target.checked } : x)));
                            }}
                          />
                          <span className="text-slate-700">admin</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white/95 border border-slate-200 shadow-sm">
                <div className="p-5 border-b border-slate-200">
                  <h2 className="text-base font-semibold text-slate-900">Matrix</h2>
                  <p className="text-xs text-slate-500">Snel overzicht per route.</p>
                </div>
                <div className="p-5 overflow-x-auto">
                  <table className="w-full text-sm border border-slate-200 rounded-2xl overflow-hidden">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left px-3 py-2 font-semibold text-slate-700">Pagina</th>
                        <th className="text-left px-3 py-2 font-semibold text-slate-700">Route</th>
                        <th className="text-left px-3 py-2 font-semibold text-slate-700">user</th>
                        <th className="text-left px-3 py-2 font-semibold text-slate-700">admin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rules.map((r) => (
                        <tr key={r.id} className="border-t border-slate-200 bg-white">
                          <td className="px-3 py-2 font-semibold text-slate-900">{r.label}</td>
                          <td className="px-3 py-2 text-slate-600">{r.path}</td>
                          <td className="px-3 py-2">{r.userCan ? '✅' : '—'}</td>
                          <td className="px-3 py-2">{r.adminCan ? '✅' : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <p className="text-xs text-slate-500 mt-3">
                    Later moet je dit server-side afdwingen (PHP), anders is het alleen UI.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AUDIT */}
          {nav === 'audit' && (
            <div className="rounded-3xl bg-white/95 border border-slate-200 shadow-sm">
              <div className="p-5 border-b border-slate-200">
                <h2 className="text-base font-semibold text-slate-900">Audit log</h2>
                <p className="text-xs text-slate-500">Placeholder: later vul je dit vanuit je DB (wie wijzigde wat).</p>
              </div>
              <div className="p-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  Nog leeg. (Later: “Val changed role user@example.com → admin”, etc.)
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Add user modal */}
      {showAdd && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAdd(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 px-6 py-5 z-50">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-sm font-semibold text-slate-900">Gebruiker toevoegen</h3>
              <button onClick={() => setShowAdd(false)} className="text-xs text-slate-500 hover:text-slate-800">
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const name = String(fd.get('name') || '').trim() || 'Onbekend';
                const email = String(fd.get('email') || '').trim();
                const role = String(fd.get('role') || 'user') as Role;
                if (!email) return;

                const next: UserRow[] = [
                  { id: crypto.randomUUID(), name, email, role, lastLogin: '—' },
                  ...users,
                ];
                saveUsers(next);
                setShowAdd(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs text-slate-600">Naam</label>
                <input name="name" className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-slate-600">Email</label>
                <input name="email" type="email" required className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-slate-600">Rol</label>
                <select name="role" defaultValue="user" className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm">
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>

              <button className="w-full rounded-2xl bg-slate-900 text-white px-3 py-2 text-sm font-semibold hover:bg-slate-800">
                Opslaan
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
