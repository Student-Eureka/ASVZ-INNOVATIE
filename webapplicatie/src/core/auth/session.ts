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

export async function requireUserByToken(token?: string | null) {
  if (AUTH_DISABLED) {
    return {
      woning_id: '4',
      woning_code: 'woning_a',
      rol: 'admin' as const,
      gebruikersnaam: 'root',
      email: 'root@asvz.local',
      last_login: null,
    };
  }

  const session = await getSessionByTokenSafe(token);
  if (!session) throw new Error('NO_SESSION_OR_EXPIRED');

  const users = await getUserById(session.user_id);
  if (!users.length) throw new Error('USER_NOT_FOUND');

  return users[0];
}

export async function requireAdminByToken(token?: string | null) {
  const user = await requireUserByToken(token);
  if (user.rol !== 'admin') throw new Error('NOT_ADMIN');
  return user;
}
