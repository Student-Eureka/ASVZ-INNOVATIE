import type { ReactNode } from 'react';
import { Activity, Battery, Droplets, PlayCircle, Thermometer, Wifi } from 'lucide-react';
import type { PumpData } from '../_types/pomp';

interface StatBoxProps {
  icon: ReactNode;
  label: string;
  value: string;
  subLabel?: string;
  subColor?: string;
  progress?: number;
}

function StatBox({ icon, label, value, subLabel, subColor, progress }: StatBoxProps) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <span className="text-gray-400 text-xs font-bold uppercase">{label}</span>
        <div className="bg-gray-50 p-1.5 rounded-lg">{icon}</div>
      </div>
      <div>
        <span className="text-xl font-bold text-gray-800 block">{value}</span>
        {subLabel && <span className="text-xs text-gray-400">{subLabel}</span>}

        {progress !== undefined && subColor && (
          <div className="w-full bg-gray-100 h-1.5 mt-2 rounded-full overflow-hidden">
            <div className={`h-full ${subColor}`} style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </div>
    </div>
  );
}

interface PumpStatsProps {
  data: PumpData;
  onServoTest: () => void;
  servoLoading: boolean;
}

export default function PumpStats({ data, onServoTest, servoLoading }: PumpStatsProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-800 font-bold text-lg flex items-center gap-2">
          <Activity size={18} className="text-[#E30059]" /> Live Gegevens
        </h3>
        <button
          onClick={onServoTest}
          disabled={servoLoading}
          className="bg-white border-2 border-[#E30059] text-[#E30059] hover:bg-[#E30059] hover:text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {servoLoading ? (
            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
          ) : (
            <PlayCircle size={16} />
          )}
          Test Servo
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatBox
          icon={
            <Battery
              className={data.batteryLevel < 20 ? 'text-red-500' : 'text-green-500'}
            />
          }
          label="Batterij"
          value={`${data.batteryLevel}%`}
          subColor={data.batteryLevel < 20 ? 'bg-red-500' : 'bg-green-500'}
          progress={data.batteryLevel}
        />
        <StatBox
          icon={<Droplets className="text-blue-500" />}
          label="Snelheid"
          value={data.flowRate}
          subLabel={`Resterend: ${data.fluidLevel}%`}
        />
        <StatBox
          icon={<Wifi className="text-gray-600" />}
          label="Verbinding"
          value="Sterk"
          subLabel={data.wifiName}
        />
        <StatBox
          icon={<Thermometer className="text-orange-500" />}
          label="Temperatuur"
          value={data.temperature}
        />
      </div>
    </>
  );
}
