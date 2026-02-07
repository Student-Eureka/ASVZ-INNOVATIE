import bcrypt from 'bcrypt';
import { db } from '@/../lib/db';

const SALT_ROUNDS = 12;

export async function createUser(payload: {
  name?: unknown;
  email?: unknown;
  password?: unknown;
  role?: unknown;
}) {
  const cleanName = String(payload.name ?? '').trim();
  const cleanEmail = String(payload.email ?? '').trim();
  const cleanRole = String(payload.role ?? '').trim();
  const cleanPassword = String(payload.password ?? '');

  if (!cleanName || !cleanEmail || !cleanPassword || !['user', 'admin'].includes(cleanRole)) {
    return { success: false, status: 400, message: 'Ongeldige input' };
  }

  const [existing]: any = await db.query(
    'SELECT woning_id FROM woningen WHERE gebruikersnaam = ? OR email = ?',
    [cleanName, cleanEmail]
  );

  if (existing.length > 0) {
    return { success: false, status: 400, message: 'Gebruiker bestaat al' };
  }

  const hashedPassword = await bcrypt.hash(cleanPassword, SALT_ROUNDS);

  const [result]: any = await db.query(
    'INSERT INTO woningen (gebruikersnaam, email, wachtwoord, rol) VALUES (?, ?, ?, ?)',
    [cleanName, cleanEmail, hashedPassword, cleanRole]
  );

  return { success: true, status: 200, id: result.insertId };
}
