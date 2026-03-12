import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import { db } from './db';

interface LoginRow extends RowDataPacket {
  woning_id: string;
  wachtwoord: string;
  rol: 'admin' | 'user';
  gebruikersnaam: string;
}

interface ExistingUserRow extends RowDataPacket {
  woning_id: string;
}

interface UserRow extends RowDataPacket {
  id: string;
  name: string;
  role: 'admin' | 'user';
  lastLogin: string | null;
  woningId: string;
}

interface UserByIdRow extends RowDataPacket {
  woning_id: string;
  rol: 'admin' | 'user';
  gebruikersnaam: string;
  last_login: string | null;
}

export async function getUserForLogin(gebruikersnaam: string) {
  const [rows] = await db.query<LoginRow[]>(
    'SELECT woning_id, gebruikersnaam, wachtwoord, rol FROM woningen WHERE gebruikersnaam = ?',
    [gebruikersnaam]
  );
  return rows;
}

export async function findExistingUser(gebruikersnaam: string) {
  const [rows] = await db.query<ExistingUserRow[]>(
    'SELECT woning_id FROM woningen WHERE gebruikersnaam = ?',
    [gebruikersnaam]
  );
  return rows;
}

export async function createUserRecord(
  gebruikersnaam: string,
  hashedPassword: string,
  rol: 'admin' | 'user'
) {
  const [result] = await db.query<ResultSetHeader>(
    'INSERT INTO woningen (gebruikersnaam, wachtwoord, rol) VALUES (?, ?, ?)',
    [gebruikersnaam, hashedPassword, rol]
  );
  return result;
}

export async function getUsersList() {
  const [rows] = await db.query<UserRow[]>(
    `SELECT woning_id AS id,
            gebruikersnaam AS name,
            rol AS role,
            last_login AS lastLogin,
            woning_id AS woningId
       FROM woningen
      ORDER BY gebruikersnaam ASC`,
    []
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
    `SELECT woning_id, rol, gebruikersnaam, last_login
       FROM woningen
      WHERE woning_id = ?`,
    [id]
  );
  return rows;
}

export async function touchUserLastLogin(id: string) {
  await db.query('UPDATE woningen SET last_login = CURRENT_TIMESTAMP WHERE woning_id = ?', [id]);
}
