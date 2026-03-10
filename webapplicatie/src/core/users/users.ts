import bcrypt from 'bcrypt';

import {
  createUserRecord,
  deleteUserById,
  findExistingUser,
  getUserById,
  getUsersList,
  updateUserById,
} from '@/infra/userRepo';

const SALT_ROUNDS = 12;

type Role = 'user' | 'admin';

function isRole(value: string): value is Role {
  return value === 'user' || value === 'admin';
}

export async function getUsers(woningCode: string) {
  return getUsersList(woningCode);
}

export async function createUser(
  payload: {
    name?: unknown;
    email?: unknown;
    password?: unknown;
    role?: unknown;
  },
  woningCode: string
) {
  const cleanName = String(payload.name ?? '').trim();
  const cleanEmail = String(payload.email ?? '').trim();
  const cleanRole = String(payload.role ?? '').trim();
  const cleanPassword = String(payload.password ?? '');

  if (!cleanName || !cleanEmail || !cleanPassword || !isRole(cleanRole) || !woningCode) {
    return { success: false, status: 400, message: 'Ongeldige input' };
  }

  const existing = await findExistingUser(cleanName, cleanEmail);
  if (existing.length > 0) {
    return { success: false, status: 400, message: 'Gebruiker bestaat al' };
  }

  const hashedPassword = await bcrypt.hash(cleanPassword, SALT_ROUNDS);
  const result = await createUserRecord(woningCode, cleanName, cleanEmail, hashedPassword, cleanRole);

  return { success: true, status: 200, id: result.insertId };
}

export async function deleteUser(payload: { id?: unknown }, viewer: { id: string; woningCode: string }) {
  if (!payload.id) {
    return { success: false, status: 400, message: 'Geen id opgegeven' };
  }

  const targetId = String(payload.id);
  if (targetId === viewer.id) {
    return { success: false, status: 400, message: 'Eigen account kan niet verwijderd worden' };
  }

  const target = await getUserById(targetId);
  if (!target.length || target[0].woning_code !== viewer.woningCode) {
    return { success: false, status: 404, message: 'Gebruiker niet gevonden' };
  }

  await deleteUserById(targetId, viewer.woningCode);
  return { success: true, status: 200 };
}

export async function updateUser(
  payload: {
    id?: unknown;
    name?: unknown;
    role?: unknown;
    password?: unknown;
  },
  woningCode: string
) {
  if (!payload.id) {
    return { success: false, status: 400, message: 'Geen id opgegeven' };
  }

  const targetId = String(payload.id);
  const target = await getUserById(targetId);
  if (!target.length || target[0].woning_code !== woningCode) {
    return { success: false, status: 404, message: 'Gebruiker niet gevonden' };
  }

  const updates: string[] = [];
  const values: string[] = [];

  if (payload.role && ['user', 'admin'].includes(String(payload.role))) {
    updates.push('rol = ?');
    values.push(String(payload.role));
  }
  if (payload.name) {
    updates.push('gebruikersnaam = ?');
    values.push(String(payload.name));
  }
  if (payload.password) {
    const hashedPassword = await bcrypt.hash(String(payload.password), SALT_ROUNDS);
    updates.push('wachtwoord = ?');
    values.push(hashedPassword);
  }

  if (updates.length === 0) {
    return { success: false, status: 400, message: 'Niets om te updaten' };
  }

  await updateUserById(targetId, updates.join(', '), values, woningCode);

  return { success: true, status: 200 };
}
