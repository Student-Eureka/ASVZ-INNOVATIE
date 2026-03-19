import DashboardActivity from './DashboardActivity';
import DashboardTable from './DashboardTable';
import StatCard from './StatCard';
import type { DashboardEvent, Pomp } from '../_types/dashboard';

interface DashboardContentProps {
  pompen: Pomp[];
  events: DashboardEvent[];
  query: string;
  onQueryChange: (value: string) => void;
  stats: {
    totaal: number;
    alarm: number;
    sluimerend: number;
    rust: number;
  };
}

export default function DashboardContent({
  pompen,
  events,
  query,
  onQueryChange,
  stats,
}: DashboardContentProps) {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <StatCard label="Geregistreerde pompen" value={stats.totaal} />
        <StatCard label="Alarm" value={stats.alarm} />
        <StatCard label="Sluimerend" value={stats.sluimerend} />
        <StatCard label="Rust" value={stats.rust} />
      </div>

      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="p-5 border-b border-slate-200">
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Zoek op woning of pomp..."
            className="w-full md:w-64 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#E5007D]"
          />
        </div>

        <div className="p-5 overflow-x-auto">
          <DashboardTable pompen={pompen} />
        </div>
      </div>

      <DashboardActivity events={events} />
    </section>
  );
}
