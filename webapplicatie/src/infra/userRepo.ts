import { db } from './db';

export async function getUserForLogin(gebruikersnaam: string) {
  const [rows]: any = await db.query(
    'SELECT woning_id, wachtwoord, rol FROM woningen WHERE gebruikersnaam = ?',
    [gebruikersnaam]
  );
  return rows;
}

export async function findExistingUser(gebruikersnaam: string, email: string) {
  const [rows]: any = await db.query(
    'SELECT woning_id FROM woningen WHERE gebruikersnaam = ? OR email = ?',
    [gebruikersnaam, email]
  );
  return rows;
}

export async function createUserRecord(
  gebruikersnaam: string,
  email: string,
  hashedPassword: string,
  rol: string
) {
  const [result]: any = await db.query(
    'INSERT INTO woningen (gebruikersnaam, email, wachtwoord, rol) VALUES (?, ?, ?, ?)',
    [gebruikersnaam, email, hashedPassword, rol]
  );
  return result;
}

export async function getUsersList() {
  const [rows]: any = await db.query(
    'SELECT woning_id AS id, gebruikersnaam AS name, email, rol AS role, last_login AS lastLogin FROM woningen'
  );
  return rows;
}

export async function deleteUserById(id: string) {
  await db.query('DELETE FROM woningen WHERE woning_id = ?', [id]);
}

export async function updateUserById(id: string, updatesSql: string, values: any[]) {
  await db.query(`UPDATE woningen SET ${updatesSql} WHERE woning_id = ?`, [...values, id]);
}

export async function getUserById(id: string) {
  const [rows]: any = await db.query(
    'SELECT woning_id, rol, gebruikersnaam FROM woningen WHERE woning_id = ?',
    [id]
  );
  return rows;
}
