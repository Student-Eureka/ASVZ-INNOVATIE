import bcrypt from "bcrypt";
import "dotenv/config";
import mysql from "mysql2/promise";

async function createUsers() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  const users = [
    { gebruikersnaam: "root", wachtwoord: "admin", rol: "admin", woning_code: "woning_a" },
    { gebruikersnaam: "test", wachtwoord: "Touwbaan15", rol: "user", woning_code: "woning_b" }
  ];

  for (const user of users) {
    const hash = await bcrypt.hash(user.wachtwoord, 12);

    await db.query(
      "INSERT INTO woningen (woning_code, gebruikersnaam, wachtwoord, rol) VALUES (?, ?, ?, ?)",
      [user.woning_code, user.gebruikersnaam, hash, user.rol]
    );

    console.log(`User ${user.gebruikersnaam} aangemaakt`);
  }

  await db.end();
  process.exit();
}

createUsers().catch(console.error);
