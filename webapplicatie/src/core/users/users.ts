import bcrypt from 'bcrypt';

import {
  createUserRecord,
  deleteUserById,
  findExistingUser,
  getUsersList,
  updateUserById,
} from '@/infra/userRepo';

const SALT_ROUNDS = 12;

type Role = 'user' | 'admin';

export async function getUsers() {
  return getUsersList();
}

export async function createUser(payload: {
  name?: unknown;
  email?: unknown;
  password?: unknown;
  role?: unknown;
}) {
  const cleanName = String(payload.name ?? '').trim();
  const cleanEmail = String(payload.email ?? '').trim();
  const cleanRole = String(payload.role ?? '').trim() as Role | '';
  const cleanPassword = String(payload.password ?? '');

  if (!cleanName || !cleanEmail || !cleanPassword || !['user', 'admin'].includes(cleanRole)) {
    return { success: false, status: 400, message: 'Ongeldige input' };
  }

  const existing = await findExistingUser(cleanName, cleanEmail);
  if (existing.length > 0) {
    return { success: false, status: 400, message: 'Gebruiker bestaat al' };
  }

  const hashedPassword = await bcrypt.hash(cleanPassword, SALT_ROUNDS);
  const result = await createUserRecord(cleanName, cleanEmail, hashedPassword, cleanRole);

  return { success: true, status: 200, id: result.insertId };
}

export async function deleteUser(payload: { id?: unknown }) {
  if (!payload.id) {
    return { success: false, status: 400, message: 'Geen id opgegeven' };
  }

  await deleteUserById(String(payload.id));
  return { success: true, status: 200 };
}

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

  await updateUserById(String(payload.id), updates.join(', '), values);

  return { success: true, status: 200 };
}
