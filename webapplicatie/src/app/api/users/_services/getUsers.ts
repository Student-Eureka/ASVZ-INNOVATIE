import { db } from '@/../lib/db';

export async function getUsers() {
  const [rows]: any = await db.query(
    'SELECT woning_id AS id, gebruikersnaam AS name, email, rol AS role, last_login AS lastLogin FROM woningen'
  );
  return rows;
}
