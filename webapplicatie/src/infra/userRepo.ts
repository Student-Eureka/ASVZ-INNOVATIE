import { db } from './db';

// Haalt gebruiker op voor login (met wachtwoordhash en rol).
export async function getUserForLogin(gebruikersnaam: string) {
  const [rows]: any = await db.query(
    'SELECT woning_id, wachtwoord, rol FROM woningen WHERE gebruikersnaam = ?',
    [gebruikersnaam]
  );
  return rows;
}

// Checkt of een gebruiker al bestaat (op gebruikersnaam)
export async function findExistingUser(gebruikersnaam: string) {
  const [rows]: any = await db.query(
    'SELECT woning_id FROM woningen WHERE gebruikersnaam = ?',
    [gebruikersnaam]
  );
  return rows;
}

// Maakt een nieuwe gebruiker aan in de database.
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

// Haalt alle gebruikers op voor het admin overzicht.
export async function getUsersList() {
  const [rows]: any = await db.query(
    'SELECT woning_id AS id, gebruikersnaam AS name, email, rol AS role, last_login AS lastLogin FROM woningen'
  );
  return rows;
}

// Verwijdert een gebruiker met behulp van het id.
export async function deleteUserById(id: string) {
  await db.query('DELETE FROM woningen WHERE woning_id = ?', [id]);
}

// Werkt een gebruiker bij met dynamische velden (rol, naam, wachtwoord).
export async function updateUserById(id: string, updatesSql: string, values: any[]) {
  await db.query(`UPDATE woningen SET ${updatesSql} WHERE woning_id = ?`, [...values, id]);
}

// Haalt een gebruiker op via id (bijvoorbeeld voor rol-checks).
export async function getUserById(id: string) {
  const [rows]: any = await db.query(
    'SELECT woning_id, rol, gebruikersnaam FROM woningen WHERE woning_id = ?',
    [id]
  );
  return rows;
}
