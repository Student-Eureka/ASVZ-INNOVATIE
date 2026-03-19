import { Activity, BellRing, Power, Radio, Send } from 'lucide-react';

import { formatStatusLabel, normalizePompStatus } from '../../_data/pompen';
import type { PumpData } from '../_types/pomp';

interface PumpStatusPanelProps {
  data: PumpData;
  servoLoading: boolean;
  onServoAction: () => void;
}

function getStatusMeta(status: string) {
  const normalized = normalizePompStatus(status);

  if (normalized === 'alarm') {
    return {
      icon: BellRing,
      ringClass: 'border-rose-100 bg-rose-50 shadow-rose-200 text-rose-500',
      barClass: 'bg-rose-500',
    };
  }

  if (normalized === 'actief') {
    return {
      icon: Activity,
      ringClass: 'border-emerald-100 bg-emerald-50 shadow-emerald-200 text-emerald-500',
      barClass: 'bg-emerald-500',
    };
  }

  return {
    icon: Power,
    ringClass: 'border-slate-100 bg-slate-50 shadow-slate-200 text-slate-500',
    barClass: 'bg-slate-300',
  };
}

export default function PumpStatusPanel({
  data,
  servoLoading,
  onServoAction,
}: PumpStatusPanelProps) {
  const meta = getStatusMeta(data.status);
  const StatusIcon = meta.icon;
  const canTriggerServo = normalizePompStatus(data.status) === 'alarm';
  const isDisabled = servoLoading || !canTriggerServo;

  return (
    <div className="w-full md:w-[360px] p-6 md:p-10 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 bg-white relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-2 md:h-full md:w-2 ${meta.barClass}`} />

      <div className="relative mb-6 md:mb-8 mt-4">
        <div
          className={`w-40 h-40 md:w-56 md:h-56 rounded-full flex items-center justify-center border-8 shadow-xl transition-all duration-300 ${meta.ringClass}`}
        >
          <div className="relative z-10 flex flex-col items-center">
            <StatusIcon size={56} />
            <span className="font-bold text-2xl md:text-3xl mt-2">
              {formatStatusLabel(String(data.status))}
            </span>
          </div>
        </div>
      </div>

      <div className="text-center mb-8 max-w-xs">
        <h2 className="text-gray-800 font-bold text-xl md:text-2xl mb-2">{data.statusMessage}</h2>
        <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
          <Radio size={14} /> {data.statusTopic}
        </p>
      </div>

      <button
        onClick={onServoAction}
        disabled={isDisabled}
        className={`w-full max-w-xs py-4 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold shadow-lg transition-all active:scale-95 ${
          isDisabled
            ? 'bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-not-allowed'
            : 'bg-[#E30059] text-white hover:bg-[#c4004d] hover:shadow-red-200 shadow-red-200'
        }`}
      >
        {servoLoading ? (
          <span className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          <Send size={22} />
        )}
        {canTriggerServo ? 'Servo aansturen' : 'Wacht op alarm'}
      </button>
    </div>
  );
}
