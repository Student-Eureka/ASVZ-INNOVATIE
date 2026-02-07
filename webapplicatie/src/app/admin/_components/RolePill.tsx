import type { Role } from '../_types/admin';
import { clsx } from './clsx';

export default function RolePill({ role }: { role: Role }) {
  const isAdmin = role === 'admin';
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold border',
        isAdmin
          ? 'bg-rose-50 text-rose-700 border-rose-200'
          : 'bg-slate-50 text-slate-900 border-slate-200'
      )}
    >
      {role}
    </span>
  );
}
