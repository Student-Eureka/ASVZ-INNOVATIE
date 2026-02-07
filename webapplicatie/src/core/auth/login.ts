import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { createSession } from '@/infra/sessionRepo';
import { getUserForLogin } from '@/infra/userRepo';

interface LoginResult {
  success: boolean;
  status: number;
  message?: string;
  token?: string;
  maxAgeSeconds?: number;
}

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export async function loginWithPassword(
  gebruikersnaam: string,
  wachtwoord: string
): Promise<LoginResult> {
  if (!gebruikersnaam || !wachtwoord) {
    return { success: false, status: 400, message: 'Ongeldige input' };
  }

  const rows = await getUserForLogin(gebruikersnaam);
  if (rows.length === 0) {
    return { success: false, status: 401, message: 'Ongeldige login' };
  }

  const user = rows[0];
  const isValid = await bcrypt.compare(wachtwoord, user.wachtwoord);

  if (!isValid) {
    return { success: false, status: 401, message: 'Ongeldige login' };
  }

  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 1000 * SESSION_MAX_AGE_SECONDS);

  await createSession(user.woning_id, expires, token);

  return { success: true, status: 200, token, maxAgeSeconds: SESSION_MAX_AGE_SECONDS };
}
