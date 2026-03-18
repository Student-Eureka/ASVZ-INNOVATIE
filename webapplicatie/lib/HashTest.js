import bcrypt from "bcrypt";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function optionalEnv(name, fallback = "") {
  const value = process.env[name];
  return value ?? fallback;
}

async function createUsers() {
  const db = await mysql.createConnection({
    host: requireEnv("DB_HOST"),
    port: Number(process.env.DB_PORT || 3306),
    user: requireEnv("DB_USER"),
    password: optionalEnv("DB_PASS"),
    database: requireEnv("DB_NAME"),
  });

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

  await db.end();
  process.exit();
}

createUsers().catch(console.error);
