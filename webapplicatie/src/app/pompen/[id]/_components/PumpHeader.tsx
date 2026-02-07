import { ArrowLeft, MoreVertical } from 'lucide-react';

interface PumpHeaderProps {
  name: string;
  location: string;
  onBack: () => void;
}

export default function PumpHeader({ name, location, onBack }: PumpHeaderProps) {
  return (
    <header className="px-4 md:px-8 py-4 md:py-6 text-white shrink-0 flex items-center justify-between">
      <button
        onClick={onBack}
        className="bg-white/10 hover:bg-white/20 p-2 md:p-3 rounded-full transition-all flex items-center gap-2 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium text-sm hidden md:inline">
          Terug naar overzicht
        </span>
      </button>

      <div className="text-center">
        <h1 className="text-lg md:text-xl font-bold">{name}</h1>
        <p className="text-xs text-pink-200 opacity-90">{location}</p>
      </div>

      <button className="bg-white/10 hover:bg-white/20 p-2 md:p-3 rounded-full">
        <MoreVertical size={20} />
      </button>
    </header>
  );
}
