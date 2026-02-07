import type { Role } from '../_types/admin';

interface AddUserModalProps {
  onClose: () => void;
  onSubmit: (name: string, email: string, role: Role) => void;
}

export default function AddUserModal({ onClose, onSubmit }: AddUserModalProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 px-6 py-5 z-50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const name = String(fd.get('name') || '').trim() || 'Onbekend';
            const email = String(fd.get('email') || '').trim();
            const role = String(fd.get('role') || 'user') as Role;
            if (!email) return;
            onSubmit(name, email, role);
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
  );
}
