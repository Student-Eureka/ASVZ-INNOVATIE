import { History, Send } from 'lucide-react';

import type { PumpHistoryItem } from '../_types/pomp';

interface PumpHistoryProps {
  items: PumpHistoryItem[];
}

function getTone(type: PumpHistoryItem['type']) {
  if (type === 'command') {
    return 'bg-sky-500 text-sky-700 border-sky-100';
  }

  if (type === 'status') {
    return 'bg-emerald-500 text-emerald-700 border-emerald-100';
  }

  return 'bg-slate-300 text-slate-600 border-slate-100';
}

export default function PumpHistory({ items }: PumpHistoryProps) {
  return (
    <>
      <h3 className="text-gray-800 font-bold text-lg mb-4 flex items-center gap-2">
        <History size={18} className="text-[#E30059]" /> Recente activiteit
      </h3>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4"
          >
            <div
              className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${getTone(item.type).split(' ')[0]}`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-gray-800 font-medium text-sm">{item.message}</p>
                {item.type === 'command' && <Send size={14} className="text-sky-500" />}
              </div>
              <p className="text-gray-400 text-xs mt-1">{item.time}</p>
              <p className="text-[11px] text-slate-400 mt-2 break-all">{item.topic}</p>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl px-4 py-8 text-center text-sm text-slate-500">
            Nog geen activiteit beschikbaar voor deze pomp.
          </div>
        )}
      </div>
    </>
  );
}
