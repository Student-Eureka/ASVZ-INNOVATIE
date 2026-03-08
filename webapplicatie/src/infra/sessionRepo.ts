import { db } from './db';

// Maakt een nieuwe sessie aan in de database.
export async function createSession(userId: string, expiresAt: Date, token: string) {
  await db.query(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
    [token, userId, expiresAt]
  );
}

// Haalt een sessie op via token (voor validatie)
export async function getSessionByToken(token: string) {
  const [rows]: any = await db.query('SELECT * FROM sessions WHERE id = ?', [token]);
  return rows;
}

// Verwijdert een sessie (bij uitloggen of verlopen)
export async function deleteSession(token: string) {
  await db.query('DELETE FROM sessions WHERE id = ?', [token]);
}
