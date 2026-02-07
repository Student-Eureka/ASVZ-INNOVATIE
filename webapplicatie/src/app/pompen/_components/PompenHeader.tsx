import { LogOut, Menu } from 'lucide-react';

export default function PompenHeader() {
  return (
    <header className="flex justify-between items-center px-4 md:px-8 py-4 md:py-6 text-white shrink-0">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/20">
          <div className="grid grid-cols-2 gap-1 w-5 h-5 md:w-6 md:h-6">
            <div className="bg-[#B4D435] rounded-sm"></div>
            <div className="bg-white rounded-sm text-[#E30059] flex items-center justify-center font-bold text-[8px]">
              S
            </div>
            <div className="bg-white rounded-sm text-[#E30059] flex items-center justify-center font-bold text-[8px]">
              V
            </div>
            <div className="bg-[#B4D435] rounded-sm"></div>
          </div>
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Sonde Dashboard
          </h1>
          <p className="hidden md:block text-pink-100 text-sm opacity-80">
            Real-time monitoring
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="bg-[#B70048] px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-2 text-xs md:text-sm shadow-inner">
          <span className="relative flex h-2 w-2 md:h-3 md:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-green-500"></span>
          </span>
          <span className="font-medium hidden md:inline">Systeem Live</span>
          <span className="font-medium md:hidden">Live</span>
        </div>
        <button className="md:hidden bg-white/10 p-2 rounded-full">
          <Menu size={20} />
        </button>
        <button className="hidden md:block bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
