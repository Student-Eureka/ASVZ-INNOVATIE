interface DashboardHeaderProps {
  statusText: string;
  onLogout: () => void;
}

export default function DashboardHeader({ statusText, onLogout }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-white/90 border-b border-slate-200 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="ASVZ Logo" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Sonde Dashboard</h1>
            <p className="text-xs text-slate-500">
              <span
                className={
                  statusText === 'Live data'
                    ? 'text-green-600 font-bold'
                    : 'text-orange-500'
                }
              >
                ● {statusText}
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="text-sm font-semibold text-slate-500 hover:text-[#E5007D]"
        >
          Uitloggen
        </button>
      </div>
    </header>
  );
}
