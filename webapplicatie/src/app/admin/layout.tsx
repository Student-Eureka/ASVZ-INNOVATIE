import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { requireAdminByToken } from '@/core/auth/session';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('session')?.value ?? null;

  try {
    await requireAdminByToken(token);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'NOT_ADMIN';
    if (message === 'NO_SESSION_OR_EXPIRED') {
      redirect('/login');
    }
    redirect('/dashboard');
  }

  return children;
}
