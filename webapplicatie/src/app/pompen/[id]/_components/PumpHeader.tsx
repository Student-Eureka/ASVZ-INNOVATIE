import Image from 'next/image';
import { ArrowLeft, Radio } from 'lucide-react';

interface PumpHeaderProps {
  name: string;
  location: string;
  statusText: string;
  onBack: () => void;
}

export default function PumpHeader({ name, location, statusText, onBack }: PumpHeaderProps) {
  return (
    <header className="px-4 md:px-8 py-4 md:py-6 text-white shrink-0">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="bg-white/10 hover:bg-white/20 p-2 md:p-3 rounded-full transition-all flex items-center gap-2 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm hidden md:inline">Terug naar overzicht</span>
        </button>

        <div className="flex items-center gap-3 text-center md:text-left">
          <Image src="/logo.svg" alt="ASVZ Logo" width={44} height={44} className="w-11 h-11" />
          <div>
            <h1 className="text-lg md:text-xl font-bold">{name}</h1>
            <p className="text-xs text-pink-100 opacity-90">{location}</p>
            <p className="text-xs text-pink-100/90 mt-1 flex items-center justify-center md:justify-start gap-1">
              <Radio size={12} />
              {statusText}
            </p>
          </div>
        </div>

        <div className="hidden md:block text-right text-xs text-pink-100/90">
          Live pompdetail
        </div>
      </div>
    </header>
  );
}
