import { formatRelativeTime, formatStatusLabel } from '../../pompen/_data/pompen';
import type { AuditRow } from '../_types/admin';

interface AuditSectionProps {
  entries: AuditRow[];
}

function getTone(entry: AuditRow) {
  if (entry.kind === 'command') {
    return 'bg-sky-50 text-sky-700 border-sky-200';
  }

  if (entry.kind === 'info') {
    return 'bg-violet-50 text-violet-700 border-violet-200';
  }

  const status = String(entry.status ?? '').toLowerCase();
  if (status === 'alarm') {
    return 'bg-rose-50 text-rose-700 border-rose-200';
  }
  if (status === 'actief') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
  if (status === 'inactief') {
    return 'bg-slate-50 text-slate-600 border-slate-200';
  }
  return 'bg-slate-50 text-slate-600 border-slate-200';
}

function getLabel(entry: AuditRow) {
  if (entry.kind === 'command') return 'Commando';
  if (entry.kind === 'info') return 'Info';
  return formatStatusLabel(String(entry.status ?? 'inactief'));
}

export default function AuditSection({ entries }: AuditSectionProps) {
  return (
    <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Audit logboek</h2>
        <p className="text-sm text-slate-500">
          Alerts en gebeurtenissen voor alle pompen binnen de huidige woning.
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold border ${getTone(entry)}`}
                >
                  {getLabel(entry)}
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {entry.woning.replace(/_/g, ' ')} / {entry.pompId}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-2">{entry.message}</p>
              <p className="text-[11px] text-slate-400 mt-2 break-all">{entry.topic}</p>
            </div>

            <div className="text-sm text-slate-500 md:text-right">
              {formatRelativeTime(entry.createdAt)}
            </div>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            Nog geen auditregels beschikbaar.
          </div>
        )}
      </div>
    </div>
  );
}
