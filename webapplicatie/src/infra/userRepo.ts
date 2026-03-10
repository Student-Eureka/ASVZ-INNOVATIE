import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import { db } from './db';

interface LoginRow extends RowDataPacket {
  woning_id: string;
  woning_code: string;
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
  woningCode: string;
}

interface UserByIdRow extends RowDataPacket {
  woning_id: string;
  woning_code: string;
  rol: 'admin' | 'user';
  gebruikersnaam: string;
  email: string;
  last_login: string | null;
}

export async function getUserForLogin(gebruikersnaam: string) {
  const [rows] = await db.query<LoginRow[]>(
    'SELECT woning_id, woning_code, wachtwoord, rol FROM woningen WHERE gebruikersnaam = ?',
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
  woningCode: string,
  gebruikersnaam: string,
  email: string,
  hashedPassword: string,
  rol: 'admin' | 'user'
) {
  const [result] = await db.query<ResultSetHeader>(
    'INSERT INTO woningen (woning_code, gebruikersnaam, email, wachtwoord, rol) VALUES (?, ?, ?, ?, ?)',
    [woningCode, gebruikersnaam, email, hashedPassword, rol]
  );
  return result;
}

export async function getUsersList(woningCode: string) {
  const [rows] = await db.query<UserRow[]>(
    `SELECT woning_id AS id,
            gebruikersnaam AS name,
            email,
            rol AS role,
            last_login AS lastLogin,
            woning_code AS woningCode
       FROM woningen
      WHERE woning_code = ?
      ORDER BY gebruikersnaam ASC`,
    [woningCode]
  );
  return rows;
}

export async function deleteUserById(id: string, woningCode: string) {
  await db.query('DELETE FROM woningen WHERE woning_id = ? AND woning_code = ?', [id, woningCode]);
}

export async function updateUserById(
  id: string,
  updatesSql: string,
  values: string[],
  woningCode: string
) {
  await db.query(`UPDATE woningen SET ${updatesSql} WHERE woning_id = ? AND woning_code = ?`, [
    ...values,
    id,
    woningCode,
  ]);
}

export async function getUserById(id: string) {
  const [rows] = await db.query<UserByIdRow[]>(
    `SELECT woning_id, woning_code, rol, gebruikersnaam, email, last_login
       FROM woningen
      WHERE woning_id = ?`,
    [id]
  );
  return rows;
}

export async function touchUserLastLogin(id: string) {
  await db.query('UPDATE woningen SET last_login = CURRENT_TIMESTAMP WHERE woning_id = ?', [id]);
}
