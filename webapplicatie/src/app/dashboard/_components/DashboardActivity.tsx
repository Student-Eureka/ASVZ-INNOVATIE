import { formatRelativeTime, formatStatusLabel } from '../../pompen/_data/pompen';
import type { DashboardEvent } from '../_types/dashboard';

interface DashboardActivityProps {
  events: DashboardEvent[];
}

function getTone(event: DashboardEvent) {
  if (event.kind === 'command') {
    return 'bg-sky-50 text-sky-700 border-sky-200';
  }

  if (event.kind === 'info') {
    return 'bg-violet-50 text-violet-700 border-violet-200';
  }

  const status = String(event.status ?? '').toLowerCase();
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

function getLabel(event: DashboardEvent) {
  if (event.kind === 'command') return 'Commando';
  if (event.kind === 'info') return 'Info';
  return formatStatusLabel(String(event.status ?? 'inactief'));
}

export default function DashboardActivity({ events }: DashboardActivityProps) {
  return (
    <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200">
        <h2 className="text-base font-semibold text-slate-900">Recente activiteit</h2>
        <p className="text-sm text-slate-500">
          Laatste statusupdates en servo-acties van geregistreerde pompen.
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {events.map((event) => (
          <div
            key={event.id}
            className="px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold border ${getTone(event)}`}
                >
                  {getLabel(event)}
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {event.woning.replace(/_/g, ' ')} / {event.pompId}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-2">{event.message}</p>
            </div>

            <div className="text-sm text-slate-500 md:text-right">
              {formatRelativeTime(event.createdAt)}
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            Nog geen recente activiteit beschikbaar.
          </div>
        )}
      </div>
    </div>
  );
}
