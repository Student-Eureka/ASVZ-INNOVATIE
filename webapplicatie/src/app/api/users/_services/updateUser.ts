import bcrypt from 'bcrypt';
import { db } from '@/../lib/db';

const SALT_ROUNDS = 12;

export async function updateUser(payload: {
  id?: unknown;
  name?: unknown;
  role?: unknown;
  password?: unknown;
}) {
  if (!payload.id) {
    return { success: false, status: 400, message: 'Geen id opgegeven' };
  }

  const updates: string[] = [];
  const values: any[] = [];

  if (payload.role && ['user', 'admin'].includes(String(payload.role))) {
    updates.push('rol = ?');
    values.push(payload.role);
  }
  if (payload.name) {
    updates.push('gebruikersnaam = ?');
    values.push(payload.name);
  }
  if (payload.password) {
    const hashedPassword = await bcrypt.hash(String(payload.password), SALT_ROUNDS);
    updates.push('wachtwoord = ?');
    values.push(hashedPassword);
  }

  if (updates.length === 0) {
    return { success: false, status: 400, message: 'Niets om te updaten' };
  }

  values.push(payload.id);
  await db.query(`UPDATE woningen SET ${updates.join(', ')} WHERE woning_id = ?`, values);

  return { success: true, status: 200 };
}
