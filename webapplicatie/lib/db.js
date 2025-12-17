import mysql from "mysql2/promise";

// Maak een connection pool naar de MySQL database
// Connection pools zorgen voor efficiënter gebruik van databaseverbindingen
export const db = mysql.createPool({
  host: "localhost",        // Database host; verander dit naar je Docker host indien nodig
  user: "root",             // Database gebruikersnaam
  password: "",             // Wachtwoord van de gebruiker (LET OP: voor hosting NOOIT leeg houden, WACHTWOORD PRIVE HOUDEN)
  database: "woningen_db"   // Naam van de database die je wilt gebruiken
});
