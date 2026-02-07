import UsersTable from './UsersTable';
import type { Role, UserRow } from '../_types/admin';

interface UsersSectionProps {
  users: UserRow[];
  q: string;
  onQueryChange: (value: string) => void;
  onRoleChange: (id: string, role: Role) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function UsersSection({
  users,
  q,
  onQueryChange,
  onRoleChange,
  onDelete,
  onAdd,
}: UsersSectionProps) {
  return (
    <div className="rounded-3xl bg-white border border-slate-200 shadow-sm">
      <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <input
          value={q}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Zoek op naam, email, rol..."
          className="w-full md:w-64 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
        />
        <button
          onClick={onAdd}
          className="rounded-2xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-800"
        >
          + Add
        </button>
      </div>

      <div className="p-5 overflow-x-auto">
        <UsersTable users={users} onRoleChange={onRoleChange} onDelete={onDelete} />
      </div>
    </div>
  );
}
