import type { ReactNode } from 'react';
import { Clock3, Hash, Home, Send } from 'lucide-react';

import type { PumpData } from '../_types/pomp';

interface StatBoxProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function StatBox({ icon, label, value }: StatBoxProps) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-28">
      <div className="flex justify-between items-start gap-4">
        <span className="text-gray-400 text-xs font-bold uppercase">{label}</span>
        <div className="bg-gray-50 p-1.5 rounded-lg">{icon}</div>
      </div>
      <span className="text-sm font-semibold text-gray-800 break-all">{value}</span>
    </div>
  );
}

interface PumpStatsProps {
  data: PumpData;
}

export default function PumpStats({ data }: PumpStatsProps) {
  return (
    <>
      <div className="mb-4">
        <h3 className="text-gray-800 font-bold text-lg">Pompinformatie</h3>
        <p className="text-sm text-slate-500">
          Technische details en de laatst bekende MQTT-routes voor deze pomp.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatBox icon={<Home className="text-[#E30059]" size={18} />} label="Woning" value={data.location} />
        <StatBox icon={<Hash className="text-slate-600" size={18} />} label="Pomp ID" value={data.id} />
        <StatBox
          icon={<Clock3 className="text-amber-500" size={18} />}
          label="Laatste update"
          value={data.lastUpdate}
        />
        <StatBox
          icon={<Send className="text-sky-500" size={18} />}
          label="Command topic"
          value={data.commandTopic}
        />
      </div>
    </>
  );
}
