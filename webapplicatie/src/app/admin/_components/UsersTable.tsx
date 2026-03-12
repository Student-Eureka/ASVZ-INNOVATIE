import RolePill from './RolePill';
import type { UserRow } from '../_types/admin';

interface UsersTableProps {
  users: UserRow[];
  onEdit: (user: UserRow) => void;
  onDelete: (id: string) => void;
}

export default function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  return (
    <table className="w-full text-sm text-slate-900">
      <thead>
        <tr className="text-left text-xs text-slate-500">
          <th className="py-2">Naam</th>
          <th className="py-2">Woning ID</th>
          <th className="py-2">Rol</th>
          <th className="py-2">Laatste login</th>
          <th className="py-2 text-right">Actie</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id} className="border-t border-slate-200">
            <td className="py-3 font-semibold">{u.name}</td>
            <td className="py-3 font-medium text-slate-500">{u.woningId}</td>
            <td className="py-3">
              <div className="flex items-center gap-2">
                <RolePill role={u.role} />
              </div>
            </td>
            <td className="py-3">{u.lastLogin || '-'}</td>
            <td className="py-3 text-right">
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => onEdit(u)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Wijziging
                </button>
                <button
                  onClick={() => onDelete(u.id)}
                  className="text-xs text-slate-500 hover:text-slate-900"
                >
                  Verwijder
                </button>
              </div>
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
