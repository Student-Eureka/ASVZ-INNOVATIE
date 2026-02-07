interface DashboardSidebarProps {
  onAdmin: () => void;
}

export default function DashboardSidebar({ onAdmin }: DashboardSidebarProps) {
  return (
    <aside className="rounded-3xl bg-white border border-slate-200 shadow-sm p-3 h-fit hidden lg:block">
      <nav className="space-y-1">
        <button className="w-full text-left px-3 py-2 rounded-2xl text-sm font-semibold bg-slate-900 text-white transition">
          Overzicht Pompen
        </button>
        <button
          onClick={onAdmin}
          className="w-full text-left px-3 py-2 rounded-2xl text-sm font-semibold hover:bg-slate-100 text-slate-900 transition"
        >
          Beheer / Admin
        </button>
      </nav>
    </aside>
  );
}
