'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import AppSidebar from '../../_components/AppSidebar';
import PompenSideExtras from '../_components/PompenSideExtras';
import type { PompApiLogEntry, PompApiRecord } from '../_types/pompen';
import PumpHeader from './_components/PumpHeader';
import PumpHistory from './_components/PumpHistory';
import PumpStats from './_components/PumpStats';
import PumpStatusPanel from './_components/PumpStatusPanel';
import { createPumpData } from './_data/pumpData';

interface ServoResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

function readParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

export default function PompDetailPage() {
  const router = useRouter();
  const params = useParams<{ id?: string | string[] }>();
  const pumpId = readParam(params.id);

  const [record, setRecord] = useState<PompApiRecord | null>(null);
  const [logItems, setLogItems] = useState<PompApiLogEntry[]>([]);
  const [statusText, setStatusText] = useState('Wachten op data...');
  const [servoLoading, setServoLoading] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  useEffect(() => {
    if (cooldownTime <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCooldownTime((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [cooldownTime]);

  useEffect(() => {
    if (!pumpId) {
      setRecord(null);
      setLogItems([]);
      setStatusText('Geen pomp geselecteerd');
      return;
    }

    let active = true;

    async function fetchPumpDetail() {
      try {
        const [recordsRes, eventsRes] = await Promise.all([
          fetch('/api/pompen', { cache: 'no-store' }),
          fetch('/api/pompen/events', { cache: 'no-store' }),
        ]);

        const recordsData = (await recordsRes.json()) as unknown;
        const eventsData = (await eventsRes.json()) as unknown;

        const records = Array.isArray(recordsData) ? (recordsData as PompApiRecord[]) : [];
        const events = Array.isArray(eventsData) ? (eventsData as PompApiLogEntry[]) : [];
        const nextRecord =
          records.find((item) => item.id === pumpId) ??
          records.find((item) => item.uniqueId === pumpId) ??
          null;

        const nextEvents = nextRecord
          ? events.filter((item) => item.uniqueId === nextRecord.uniqueId)
          : events.filter((item) => item.pompId === pumpId || item.uniqueId === pumpId);

        if (!active) {
          return;
        }

        setRecord(nextRecord);
        setLogItems(nextEvents);
        setStatusText(nextRecord ? 'Live data' : 'Nog geen live data voor deze pomp');
      } catch (error) {
        console.error('Fout bij laden pompdetail:', error);

        if (!active) {
          return;
        }

        setRecord(null);
        setLogItems([]);
        setStatusText('Verbinding mislukt');
      }
    }

    fetchPumpDetail();
    const interval = window.setInterval(fetchPumpDetail, 3000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [pumpId]);

  const pumpData = useMemo(
    () => createPumpData(pumpId, record, logItems),
    [logItems, pumpId, record]
  );

  const triggerServo = async () => {
    if (servoLoading || cooldownTime > 0) {
      return;
    }

    setServoLoading(true);

    try {
      const res = await fetch('/api/servo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ woning: pumpData.woning, pompId: pumpData.id }),
      });
      const data = (await res.json().catch(() => ({}))) as ServoResponse;

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Kon servo-commando niet versturen');
      }

      setCooldownTime(300);
      alert(data.message || `Commando verstuurd naar ${pumpData.woning}/${pumpData.id}`);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Kan API niet bereiken.');
    } finally {
      setServoLoading(false);
    }
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
        statusText={statusText}
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
            isCoolingDown={cooldownTime > 0}
            cooldownTime={cooldownTime}
            servoLoading={servoLoading}
            onServoAction={triggerServo}
            formatTime={formatTime}
          />

          <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#F8F9FA]">
            <PumpStats data={pumpData} />
            <PumpHistory items={pumpData.history} />
          </div>
        </div>
      </div>
    </div>
  );
}
