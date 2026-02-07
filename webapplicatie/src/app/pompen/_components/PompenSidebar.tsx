import { LayoutDashboard, Settings } from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function SidebarItem({ icon, label, active = false }: SidebarItemProps) {
  return (
    <button
      className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-medium transition-all duration-200 ${
        active
          ? 'bg-white text-[#E30059] shadow-lg translate-x-2'
          : 'text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-1'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default function PompenSidebar() {
  return (
    <nav className="hidden md:flex w-64 flex-col gap-3 shrink-0 py-2">
      <SidebarItem icon={<LayoutDashboard size={20} />} label="Overzicht" active />
      <SidebarItem icon={<Settings size={20} />} label="Instellingen" />
    </nav>
  );
}
