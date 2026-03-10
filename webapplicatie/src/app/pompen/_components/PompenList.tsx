import { Activity, ChevronRight, Clock3, PauseCircle, Power, Radio } from 'lucide-react';

import { formatStatusLabel, normalizePompStatus } from '../_data/pompen';
import type { PompItem, PompStatus } from '../_types/pompen';

interface StatusChipProps {
  status: PompStatus;
  mobile?: boolean;
}

function StatusChip({ status, mobile = false }: StatusChipProps) {
  const normalized = normalizePompStatus(String(status));

  if (normalized === 'actief') {
    return (
      <div className={`flex items-center gap-2 ${mobile ? 'bg-emerald-50 px-3 py-1 rounded-full' : ''}`}>
        {!mobile && (
          <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
            <Activity size={20} />
          </div>
        )}
        {mobile && <Activity size={16} className="text-emerald-600" />}
        <div>
          <p className="text-emerald-700 font-bold text-sm">{formatStatusLabel(normalized)}</p>
          {!mobile && <p className="text-emerald-500 text-xs">Actieve status ontvangen</p>}
        </div>
      </div>
    );
  }

  if (normalized === 'rust') {
    return (
      <div className={`flex items-center gap-2 ${mobile ? 'bg-yellow-50 px-3 py-1 rounded-full' : ''}`}>
        {!mobile && (
          <div className="bg-yellow-100 p-2 rounded-xl text-yellow-600">
            <PauseCircle size={20} />
          </div>
        )}
        {mobile && <PauseCircle size={16} className="text-yellow-600" />}
        <div>
          <p className="text-yellow-700 font-bold text-sm">{formatStatusLabel(normalized)}</p>
          {!mobile && <p className="text-yellow-500 text-xs">Geen directe actie nodig</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 opacity-80 ${mobile ? 'bg-slate-100 px-3 py-1 rounded-full' : ''}`}>
      {!mobile && (
        <div className="bg-slate-100 p-2 rounded-xl text-slate-500">
          <Power size={20} />
        </div>
      )}
      {mobile && <Power size={16} className="text-slate-500" />}
      <div>
        <p className="text-slate-600 font-bold text-sm">{formatStatusLabel(normalized)}</p>
        {!mobile && <p className="text-slate-400 text-xs">Wacht op nieuw signaal</p>}
      </div>
    </div>
  );
}

interface PompenListProps {
  items: PompItem[];
  onSelect: (id: string) => void;
}

export default function PompenList({ items, onSelect }: PompenListProps) {
  return (
    <div className="overflow-y-auto pr-1 md:pr-2 space-y-3 pb-4">
      {items.map((pomp) => (
        <div
          key={pomp.uniqueId}
          onClick={() => onSelect(pomp.id)}
          className="group bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-all duration-200 cursor-pointer relative overflow-hidden"
        >
          <div
            className={`absolute left-0 top-0 bottom-0 w-1.5 ${
              normalizePompStatus(String(pomp.status)) === 'actief'
                ? 'bg-emerald-500'
                : normalizePompStatus(String(pomp.status)) === 'rust'
                  ? 'bg-yellow-500'
                  : 'bg-slate-300'
            }`}
          />

          <div className="hidden md:grid grid-cols-12 items-center">
            <div className="col-span-4 pl-4">
              <h3 className="font-bold text-gray-800 text-lg">{pomp.name}</h3>
              <p className="text-gray-500 text-sm font-medium">{pomp.location}</p>
            </div>
            <div className="col-span-3">
              <StatusChip status={pomp.status} />
            </div>
            <div className="col-span-3 flex items-center gap-3 text-sm text-gray-500">
              <Clock3 size={16} className="text-gray-400" />
              <span>{pomp.lastUpdateLabel}</span>
            </div>
            <div className="col-span-2 flex justify-end">
              <ChevronRight size={20} className="text-gray-400 group-hover:text-[#E5007D]" />
            </div>
          </div>

          <div className="md:hidden flex flex-col gap-3 pl-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-lg">{pomp.name}</h3>
              <StatusChip status={pomp.status} mobile />
            </div>

            <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
              <Radio size={14} /> {pomp.location}
            </p>

            <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <Clock3 size={16} className="text-gray-400" />
                {pomp.lastUpdateLabel}
              </div>
              <span className="text-xs text-[#E5007D] font-bold flex items-center gap-1">
                DETAILS <ChevronRight size={14} />
              </span>
            </div>
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          Er zijn nog geen geregistreerde pompen zichtbaar.
        </div>
      )}
    </div>
  );
}
