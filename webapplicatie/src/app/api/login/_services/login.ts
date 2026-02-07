import { db } from '@/../lib/db';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

interface LoginResult {
  success: boolean;
  status: number;
  message?: string;
  token?: string;
  maxAgeSeconds?: number;
}

export async function loginWithPassword(
  gebruikersnaam: string,
  wachtwoord: string
): Promise<LoginResult> {
  if (!gebruikersnaam || !wachtwoord) {
    return { success: false, status: 400, message: 'Ongeldige input' };
  }

  const [rows]: any = await db.query(
    'SELECT woning_id, wachtwoord, rol FROM woningen WHERE gebruikersnaam = ?',
    [gebruikersnaam]
  );

  if (rows.length === 0) {
    return { success: false, status: 401, message: 'Ongeldige login' };
  }

  const user = rows[0];
  const isValid = await bcrypt.compare(wachtwoord, user.wachtwoord);

  if (!isValid) {
    return { success: false, status: 401, message: 'Ongeldige login' };
  }

  const token = crypto.randomUUID();
  const maxAgeSeconds = 60 * 60 * 8;
  const expires = new Date(Date.now() + 1000 * maxAgeSeconds);

  await db.query(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
    [token, user.woning_id, expires]
  );

  return { success: true, status: 200, token, maxAgeSeconds };
}
