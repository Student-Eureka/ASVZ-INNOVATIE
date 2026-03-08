import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); // Laadt de .env file

// Maakt een connection pool naar de MySQL database
// Connection pools zorgen voor efficienter gebruik van databaseverbindingen
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});
