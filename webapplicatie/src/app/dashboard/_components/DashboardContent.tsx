import DashboardTable from './DashboardTable';
import StatCard from './StatCard';
import type { Pomp } from '../_types/dashboard';

interface DashboardContentProps {
  pompen: Pomp[];
  query: string;
  onQueryChange: (value: string) => void;
  stats: {
    totaal: number;
    actief: number;
    rust: number;
    inactief: number;
  };
}

export default function DashboardContent({ pompen, query, onQueryChange, stats }: DashboardContentProps) {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <StatCard label="Gevonden Pompen" value={stats.totaal} />
        <StatCard label="Actief" value={stats.actief} />
        <StatCard label="Rust" value={stats.rust} />
        <StatCard label="Inactief" value={stats.inactief} />
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
    </section>
  );
}
