import StatusPill from './StatusPill';
import type { Pomp } from '../_types/dashboard';

interface DashboardTableProps {
  pompen: Pomp[];
}

export default function DashboardTable({ pompen }: DashboardTableProps) {
  return (
    <table className="w-full text-sm text-slate-900">
      <thead>
        <tr className="text-left text-xs text-slate-500 uppercase tracking-wide">
          <th className="py-2 pl-2">Woning</th>
          <th className="py-2">Pomp ID</th>
          <th className="py-2">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {pompen.map((pomp) => (
          <tr key={pomp.uniqueId} className="hover:bg-slate-50 transition-colors">
            <td className="py-4 pl-2 font-bold text-[#E5007D]">
              {pomp.woning.replace('_', ' ').toUpperCase()}
            </td>
            <td className="py-4 text-slate-500 font-medium">
              {pomp.id.replace('_', ' ')}
            </td>
            <td className="py-4">
              <StatusPill status={pomp.status} />
            </td>
          </tr>
        ))}
        {pompen.length === 0 && (
          <tr>
            <td colSpan={3} className="py-8 text-center text-slate-500">
              Wachten op signalen...
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
