import { formatRelativeTime, formatStatusLabel, normalizePompStatus } from '../../pompen/_data/pompen';
import type { NewPumpRow } from '../_types/admin';
import type { UserRow } from '../_types/admin';

interface NewPumpsSectionProps {
  pumps: NewPumpRow[];
  users: UserRow[];
  savingPompId: string | null;
  selectedWoningen: Record<string, string>;
  onSelectWoning: (pump: NewPumpRow, woningId: string) => void;
  onAdd: (pump: NewPumpRow) => void;
}

function getTone(status: string) {
  const normalized = normalizePompStatus(status);

  if (normalized === 'alarm') {
    return 'bg-rose-50 text-rose-700 border-rose-200';
  }

  if (normalized === 'actief') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }

  if (normalized === 'inactief') {
    return 'bg-slate-50 text-slate-600 border-slate-200';
  }

  return 'bg-slate-50 text-slate-600 border-slate-200';
}

function getWoningLabel(woning: string, users: UserRow[]) {
  const match = users.find((user) => user.woningId === woning);
  return match?.name || woning;
}

export default function NewPumpsSection({
  pumps,
  users,
  savingPompId,
  selectedWoningen,
  onSelectWoning,
  onAdd,
}: NewPumpsSectionProps) {
  return (
    <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Nieuwe pompen</h2>
        <p className="text-sm text-slate-500">
          Alleen pompen die wel live via MQTT zijn gevonden, maar nog niet in de database staan.
        </p>
      </div>

      <div className="p-5 overflow-x-auto">
        <table className="w-full text-sm text-slate-900">
          <thead>
            <tr className="text-left text-xs text-slate-500 uppercase tracking-wide">
              <th className="py-2">Woning</th>
              <th className="py-2">Pomp ID</th>
              <th className="py-2">Status</th>
              <th className="py-2">Laatste update</th>
              <th className="py-2">Opslaan bij woning</th>
              <th className="py-2 text-right">Actie</th>
            </tr>
          </thead>
          <tbody>
            {pumps.map((pump) => (
              <tr key={pump.uniqueId} className="border-t border-slate-200">
                <td className="py-3 font-semibold text-[#E5007D]">
                  {getWoningLabel(pump.woning, users)}
                </td>
                <td className="py-3">{pump.id}</td>
                <td className="py-3">
                  <span
                    className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${getTone(pump.status)}`}
                  >
                    {formatStatusLabel(String(pump.status))}
                  </span>
                </td>
                <td className="py-3 text-slate-500">{formatRelativeTime(pump.lastUpdate)}</td>
                <td className="py-3">
                  <select
                    value={selectedWoningen[pump.uniqueId] ?? ''}
                    onChange={(event) => onSelectWoning(pump, event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                  >
                    <option value="">Kies woning</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.woningId}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => onAdd(pump)}
                    disabled={savingPompId === pump.uniqueId || !selectedWoningen[pump.uniqueId]}
                    className="rounded-xl bg-slate-900 text-white px-3 py-2 text-xs font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingPompId === pump.uniqueId ? 'Toevoegen...' : 'Toevoegen aan database'}
                  </button>
                </td>
              </tr>
            ))}

            {pumps.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-500">
                  Er zijn op dit moment geen nieuwe pompen gevonden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
