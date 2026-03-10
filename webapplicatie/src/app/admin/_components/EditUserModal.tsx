import type { Role, UserRow } from '../_types/admin';

interface EditUserModalProps {
  user: UserRow;
  onClose: () => void;
  onSubmit: (payload: { id: string; name: string; role: Role; password?: string }) => void;
}

export default function EditUserModal({ user, onClose, onSubmit }: EditUserModalProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 px-6 py-5 z-50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const name = String(fd.get('name') || '').trim() || user.name;
            const role = String(fd.get('role') || user.role) as Role;
            const password = String(fd.get('password') || '').trim();
            onSubmit({ id: user.id, name, role, password: password || undefined });
          }}
          className="space-y-3"
        >
          <div>
            <label className="text-xs text-slate-600">Naam</label>
            <input
              name="name"
              defaultValue={user.name}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
            />
          </div>
          <div>
            <label className="text-xs text-slate-600">Rol</label>
            <select
              name="role"
              defaultValue={user.role}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-600">Nieuw wachtwoord (optioneel)</label>
            <input
              name="password"
              type="password"
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
            />
          </div>

          <p className="text-xs text-slate-500">
            Laat wachtwoord leeg om het ongewijzigd te laten.
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Annuleren
            </button>
            <button className="w-full rounded-2xl bg-slate-900 text-white px-3 py-2 text-sm font-semibold hover:bg-slate-800">
              Opslaan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
