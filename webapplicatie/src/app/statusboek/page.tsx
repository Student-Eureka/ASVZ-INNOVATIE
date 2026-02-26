import AppSidebar from '../_components/AppSidebar';
import StatusboekContent from './_components/StatusboekContent';

export default function StatusboekPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <div className="hidden lg:block">
          <AppSidebar />
        </div>
        <StatusboekContent />
      </div>
    </main>
  );
}
