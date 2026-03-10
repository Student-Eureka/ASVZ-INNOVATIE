import mysql from 'mysql2/promise';

const globalForDb = globalThis as typeof globalThis & {
  asvzDbPool?: mysql.Pool;
};

const db =
  globalForDb.asvzDbPool ??
  mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.asvzDbPool = db;
}

export { db };
