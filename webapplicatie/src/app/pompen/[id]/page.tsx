'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import AppSidebar from '../../_components/AppSidebar';
import PumpHeader from './_components/PumpHeader';
import PumpHistory from './_components/PumpHistory';
import PumpStats from './_components/PumpStats';
import PumpStatusPanel from './_components/PumpStatusPanel';
import PompenSideExtras from '../_components/PompenSideExtras';
import { createPumpData } from './_data/pumpData';

export default function PompDetailPage() {
  const router = useRouter();
  const params = useParams();
  const pumpId = params.id;

  const pumpData = useMemo(() => createPumpData(pumpId), [pumpId]);

  const [isSnoozed, setIsSnoozed] = useState(false);
  const [snoozeTime, setSnoozeTime] = useState(0);
  const [servoLoading, setServoLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSnoozed && snoozeTime > 0) {
      timer = setInterval(() => {
        setSnoozeTime((prev) => prev - 1);
      }, 1000);
    } else if (snoozeTime === 0) {
      setIsSnoozed(false);
    }
    return () => clearInterval(timer);
  }, [isSnoozed, snoozeTime]);

  const handleSnooze = () => {
    setIsSnoozed(true);
    setSnoozeTime(300);
  };

  const triggerServo = async () => {
    setServoLoading(true);
    try {
      const res = await fetch('/api/servo', { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        alert(`✅ ${data.message}`);
      } else {
        alert(`❌ Fout: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('❌ Kan API niet bereiken. Check of de server draait.');
    }
    setServoLoading(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-[#E30059] font-sans flex flex-col">
      <PumpHeader
        name={pumpData.name}
        location={pumpData.location}
        onBack={() => router.back()}
      />

      <div className="flex-1 px-0 md:px-8 pb-0 md:pb-8 flex flex-col md:flex-row gap-0 md:gap-8 overflow-hidden">
        <div className="hidden md:block w-64 shrink-0 py-2">
          <AppSidebar>
            <PompenSideExtras />
          </AppSidebar>
        </div>

        <div className="flex-1 bg-[#F8F9FA] rounded-t-[30px] md:rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col md:flex-row relative">
          <PumpStatusPanel
            data={pumpData}
            isSnoozed={isSnoozed}
            snoozeTime={snoozeTime}
            onSnooze={handleSnooze}
            formatTime={formatTime}
          />

          <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#F8F9FA]">
            <PumpStats data={pumpData} onServoTest={triggerServo} servoLoading={servoLoading} />
            <PumpHistory items={pumpData.history} />
          </div>
        </div>
      </div>
    </div>
  );
}
