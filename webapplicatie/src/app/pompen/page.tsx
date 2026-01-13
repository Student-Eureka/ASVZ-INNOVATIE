"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  LogOut,
  LayoutDashboard,
  Settings,
  ChevronRight,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Menu // Hamburger menu voor mobiel
} from 'lucide-react';

export default function PompenOverzichtPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // --- DATA ---
  const pompen = [
    { id: 'pomp-a', name: 'Pomp A', location: 'Woning A - Kamer 4', status: 'ALARM', battery: 15 },
    { id: 'pomp-b', name: 'Pomp B', location: 'Woning A - Kamer 2', status: 'OK', battery: 88 },
    { id: 'pomp-c', name: 'Pomp C', location: 'Woning B - Kamer 1', status: 'OFFLINE', battery: 0 },
    { id: 'pomp-d', name: 'Pomp D', location: 'Woning C - Kamer 5', status: 'OK', battery: 92 },
    { id: 'pomp-e', name: 'Pomp E', location: 'Woning D - Kamer 3', status: 'OK', battery: 74 },
  ];

  const filteredPompen = pompen.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#E30059] font-sans flex flex-col">
      
      {/* --- HEADER --- */}
      <header className="flex justify-between items-center px-4 md:px-8 py-4 md:py-6 text-white shrink-0">
        <div className="flex items-center gap-3 md:gap-4">
            {/* Logo */}
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="grid grid-cols-2 gap-1 w-5 h-5 md:w-6 md:h-6">
                    <div className="bg-[#B4D435] rounded-sm"></div>
                    <div className="bg-white rounded-sm text-[#E30059] flex items-center justify-center font-bold text-[8px]">S</div>
                    <div className="bg-white rounded-sm text-[#E30059] flex items-center justify-center font-bold text-[8px]">V</div>
                    <div className="bg-[#B4D435] rounded-sm"></div>
                </div>
            </div>
            <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">Sonde Dashboard</h1>
                {/* Alleen zichtbaar op desktop (md:block) */}
                <p className="hidden md:block text-pink-100 text-sm opacity-80">Real-time monitoring</p> 
            </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
            {/* Systeem status (kleiner op mobiel) */}
            <div className="bg-[#B70048] px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-2 text-xs md:text-sm shadow-inner">
                <span className="relative flex h-2 w-2 md:h-3 md:w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-green-500"></span>
                </span>
                <span className="font-medium hidden md:inline">Systeem Live</span>
                <span className="font-medium md:hidden">Live</span>
            </div>
            {/* Menu knop voor mobiel */}
            <button className="md:hidden bg-white/10 p-2 rounded-full">
                <Menu size={20} />
            </button>
            <button className="hidden md:block bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                <LogOut size={20} />
            </button>
        </div>
      </header>

      {/* --- MAIN LAYOUT --- */}
      {/* Op mobiel: flex-col (onder elkaar), Op desktop: flex-row (naast elkaar) */}
      <div className="flex-1 px-0 md:px-8 pb-0 md:pb-8 flex flex-col md:flex-row gap-0 md:gap-8 overflow-hidden">
        
        {/* SIDEBAR (Verbergen op mobiel: hidden md:flex) */}
        <nav className="hidden md:flex w-64 flex-col gap-3 shrink-0 py-2">
            <SidebarItem icon={<LayoutDashboard size={20}/>} label="Overzicht" active />
            <SidebarItem icon={<Settings size={20}/>} label="Instellingen" />
        </nav>

        {/* RECHTER KANT (Content) */}
        {/* Op mobiel: rounded-t-3xl (alleen bovenkant rond), Op desktop: rounded-[40px] (alles rond) */}
        <div className="flex-1 flex flex-col gap-4 md:gap-6 overflow-hidden bg-[#F8F9FA] rounded-t-3xl md:rounded-[40px] shadow-2xl p-4 md:p-8 relative">
            
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 pb-2">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Actieve Pompen</h2>
                    <p className="text-gray-500 text-sm mt-1">Beheer status per woning</p>
                </div>

                {/* Zoekbalk (Full width op mobiel) */}
                <div className="relative group w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#E30059] transition-colors" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Zoek woning..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-12 pr-4 py-3 md:py-3.5 bg-white border border-gray-200 rounded-2xl leading-5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E30059]/20 focus:border-[#E30059] transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* TABEL HEADERS (Alleen tonen op Desktop: hidden md:grid) */}
            <div className="hidden md:grid grid-cols-12 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <div className="col-span-4">Locatie</div>
                <div className="col-span-3">Status</div>
                <div className="col-span-3">Batterij</div>
                <div className="col-span-2 text-right">Actie</div>
            </div>

            {/* DE LIJST */}
            <div className="overflow-y-auto pr-1 md:pr-2 space-y-3 pb-20 md:pb-4">
                {filteredPompen.map((pomp) => (
                    <div 
                        key={pomp.id}
                        onClick={() => router.push(`/pompen/${pomp.id}`)}
                        className="group bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-all duration-200 cursor-pointer relative overflow-hidden"
                    >
                        {/* Status Balkje Links */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                            pomp.status === 'ALARM' ? 'bg-red-500' : 
                            pomp.status === 'OFFLINE' ? 'bg-gray-300' : 'bg-emerald-500'
                        }`}></div>

                        {/* DESKTOP LAYOUT (Grid) - Hidden op mobiel */}
                        <div className="hidden md:grid grid-cols-12 items-center">
                            <div className="col-span-4 pl-4">
                                <h3 className="font-bold text-gray-800 text-lg">{pomp.name}</h3>
                                <p className="text-gray-500 text-sm font-medium">{pomp.location}</p>
                            </div>
                            <div className="col-span-3"><StatusChip status={pomp.status} /></div>
                            <div className="col-span-3 flex items-center gap-3">
                                <div className="flex-1 bg-gray-100 rounded-full h-2.5 max-w-[100px]">
                                    <div className={`h-full rounded-full ${pomp.battery < 20 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${pomp.battery}%` }}></div>
                                </div>
                                <span className="text-sm font-bold text-gray-600 w-12">{pomp.battery}%</span>
                            </div>
                            <div className="col-span-2 flex justify-end">
                                <ChevronRight size={20} className="text-gray-400 group-hover:text-[#E30059]" />
                            </div>
                        </div>

                        {/* MOBIELE LAYOUT (Flex Column) - Visible op mobiel */}
                        <div className="md:hidden flex flex-col gap-3 pl-3">
                            {/* Bovenste rij: Naam + Status */}
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-gray-800 text-lg">{pomp.name}</h3>
                                <StatusChip status={pomp.status} mobile />
                            </div>
                            
                            {/* Locatie */}
                            <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
                                <LayoutDashboard size={14} /> {pomp.location}
                            </p>

                            {/* Onderste rij: Batterij + Pijl */}
                            <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-1">
                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                                    <Zap size={16} className={pomp.battery < 20 ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
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

        </div>
      </div>
    </div>
  );
}

// --- COMPONENTEN ---

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <button className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-medium transition-all duration-200 ${
            active 
            ? 'bg-white text-[#E30059] shadow-lg translate-x-2' 
            : 'text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-1'
        }`}>
            {icon}
            <span>{label}</span>
        </button>
    )
}

function StatusChip({ status, mobile = false }: { status: string, mobile?: boolean }) {
    if (status === 'ALARM') {
        return (
            <div className={`flex items-center gap-2 ${mobile ? 'bg-red-50 px-3 py-1 rounded-full' : ''}`}>
                {!mobile && <div className="bg-red-100 p-2 rounded-xl text-red-600 animate-pulse"><AlertTriangle size={20} /></div>}
                {mobile && <AlertTriangle size={16} className="text-red-600" />}
                <div>
                    <p className="text-red-600 font-bold text-sm">ALARM</p>
                    {!mobile && <p className="text-red-400 text-xs">Vereist actie</p>}
                </div>
            </div>
        )
    }
    if (status === 'OFFLINE') {
        return (
            <div className={`flex items-center gap-2 opacity-60 ${mobile ? 'bg-gray-100 px-3 py-1 rounded-full' : ''}`}>
                {!mobile && <div className="bg-gray-100 p-2 rounded-xl text-gray-500"><Wifi size={20} /></div>}
                {mobile && <Wifi size={16} className="text-gray-500" />}
                <div>
                    <p className="text-gray-600 font-bold text-sm">OFFLINE</p>
                    {!mobile && <p className="text-gray-400 text-xs">Geen signaal</p>}
                </div>
            </div>
        )
    }
    return (
        <div className={`flex items-center gap-2 ${mobile ? 'bg-emerald-50 px-3 py-1 rounded-full' : ''}`}>
            {!mobile && <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600"><CheckCircle2 size={20} /></div>}
            {mobile && <CheckCircle2 size={16} className="text-emerald-600" />}
            <div>
                <p className="text-emerald-700 font-bold text-sm">ACTIEF</p>
                {!mobile && <p className="text-emerald-500 text-xs">Alles in orde</p>}
            </div>
        </div>
    )
}