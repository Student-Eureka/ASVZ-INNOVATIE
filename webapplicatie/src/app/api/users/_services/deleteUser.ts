import { db } from '@/../lib/db';

export async function deleteUser(payload: { id?: unknown }) {
  if (!payload.id) {
    return { success: false, status: 400, message: 'Geen id opgegeven' };
  }

  await db.query('DELETE FROM woningen WHERE woning_id = ?', [payload.id]);
  return { success: true, status: 200 };
}
