import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import { db } from './db';

interface LoginRow extends RowDataPacket {
  woning_id: string;
  wachtwoord: string;
  rol: 'admin' | 'user';
}

interface ExistingUserRow extends RowDataPacket {
  woning_id: string;
}

interface UserRow extends RowDataPacket {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  lastLogin: string | null;
}

interface UserByIdRow extends RowDataPacket {
  woning_id: string;
  rol: 'admin' | 'user';
  gebruikersnaam: string;
}

export async function getUserForLogin(gebruikersnaam: string) {
  const [rows] = await db.query<LoginRow[]>(
    'SELECT woning_id, wachtwoord, rol FROM woningen WHERE gebruikersnaam = ?',
    [gebruikersnaam]
  );
  return rows;
}

export async function findExistingUser(gebruikersnaam: string, email: string) {
  const [rows] = await db.query<ExistingUserRow[]>(
    'SELECT woning_id FROM woningen WHERE gebruikersnaam = ? OR email = ?',
    [gebruikersnaam, email]
  );
  return rows;
}

export async function createUserRecord(
  gebruikersnaam: string,
  email: string,
  hashedPassword: string,
  rol: 'admin' | 'user'
) {
  const [result] = await db.query<ResultSetHeader>(
    'INSERT INTO woningen (gebruikersnaam, email, wachtwoord, rol) VALUES (?, ?, ?, ?)',
    [gebruikersnaam, email, hashedPassword, rol]
  );
  return result;
}

export async function getUsersList() {
  const [rows] = await db.query<UserRow[]>(
    'SELECT woning_id AS id, gebruikersnaam AS name, email, rol AS role, last_login AS lastLogin FROM woningen'
  );
  return rows;
}

export async function deleteUserById(id: string) {
  await db.query('DELETE FROM woningen WHERE woning_id = ?', [id]);
}

export async function updateUserById(id: string, updatesSql: string, values: string[]) {
  await db.query(`UPDATE woningen SET ${updatesSql} WHERE woning_id = ?`, [...values, id]);
}

export async function getUserById(id: string) {
  const [rows] = await db.query<UserByIdRow[]>(
    'SELECT woning_id, rol, gebruikersnaam FROM woningen WHERE woning_id = ?',
    [id]
  );
  return rows;
}

export async function touchUserLastLogin(id: string) {
  await db.query('UPDATE woningen SET last_login = CURRENT_TIMESTAMP WHERE woning_id = ?', [id]);
}
