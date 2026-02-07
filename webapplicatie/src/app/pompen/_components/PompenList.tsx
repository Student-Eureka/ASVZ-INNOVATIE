import { AlertTriangle, CheckCircle2, ChevronRight, LayoutDashboard, Wifi, Zap } from 'lucide-react';
import type { PompItem, PompStatus } from '../_types/pompen';

interface StatusChipProps {
  status: PompStatus;
  mobile?: boolean;
}

function StatusChip({ status, mobile = false }: StatusChipProps) {
  if (status === 'ALARM') {
    return (
      <div className={`flex items-center gap-2 ${mobile ? 'bg-red-50 px-3 py-1 rounded-full' : ''}`}>
        {!mobile && (
          <div className="bg-red-100 p-2 rounded-xl text-red-600 animate-pulse">
            <AlertTriangle size={20} />
          </div>
        )}
        {mobile && <AlertTriangle size={16} className="text-red-600" />}
        <div>
          <p className="text-red-600 font-bold text-sm">ALARM</p>
          {!mobile && <p className="text-red-400 text-xs">Vereist actie</p>}
        </div>
      </div>
    );
  }
  if (status === 'OFFLINE') {
    return (
      <div className={`flex items-center gap-2 opacity-60 ${mobile ? 'bg-gray-100 px-3 py-1 rounded-full' : ''}`}>
        {!mobile && (
          <div className="bg-gray-100 p-2 rounded-xl text-gray-500">
            <Wifi size={20} />
          </div>
        )}
        {mobile && <Wifi size={16} className="text-gray-500" />}
        <div>
          <p className="text-gray-600 font-bold text-sm">OFFLINE</p>
          {!mobile && <p className="text-gray-400 text-xs">Geen signaal</p>}
        </div>
      </div>
    );
  }
  return (
    <div className={`flex items-center gap-2 ${mobile ? 'bg-emerald-50 px-3 py-1 rounded-full' : ''}`}>
      {!mobile && (
        <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
          <CheckCircle2 size={20} />
        </div>
      )}
      {mobile && <CheckCircle2 size={16} className="text-emerald-600" />}
      <div>
        <p className="text-emerald-700 font-bold text-sm">ACTIEF</p>
        {!mobile && <p className="text-emerald-500 text-xs">Alles in orde</p>}
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
    <div className="overflow-y-auto pr-1 md:pr-2 space-y-3 pb-20 md:pb-4">
      {items.map((pomp) => (
        <div
          key={pomp.id}
          onClick={() => onSelect(pomp.id)}
          className="group bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-all duration-200 cursor-pointer relative overflow-hidden"
        >
          <div
            className={`absolute left-0 top-0 bottom-0 w-1.5 ${
              pomp.status === 'ALARM'
                ? 'bg-red-500'
                : pomp.status === 'OFFLINE'
                  ? 'bg-gray-300'
                  : 'bg-emerald-500'
            }`}
          ></div>

          <div className="hidden md:grid grid-cols-12 items-center">
            <div className="col-span-4 pl-4">
              <h3 className="font-bold text-gray-800 text-lg">{pomp.name}</h3>
              <p className="text-gray-500 text-sm font-medium">{pomp.location}</p>
            </div>
            <div className="col-span-3">
              <StatusChip status={pomp.status} />
            </div>
            <div className="col-span-3 flex items-center gap-3">
              <div className="flex-1 bg-gray-100 rounded-full h-2.5 max-w-[100px]">
                <div
                  className={`h-full rounded-full ${
                    pomp.battery < 20 ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${pomp.battery}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold text-gray-600 w-12">
                {pomp.battery}%
              </span>
            </div>
            <div className="col-span-2 flex justify-end">
              <ChevronRight
                size={20}
                className="text-gray-400 group-hover:text-[#E30059]"
              />
            </div>
          </div>

          <div className="md:hidden flex flex-col gap-3 pl-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-lg">{pomp.name}</h3>
              <StatusChip status={pomp.status} mobile />
            </div>

            <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
              <LayoutDashboard size={14} /> {pomp.location}
            </p>

            <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <Zap
                  size={16}
                  className={
                    pomp.battery < 20
                      ? 'text-red-500 fill-red-500'
                      : 'text-gray-400'
                  }
                />
                {pomp.battery}%
              </div>
              <span className="text-xs text-[#E30059] font-bold flex items-center gap-1">
                DETAILS <ChevronRight size={14} />
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
