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

function normalizeUserRow(value: unknown): UserRow | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const row = value as Record<string, unknown>;
  const role = row.role === 'admin' ? 'admin' : 'user';

  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? ''),
    role,
    lastLogin: row.lastLogin ? String(row.lastLogin) : undefined,
    woningId: String(row.woningId ?? ''),
  };
}

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
  const [userError, setUserError] = useState<string | null>(null);
  const [selectedWoningen, setSelectedWoningen] = useState<Record<string, string>>({});

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

        setUsers(
          Array.isArray(usersData)
            ? usersData.map(normalizeUserRow).filter((user): user is UserRow => Boolean(user))
            : []
        );
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

  useEffect(() => {
    setSelectedWoningen((current) => {
      const next = { ...current };

      for (const pump of newPumps) {
        if (next[pump.uniqueId]) {
          continue;
        }

        const exactMatch = users.find((user) => user.woningId === pump.woning);
        next[pump.uniqueId] = exactMatch?.woningId ?? '';
      }

      return next;
    });
  }, [newPumps, users]);

  async function updateUserDetails(payload: {
    id: string;
    name: string;
    role: Role;
    password?: string;
  }) {
    try {
      setUserError(null);
      const res = await fetch('/api/users', {
        method: 'PATCH',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) throw new Error(data.message || 'Kon gebruiker niet bijwerken');
      setReloadKey((value) => value + 1);
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      setUserError(err instanceof Error ? err.message : 'Kon gebruiker niet bijwerken');
    }
  }

  async function deleteUser(userId: string) {
    try {
      setUserError(null);
      const res = await fetch('/api/users', {
        method: 'DELETE',
        body: JSON.stringify({ id: userId }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) throw new Error(data.message || 'Kon gebruiker niet verwijderen');
      setReloadKey((value) => value + 1);
    } catch (err) {
      console.error(err);
      setUserError(err instanceof Error ? err.message : 'Kon gebruiker niet verwijderen');
    }
  }

  async function addUser(payload: { name: string; password: string; role: Role }) {
    try {
      setUserError(null);
      const res = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) throw new Error(data.message || 'Kon gebruiker niet toevoegen');
      setShowAdd(false);
      setReloadKey((value) => value + 1);
    } catch (err) {
      console.error(err);
      setUserError(err instanceof Error ? err.message : 'Kon gebruiker niet toevoegen');
    }
  }

  async function addPumpToDatabase(pump: NewPumpRow) {
    try {
      setSavingPompId(pump.uniqueId);
      setUserError(null);
      const targetWoningId = selectedWoningen[pump.uniqueId];
      if (!targetWoningId) {
        throw new Error('Kies eerst een doelwoning');
      }

      const res = await fetch('/api/admin/pompen/new', {
        method: 'POST',
        body: JSON.stringify({
          pompId: pump.id,
          woning: pump.woning,
          targetWoningId,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) throw new Error(data.message || 'Kon pomp niet toevoegen');

      setNewPumps((current) => current.filter((item) => item.uniqueId !== pump.uniqueId));
      setSelectedWoningen((current) => {
        const next = { ...current };
        delete next[pump.uniqueId];
        return next;
      });

      setReloadKey((value) => value + 1);
    } catch (err) {
      console.error(err);
      setUserError(err instanceof Error ? err.message : 'Kon pomp niet toevoegen');
    } finally {
      setSavingPompId(null);
    }
  }

  function handleSelectPumpWoning(pump: NewPumpRow, woningId: string) {
    setSelectedWoningen((current) => ({
      ...current,
      [pump.uniqueId]: woningId,
    }));
  }

  const filteredUsers = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;
    return users.filter((u) =>
      [u.name, u.role, u.woningId].some((x) => String(x ?? '').toLowerCase().includes(s))
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

          {userError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {userError}
            </div>
          )}

          {nav === 'users' && (
            <div className="space-y-3">
              <UsersSection
                users={filteredUsers}
                q={q}
                onQueryChange={setQ}
                onEdit={(user) => setEditingUser(user)}
                onDelete={deleteUser}
                onAdd={() => setShowAdd(true)}
              />
            </div>
          )}

          {nav === 'new-pumps' && (
            <NewPumpsSection
              pumps={newPumps}
              users={users}
              savingPompId={savingPompId}
              selectedWoningen={selectedWoningen}
              onSelectWoning={handleSelectPumpWoning}
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
