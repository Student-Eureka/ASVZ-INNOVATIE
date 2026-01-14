import mysql from "mysql2/promise";

// Maak een connection pool naar de MySQL database
// Connection pools zorgen voor efficiënter gebruik van databaseverbindingen
export const db = mysql.createPool({
  host: "localhost",        // Database host; verander dit naar je Docker host indien nodig
  user: "asvz_user",             // Database gebruikersnaam
  password: "AsvzEureka2!",             // Wachtwoord van de gebruiker (LET OP: voor hosting NOOIT leeg houden, WACHTWOORD PRIVE HOUDEN)
  database: "asvz_db"   // Naam van de database die je wilt gebruiken
});
