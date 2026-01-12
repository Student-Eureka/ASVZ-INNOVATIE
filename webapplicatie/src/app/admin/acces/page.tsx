'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast'; // optioneel, voor feedback bij opslaan/verwijderen

type Role = 'user' | 'admin';
type NavId = 'users' | 'permissions' | 'audit';

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: Role;
  lastLogin?: string;
};

type PageRule = {
  id: string;
  label: string;
  path: string;
  userCan: boolean;
  adminCan: boolean;
};

// Utility
function clsx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(' ');
}

function RolePill({ role }: { role: Role }) {
  const isAdmin = role === 'admin';
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold border',
        isAdmin
          ? 'bg-rose-50 text-rose-700 border-rose-200'
          : 'bg-slate-50 text-slate-900 border-slate-200' // zwart voor leesbaarheid
      )}
    >
      {role}
    </span>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm px-4 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default function AdminPanelPage() {
  const [nav, setNav] = useState<NavId>('users');
  const [q, setQ] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [rules, setRules] = useState<PageRule[]>([
    { id: 'r1', label: 'Inloggen', path: '/login', userCan: true, adminCan: true },
    { id: 'r2', label: 'Dashboard', path: '/dashboard', userCan: true, adminCan: true },
    { id: 'r3', label: 'Selecteer pomp', path: '/select-pomp', userCan: true, adminCan: true },
    { id: 'r4', label: 'Pompscherm', path: '/pomp', userCan: true, adminCan: true },
    { id: 'r5', label: 'Status & logboek', path: '/logboek', userCan: true, adminCan: true },
    { id: 'r6', label: 'Admin panel', path: '/admin', userCan: false, adminCan: true },
  ]);

  // --- API Fetch users ---
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Kan gebruikers niet ophalen');
        const data: UserRow[] = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUsers();
  }, []);

  // --- Save user updates (rol) ---
  async function saveUserRole(userId: string, role: Role) {
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        body: JSON.stringify({ id: userId, role }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Kon rol niet opslaan');
      setUsers(users.map(u => (u.id === userId ? { ...u, role } : u)));
    } catch (err) {
      console.error(err);
    }
  }

  // --- Delete user ---
  async function deleteUser(userId: string) {
    try {
      const res = await fetch('/api/users', {
        method: 'DELETE',
        body: JSON.stringify({ id: userId }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Kon gebruiker niet verwijderen');
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      console.error(err);
    }
  }

  // --- Add user ---
  async function addUser(name: string, email: string, role: Role) {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ name, email, role, password: 'Wachtwoord123' }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Kon gebruiker niet toevoegen');
      const newUser = await res.json();
      setUsers([{ id: newUser.id, name, email, role, lastLogin: '—' }, ...users]);
      setShowAdd(false);
    } catch (err) {
      console.error(err);
    }
  }

  // --- Filtered users ---
  const filteredUsers = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;
    return users.filter(u =>
      [u.name, u.email, u.role].some(x => (x || '').toLowerCase().includes(s))
    );
  }, [users, q]);

  const stats = useMemo(() => {
    const admins = users.filter(u => u.role === 'admin').length;
    const normal = users.length - admins;
    const lockedForUser = rules.filter(r => !r.userCan).length;
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
        </div>
      </header>

      {/* Layout */}
      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="rounded-3xl bg-white border border-slate-200 shadow-sm p-3 h-fit">
          <nav className="space-y-1">
            <button
              onClick={() => setNav('users')}
              className={clsx(
                'w-full text-left px-3 py-2 rounded-2xl text-sm font-semibold transition',
                nav === 'users' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-900'
              )}
            >
              Gebruikers
            </button>
            <button
              onClick={() => setNav('permissions')}
              className={clsx(
                'w-full text-left px-3 py-2 rounded-2xl text-sm font-semibold transition',
                nav === 'permissions' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-900'
              )}
            >
              Toegang
            </button>
            <button
              onClick={() => setNav('audit')}
              className={clsx(
                'w-full text-left px-3 py-2 rounded-2xl text-sm font-semibold transition',
                nav === 'audit' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-900'
              )}
            >
              Audit
            </button>
          </nav>
        </aside>

        {/* Content */}
        <section className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard label="Admins" value={String(stats.admins)} />
            <StatCard label="Users" value={String(stats.normal)} />
            <StatCard label="Geblokkeerd voor user" value={String(stats.lockedForUser)} />
          </div>

          {/* USERS */}
          {nav === 'users' && (
            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <input
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder="Zoek op naam, email, rol…"
                  className="w-full md:w-64 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                />
                <button
                  onClick={() => setShowAdd(true)}
                  className="rounded-2xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-800"
                >
                  + Add
                </button>
              </div>

              <div className="p-5 overflow-x-auto">
                <table className="w-full text-sm text-slate-900">
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
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="border-t border-slate-200">
                        <td className="py-3 font-semibold">{u.name}</td>
                        <td className="py-3">{u.email}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <RolePill role={u.role} />
                            <select
                              value={u.role}
                              onChange={e => saveUserRole(u.id, e.target.value as Role)}
                              className="rounded-xl border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900"
                            >
                              <option value="user">user</option>
                              <option value="admin">admin</option>
                            </select>
                          </div>
                        </td>
                        <td className="py-3">{u.lastLogin || '—'}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="text-xs text-slate-500 hover:text-slate-900"
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

          {/* PERMISSIONS & AUDIT kunnen later dynamisch */}
        </section>
      </div>

      {/* Add user modal */}
      {showAdd && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAdd(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 px-6 py-5 z-50">
            <form
              onSubmit={e => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const name = String(fd.get('name') || '').trim() || 'Onbekend';
                const email = String(fd.get('email') || '').trim();
                const role = String(fd.get('role') || 'user') as Role;
                if (!email) return;
                addUser(name, email, role);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs text-slate-600">Naam</label>
                <input
                  name="name"
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600">Rol</label>
                <select
                  name="role"
                  defaultValue="user"
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                >
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
