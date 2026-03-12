import UsersTable from './UsersTable';
import type { UserRow } from '../_types/admin';

interface UsersSectionProps {
  users: UserRow[];
  q: string;
  onQueryChange: (value: string) => void;
  onEdit: (user: UserRow) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function UsersSection({
  users,
  q,
  onQueryChange,
  onEdit,
  onDelete,
  onAdd,
}: UsersSectionProps) {
  return (
    <div className="rounded-3xl bg-white border border-slate-200 shadow-sm">
      <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Gebruikers</h2>
          <p className="text-sm text-slate-500">Accounts uit de database.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            value={q}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Zoek op naam, rol, woning..."
            className="w-full md:w-64 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          />
          <button
            onClick={onAdd}
            className="rounded-2xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-800"
          >
            + Gebruiker
          </button>
        </div>
      </div>

      <div className="p-5 overflow-x-auto">
        <UsersTable users={users} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}
