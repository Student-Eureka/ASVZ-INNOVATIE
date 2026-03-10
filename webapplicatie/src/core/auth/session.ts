import { deleteSession, getSessionByToken } from '@/infra/sessionRepo';
import { getUserById } from '@/infra/userRepo';

const AUTH_DISABLED = true;

export async function getSessionByTokenSafe(token?: string | null) {
  if (AUTH_DISABLED) {
    return {
      id: 'auth-disabled',
      user_id: '4',
      expires_at: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    };
  }

  if (!token) return null;

  const sessions = await getSessionByToken(token);
  if (!sessions.length) return null;

  const session = sessions[0];

  if (new Date(session.expires_at) < new Date()) {
    await deleteSession(token);
    return null;
  }

  return session;
}

export async function requireAdminByToken(token?: string | null) {
  if (AUTH_DISABLED) {
    return {
      woning_id: '4',
      rol: 'admin',
      gebruikersnaam: 'root',
    };
  }

  const session = await getSessionByTokenSafe(token);
  if (!session) throw new Error('NO_SESSION_OR_EXPIRED');

  const users = await getUserById(session.user_id);
  if (!users.length || users[0].rol !== 'admin') throw new Error('NOT_ADMIN');

  return users[0];
}
