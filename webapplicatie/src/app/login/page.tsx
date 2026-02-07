import LoginCard from './_components/LoginCard';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#C3D600] via-[#C3D600] to-white" />
      <LoginCard />
    </main>
  );
}
