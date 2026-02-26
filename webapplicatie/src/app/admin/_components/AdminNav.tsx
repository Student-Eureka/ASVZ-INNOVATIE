import type { NavId } from '../_types/admin';
import { clsx } from './clsx';

interface AdminNavProps {
  nav: NavId;
  onSelect: (nav: NavId) => void;
}

export default function AdminNav({ nav, onSelect }: AdminNavProps) {
  return (
    <div className="space-y-1">
      <button
        onClick={() => onSelect('users')}
        className={clsx(
          'w-full text-left px-3 py-2 rounded-2xl text-sm font-semibold transition',
          nav === 'users' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-900'
        )}
      >
        Gebruikers
      </button>
      <button
        onClick={() => onSelect('permissions')}
        className={clsx(
          'w-full text-left px-3 py-2 rounded-2xl text-sm font-semibold transition',
          nav === 'permissions'
            ? 'bg-slate-900 text-white'
            : 'hover:bg-slate-100 text-slate-900'
        )}
      >
        Toegang
      </button>
      <button
        onClick={() => onSelect('audit')}
        className={clsx(
          'w-full text-left px-3 py-2 rounded-2xl text-sm font-semibold transition',
          nav === 'audit' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-900'
        )}
      >
        Audit
      </button>
    </div>
  );
}
