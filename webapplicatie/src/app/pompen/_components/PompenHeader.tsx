import Image from 'next/image';

interface PompenHeaderProps {
  statusText: string;
}

export default function PompenHeader({ statusText }: PompenHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-white/90 border-b border-slate-200 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="ASVZ logo" width={40} height={40} className="w-10 h-10" />
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Pompenoverzicht</h1>
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
        <p className="hidden md:block text-sm text-slate-500">
          Live status vanuit MQTT
        </p>
      </div>
    </header>
  );
}
