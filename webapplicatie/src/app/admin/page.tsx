'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import AppSidebar from '../_components/AppSidebar';
import AddUserModal from './_components/AddUserModal';
import EditUserModal from './_components/EditUserModal';
import AdminNav from './_components/AdminNav';
import AuditSection from './_components/AuditSection';
import NewPumpsSection from './_components/NewPumpsSection';
import StatCard from './_components/StatCard';
import UsersSection from './_components/UsersSection';
import type { AuditRow, NavId, NewPumpRow, Role, UserRow } from './_types/admin';

export default function AdminPanelPage() {
  const [nav, setNav] = useState<NavId>('users');
  const [q, setQ] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [newPumps, setNewPumps] = useState<NewPumpRow[]>([]);
  const [auditEntries, setAuditEntries] = useState<AuditRow[]>([]);
  const [reloadKey, setReloadKey] = useState(0);
  const [savingPompId, setSavingPompId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchAdminData() {
      try {
        const [usersRes, newPumpsRes, auditRes] = await Promise.all([
          fetch('/api/users', { cache: 'no-store' }),
          fetch('/api/admin/pompen/new', { cache: 'no-store' }),
          fetch('/api/admin/audit', { cache: 'no-store' }),
        ]);

        if (!usersRes.ok || !newPumpsRes.ok || !auditRes.ok) {
          throw new Error('Kon admin data niet ophalen');
        }

        const [usersData, newPumpsData, auditData] = (await Promise.all([
          usersRes.json(),
          newPumpsRes.json(),
          auditRes.json(),
        ])) as [UserRow[], NewPumpRow[], AuditRow[]];

        if (!active) {
          return;
        }

        setUsers(Array.isArray(usersData) ? usersData : []);
        setNewPumps(Array.isArray(newPumpsData) ? newPumpsData : []);
        setAuditEntries(Array.isArray(auditData) ? auditData : []);
      } catch (err) {
        console.error(err);
        if (!active) {
          return;
        }

        setUsers([]);
        setNewPumps([]);
        setAuditEntries([]);
      }
    }

    fetchAdminData();
    const interval = window.setInterval(fetchAdminData, 5000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [reloadKey]);

  async function updateUserDetails(payload: {
    id: string;
    name: string;
    role: Role;
    password?: string;
  }) {
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Kon gebruiker niet bijwerken');
      setReloadKey((value) => value + 1);
      setEditingUser(null);
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
      setReloadKey((value) => value + 1);
    } catch (err) {
      console.error(err);
    }
  }

  async function addUser(name: string, role: Role) {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ name, role, password: 'Wachtwoord123' }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Kon gebruiker niet toevoegen');
      setShowAdd(false);
      setReloadKey((value) => value + 1);
    } catch (err) {
      console.error(err);
    }
  }

  async function addPumpToDatabase(pompId: string) {
    try {
      setSavingPompId(pompId);
      const res = await fetch('/api/admin/pompen/new', {
        method: 'POST',
        body: JSON.stringify({ pompId }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Kon pomp niet toevoegen');
      setReloadKey((value) => value + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingPompId(null);
    }
  }

  const filteredUsers = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;
    return users.filter((u) =>
      [u.name, u.role, u.woningId].some((x) => (x || '').toLowerCase().includes(s))
    );
  }, [users, q]);

  const stats = useMemo(() => {
    const admins = users.filter((u) => u.role === 'admin').length;
    return {
      accounts: users.length,
      admins,
      newPumps: newPumps.length,
      auditRows: auditEntries.length,
    };
  }, [auditEntries.length, newPumps.length, users]);

  return (
    <main className="min-h-screen bg-[#E5007D]">
      <header className="sticky top-0 z-20 bg-white/90 border-b border-slate-200 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="ASVZ logo" width={36} height={36} className="w-9 h-9 object-contain" />
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Admin Panel</h1>
              <p className="text-xs text-slate-500">
                Gebruikers, nieuwe pompen en audit per woning
              </p>
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
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <StatCard label="Accounts" value={String(stats.accounts)} />
            <StatCard label="Admins" value={String(stats.admins)} />
            <StatCard label="Nieuwe pompen" value={String(stats.newPumps)} />
            <StatCard label="Auditregels" value={String(stats.auditRows)} />
          </div>

          {nav === 'users' && (
            <UsersSection
              users={filteredUsers}
              q={q}
              onQueryChange={setQ}
              onEdit={(user) => setEditingUser(user)}
              onDelete={deleteUser}
              onAdd={() => setShowAdd(true)}
            />
          )}

          {nav === 'new-pumps' && (
            <NewPumpsSection
              pumps={newPumps}
              savingPompId={savingPompId}
              onAdd={addPumpToDatabase}
            />
          )}

          {nav === 'audit' && <AuditSection entries={auditEntries} />}
        </section>
      </div>

      {showAdd && <AddUserModal onClose={() => setShowAdd(false)} onSubmit={addUser} />}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={updateUserDetails}
        />
      )}
    </main>
  );
}
