import { db } from './db';

export async function createSession(userId: string, expiresAt: Date, token: string) {
  await db.query(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
    [token, userId, expiresAt]
  );
}

export async function getSessionByToken(token: string) {
  const [rows]: any = await db.query('SELECT * FROM sessions WHERE id = ?', [token]);
  return rows;
}

export async function deleteSession(token: string) {
  await db.query('DELETE FROM sessions WHERE id = ?', [token]);
}
