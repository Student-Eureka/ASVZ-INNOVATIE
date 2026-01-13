"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Bell, 
  BellOff, 
  Battery, 
  Wifi, 
  Activity, 
  Droplets, 
  Clock,
  History,
  Thermometer,
  MoreVertical
} from 'lucide-react';

export default function PompDetailPage() {
  const router = useRouter();
  const params = useParams();
  const pumpId = params.id; 

  // --- STATE ---
  const [isSnoozed, setIsSnoozed] = useState(false);
  const [snoozeTime, setSnoozeTime] = useState(0);

  // --- NAAM LOGICA (Veilig) ---
  let displayName = 'Pomp Onbekend';
  if (pumpId) {
    const idString = Array.isArray(pumpId) ? pumpId[0] : pumpId;
    if (idString.includes('-')) {
      displayName = `Pomp ${idString.split('-')[1].toUpperCase()}`;
    } else {
      displayName = `Pomp ${idString}`;
    }
  }

  // --- DATA (Simulatie) ---
  const pumpData = {
    name: displayName,
    location: "Woning A - Kamer 4 (Jan de Vries)",
    status: "ALARM", // Zet op 'OK' of 'ALARM' om te testen
    alarmType: "Obstructie gedetecteerd",
    fluidLevel: 45, 
    batteryLevel: 15, // Laag voor demo
    flowRate: "120 ml/u",
    lastUpdate: "Zojuist",
    temperature: "36.5°C"
  };

  // --- TIMER LOGICA ---
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-[#E30059] font-sans flex flex-col">
      
      {/* --- HEADER (Mobiel vriendelijk) --- */}
      <header className="px-4 md:px-8 py-4 md:py-6 text-white shrink-0 flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="bg-white/10 hover:bg-white/20 p-2 md:p-3 rounded-full transition-all flex items-center gap-2 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm hidden md:inline">Terug naar overzicht</span>
        </button>
        
        <div className="text-center">
            <h1 className="text-lg md:text-xl font-bold">{pumpData.name}</h1>
            <p className="text-xs text-pink-200 opacity-90">{pumpData.location}</p>
        </div>

        <button className="bg-white/10 hover:bg-white/20 p-2 md:p-3 rounded-full">
            <MoreVertical size={20} />
        </button>
      </header>

      {/* --- MAIN CONTENT CARD --- */}
      <div className="flex-1 bg-[#F8F9FA] rounded-t-[30px] md:rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col md:flex-row relative">
        
        {/* LINKER KOLOM: Status & Actie (Op mobiel bovenaan) */}
        <div className="w-full md:w-1/3 p-6 md:p-10 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 bg-white relative overflow-hidden">
            
            {/* Achtergrond decoratie */}
            <div className={`absolute top-0 left-0 right-0 h-2 md:h-full md:w-2 ${pumpData.status === 'ALARM' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
            
            {/* De Grote Status Ring */}
            <div className="relative mb-6 md:mb-10 mt-4">
                <div className={`w-40 h-40 md:w-56 md:h-56 rounded-full flex items-center justify-center border-8 shadow-xl transition-all duration-500
                    ${pumpData.status === 'ALARM' 
                        ? 'border-red-100 bg-red-50 shadow-red-200' 
                        : 'border-emerald-100 bg-emerald-50 shadow-emerald-200'}`}
                >
                    <div className={`relative z-10 flex flex-col items-center
                         ${pumpData.status === 'ALARM' ? 'text-red-500' : 'text-emerald-500'}`}>
                        {pumpData.status === 'ALARM' ? <Bell size={48} className="animate-bounce" /> : <Activity size={56} />}
                        <span className="font-bold text-2xl md:text-3xl mt-2">{pumpData.status}</span>
                    </div>

                    {/* Pulserende ringen bij alarm */}
                    {pumpData.status === 'ALARM' && (
                        <>
                            <div className="absolute inset-0 rounded-full border-4 border-red-500 opacity-20 animate-ping"></div>
                            <div className="absolute -inset-4 rounded-full border-2 border-red-500 opacity-10 animate-pulse"></div>
                        </>
                    )}
                </div>
            </div>

            {/* Melding Tekst */}
            <div className="text-center mb-8">
                <h2 className="text-gray-800 font-bold text-xl md:text-2xl mb-1">
                    {pumpData.status === 'ALARM' ? pumpData.alarmType : 'Systeem in orde'}
                </h2>
                <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                    <Clock size={14} /> Laatste update: {pumpData.lastUpdate}
                </p>
            </div>

            {/* Sluimer Knop (Alleen bij Alarm) */}
            {pumpData.status === 'ALARM' && (
                 <button
                 onClick={handleSnooze}
                 disabled={isSnoozed}
                 className={`w-full max-w-xs py-4 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold shadow-lg transition-all active:scale-95
                   ${isSnoozed 
                     ? 'bg-orange-100 text-orange-400 border-2 border-orange-200 cursor-default' 
                     : 'bg-[#E30059] text-white hover:bg-[#c4004d] hover:shadow-red-200 shadow-red-200'
                   }`}
               >
                 {isSnoozed ? (
                   <> <BellOff size={24} /> {formatTime(snoozeTime)} </>
                 ) : (
                   <> <BellOff size={24} /> Alarm Sluimeren </>
                 )}
               </button>
            )}
        </div>

        {/* RECHTER KOLOM: Data & Statistieken (Scrollbaar op mobiel) */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#F8F9FA]">
            
            <h3 className="text-gray-800 font-bold text-lg mb-4 flex items-center gap-2">
                <Activity size={18} className="text-[#E30059]" /> Live Gegevens
            </h3>

            {/* Grid van Statistieken */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatBox 
                    icon={<Battery className={pumpData.batteryLevel < 20 ? "text-red-500" : "text-green-500"} />} 
                    label="Batterij" 
                    value={`${pumpData.batteryLevel}%`} 
                    subColor={pumpData.batteryLevel < 20 ? "bg-red-500" : "bg-green-500"}
                    progress={pumpData.batteryLevel}
                />
                <StatBox 
                    icon={<Droplets className="text-blue-500" />} 
                    label="Snelheid" 
                    value={pumpData.flowRate} 
                    subLabel={`Resterend: ${pumpData.fluidLevel}%`}
                />
                <StatBox 
                    icon={<Wifi className="text-gray-600" />} 
                    label="Verbinding" 
                    value="Sterk" 
                    subLabel="WiFi: Eureka_2.4"
                />
                 <StatBox 
                    icon={<Thermometer className="text-orange-500" />} 
                    label="Temperatuur" 
                    value={pumpData.temperature} 
                />
            </div>

            {/* Historie Lijst */}
            <h3 className="text-gray-800 font-bold text-lg mb-4 flex items-center gap-2">
                <History size={18} className="text-[#E30059]" /> Recente Meldingen
            </h3>

            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${i === 1 ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                        <div>
                            <p className="text-gray-800 font-medium text-sm">
                                {i === 1 ? 'Alarm: Obstructie lijn gedetecteerd' : 'Reguliere systeemcontrole uitgevoerd'}
                            </p>
                            <p className="text-gray-400 text-xs mt-1">Vandaag, 14:{30 - (i * 10)}</p>
                        </div>
                    </div>
                ))}
            </div>

        </div>

      </div>
    </div>
  );
}

// --- HULP COMPONENT VOOR DE BLOKJES ---
function StatBox({ icon, label, value, subLabel, subColor, progress }: any) {
    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <span className="text-gray-400 text-xs font-bold uppercase">{label}</span>
                <div className="bg-gray-50 p-1.5 rounded-lg">{icon}</div>
            </div>
            <div>
                <span className="text-xl font-bold text-gray-800 block">{value}</span>
                {subLabel && <span className="text-xs text-gray-400">{subLabel}</span>}
                
                {/* Progress bar (alleen als progress prop er is) */}
                {progress !== undefined && (
                    <div className="w-full bg-gray-100 h-1.5 mt-2 rounded-full overflow-hidden">
                        <div className={`h-full ${subColor}`} style={{ width: `${progress}%` }}></div>
                    </div>
                )}
            </div>
        </div>
    );
}