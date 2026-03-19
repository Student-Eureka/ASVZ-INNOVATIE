import { clsx } from './clsx';

export default function StatusPill({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const isAlarm = normalized === 'alarm';
  const isActief = normalized === 'actief';
  const isInactief = normalized === 'inactief';

  const color = isAlarm
    ? 'bg-rose-50 text-rose-700 border-rose-200'
    : isActief
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : isInactief
      ? 'bg-slate-50 text-slate-500 border-slate-200'
      : 'bg-slate-50 text-slate-500 border-slate-200';

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold border',
        color
      )}
    >
      {status}
    </span>
  );
}
