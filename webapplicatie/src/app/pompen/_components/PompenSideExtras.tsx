import Link from 'next/link';

export default function PompenSideExtras() {
  return (
    <div className="space-y-1">
      <Link
        href="/pompen"
        className="block w-full text-left px-3 py-2 rounded-2xl text-sm font-semibold bg-white text-[#E30059] shadow-sm border border-slate-200"
      >
        Overzicht
      </Link>
      <button
        type="button"
        className="w-full text-left px-3 py-2 rounded-2xl text-sm font-semibold text-slate-500 hover:bg-slate-50"
      >
        Instellingen
      </button>
    </div>
  );
}
