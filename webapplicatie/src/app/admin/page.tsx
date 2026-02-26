'use client';

import { useEffect, useMemo, useState } from 'react';

import AppSidebar from '../_components/AppSidebar';
import AddUserModal from './_components/AddUserModal';
import AdminNav from './_components/AdminNav';
import StatCard from './_components/StatCard';
import UsersSection from './_components/UsersSection';
import type { NavId, Role, UserRow } from './_types/admin';
import { DEFAULT_RULES } from './_data/rules';

export default function AdminPanelPage() {
  const [nav, setNav] = useState<NavId>('users');
  const [q, setQ] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [users, setUsers] = useState<UserRow[]>([]);

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

  async function saveUserRole(userId: string, role: Role) {
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        body: JSON.stringify({ id: userId, role }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Kon rol niet opslaan');
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteUser(userId: string) {
    try {
      const res = await fetch('/api/users', {
        method: 'DELETE',
        body: JSON.stringify({ id: userId }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Kon gebruiker niet verwijderen');
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error(err);
    }
  }

  async function addUser(name: string, email: string, role: Role) {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ name, email, role, password: 'Wachtwoord123' }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Kon gebruiker niet toevoegen');
      const newUser = await res.json();
      setUsers((prev) => [
        { id: newUser.id, name, email, role, lastLogin: '—' },
        ...prev,
      ]);
      setShowAdd(false);
    } catch (err) {
      console.error(err);
    }
  }

  const filteredUsers = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;
    return users.filter((u) =>
      [u.name, u.email, u.role].some((x) => (x || '').toLowerCase().includes(s))
    );
  }, [users, q]);

  const stats = useMemo(() => {
    const admins = users.filter((u) => u.role === 'admin').length;
    const normal = users.length - admins;
    const lockedForUser = DEFAULT_RULES.filter((r) => !r.userCan).length;
    return { admins, normal, lockedForUser };
  }, [users]);

  return (
    <main className="min-h-screen bg-[#E5007D]">
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

      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <div className="hidden lg:block">
          <AppSidebar>
            <AdminNav nav={nav} onSelect={setNav} />
          </AppSidebar>
        </div>

        <section className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard label="Admins" value={String(stats.admins)} />
            <StatCard label="Users" value={String(stats.normal)} />
            <StatCard
              label="Geblokkeerd voor user"
              value={String(stats.lockedForUser)}
            />
          </div>

          {nav === 'users' && (
            <UsersSection
              users={filteredUsers}
              q={q}
              onQueryChange={setQ}
              onRoleChange={saveUserRole}
              onDelete={deleteUser}
              onAdd={() => setShowAdd(true)}
            />
          )}
        </section>
      </div>

      {showAdd && (
        <AddUserModal onClose={() => setShowAdd(false)} onSubmit={addUser} />
      )}
    </main>
  );
}
