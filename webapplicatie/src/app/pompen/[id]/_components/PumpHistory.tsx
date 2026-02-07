import { History } from 'lucide-react';
import type { PumpHistoryItem } from '../_types/pomp';

interface PumpHistoryProps {
  items: PumpHistoryItem[];
}

export default function PumpHistory({ items }: PumpHistoryProps) {
  return (
    <>
      <h3 className="text-gray-800 font-bold text-lg mb-4 flex items-center gap-2">
        <History size={18} className="text-[#E30059]" /> Recente Meldingen
      </h3>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4"
          >
            <div
              className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                item.type === 'alarm' ? 'bg-red-500' : 'bg-gray-300'
              }`}
            ></div>
            <div>
              <p className="text-gray-800 font-medium text-sm">{item.message}</p>
              <p className="text-gray-400 text-xs mt-1">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
