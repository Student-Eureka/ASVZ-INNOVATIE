import { db } from '@/../lib/db';

interface LogoutResult {
  success: boolean;
}

export async function logoutSession(token?: string | null): Promise<LogoutResult> {
  if (token) {
    await db.query('DELETE FROM sessions WHERE id = ?', [token]);
  }

  return { success: true };
}
