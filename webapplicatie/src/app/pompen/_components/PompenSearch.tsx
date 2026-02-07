import { Search } from 'lucide-react';

interface PompenSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PompenSearch({ value, onChange }: PompenSearchProps) {
  return (
    <div className="relative group w-full md:w-96">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#E30059] transition-colors" />
      </div>
      <input
        type="text"
        placeholder="Zoek woning..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-12 pr-4 py-3 md:py-3.5 bg-white border border-gray-200 rounded-2xl leading-5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E30059]/20 focus:border-[#E30059] transition-all shadow-sm"
      />
    </div>
  );
}
