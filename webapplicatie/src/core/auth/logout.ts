import { deleteSession } from '@/infra/sessionRepo';

export async function logoutSession(token?: string | null) {
  if (token) {
    await deleteSession(token);
  }
  return { success: true };
}
