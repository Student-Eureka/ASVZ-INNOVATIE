import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",        // of je Docker host als je die gebruikt
  user: "root",             // jouw db user
  password: "",             // jouw wachtwoord
  database: "woning.db" // jouw db naam
});
