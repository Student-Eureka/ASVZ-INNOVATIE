import bcrypt from "bcrypt";
import { db } from "../lib/db.js";

async function createUsers() {
  const users = [
    { gebruikersnaam: "root", wachtwoord: "admin", rol: "admin" },
    { gebruikersnaam: "test", wachtwoord: "Touwbaan15", rol: "user" }
  ];

  for (const user of users) {
    const hash = await bcrypt.hash(user.wachtwoord, 12);

    await db.query(
      "INSERT INTO woningen (gebruikersnaam, wachtwoord, rol) VALUES (?, ?, ?)",
      [user.gebruikersnaam, hash, user.rol]
    );

    console.log(`User ${user.gebruikersnaam} aangemaakt`);
  }

  process.exit();
}

createUsers().catch(console.error);
