import RolePill from './RolePill';
import type { Role, UserRow } from '../_types/admin';

interface UsersTableProps {
  users: UserRow[];
  onRoleChange: (id: string, role: Role) => void;
  onDelete: (id: string) => void;
}

export default function UsersTable({ users, onRoleChange, onDelete }: UsersTableProps) {
  return (
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
        {users.map((u) => (
          <tr key={u.id} className="border-t border-slate-200">
            <td className="py-3 font-semibold">{u.name}</td>
            <td className="py-3">{u.email}</td>
            <td className="py-3">
              <div className="flex items-center gap-2">
                <RolePill role={u.role} />
                <select
                  value={u.role}
                  onChange={(e) => onRoleChange(u.id, e.target.value as Role)}
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
                onClick={() => onDelete(u.id)}
                className="text-xs text-slate-500 hover:text-slate-900"
              >
                Verwijder
              </button>
            </td>
          </tr>
        ))}
        {users.length === 0 && (
          <tr>
            <td colSpan={5} className="py-8 text-center text-slate-500">
              Geen gebruikers gevonden.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
