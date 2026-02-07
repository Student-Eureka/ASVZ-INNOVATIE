import { Activity, Bell, BellOff, Clock } from 'lucide-react';
import type { PumpData } from '../_types/pomp';

interface PumpStatusPanelProps {
  data: PumpData;
  isSnoozed: boolean;
  snoozeTime: number;
  onSnooze: () => void;
  formatTime: (seconds: number) => string;
}

export default function PumpStatusPanel({
  data,
  isSnoozed,
  snoozeTime,
  onSnooze,
  formatTime,
}: PumpStatusPanelProps) {
  return (
    <div className="w-full md:w-1/3 p-6 md:p-10 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 bg-white relative overflow-hidden">
      <div
        className={`absolute top-0 left-0 right-0 h-2 md:h-full md:w-2 ${
          data.status === 'ALARM' ? 'bg-red-500' : 'bg-emerald-500'
        }`}
      ></div>

      <div className="relative mb-6 md:mb-10 mt-4">
        <div
          className={`w-40 h-40 md:w-56 md:h-56 rounded-full flex items-center justify-center border-8 shadow-xl transition-all duration-500
            ${
              data.status === 'ALARM'
                ? 'border-red-100 bg-red-50 shadow-red-200'
                : 'border-emerald-100 bg-emerald-50 shadow-emerald-200'
            }`}
        >
          <div
            className={`relative z-10 flex flex-col items-center
              ${data.status === 'ALARM' ? 'text-red-500' : 'text-emerald-500'}`}
          >
            {data.status === 'ALARM' ? (
              <Bell size={48} className="animate-bounce" />
            ) : (
              <Activity size={56} />
            )}
            <span className="font-bold text-2xl md:text-3xl mt-2">
              {data.status}
            </span>
          </div>

          {data.status === 'ALARM' && (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-red-500 opacity-20 animate-ping"></div>
              <div className="absolute -inset-4 rounded-full border-2 border-red-500 opacity-10 animate-pulse"></div>
            </>
          )}
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-gray-800 font-bold text-xl md:text-2xl mb-1">
          {data.status === 'ALARM' ? data.alarmType : 'Systeem in orde'}
        </h2>
        <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
          <Clock size={14} /> Laatste update: {data.lastUpdate}
        </p>
      </div>

      {data.status === 'ALARM' && (
        <button
          onClick={onSnooze}
          disabled={isSnoozed}
          className={`w-full max-w-xs py-4 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold shadow-lg transition-all active:scale-95
            ${
              isSnoozed
                ? 'bg-orange-100 text-orange-400 border-2 border-orange-200 cursor-default'
                : 'bg-[#E30059] text-white hover:bg-[#c4004d] hover:shadow-red-200 shadow-red-200'
            }`}
        >
          {isSnoozed ? (
            <>
              <BellOff size={24} /> {formatTime(snoozeTime)}
            </>
          ) : (
            <>
              <BellOff size={24} /> Alarm Sluimeren
            </>
          )}
        </button>
      )}
    </div>
  );
}
