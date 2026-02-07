import { clsx } from './clsx';

export default function StatusPill({ status }: { status: string }) {
  const isAan = status.toLowerCase() === 'actief';
  const isRust = status.toLowerCase() === 'rust';

  const color = isAan
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : isRust
      ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
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
