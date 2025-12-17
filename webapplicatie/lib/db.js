import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",        // of je Docker host als je die gebruikt
  user: "root",             // jouw db user
  password: "",             // jouw wachtwoord
  database: "woningen_db" // jouw db naam
});
