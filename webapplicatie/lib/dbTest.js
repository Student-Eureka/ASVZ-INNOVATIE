// dbTest.js

import mysql from 'mysql2/promise';

async function testDB() {

    // 1. Maak de verbinding aan
    const db = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '', // Pas dit aan als je een wachtwoord hebt!
        database: 'woningen_db',
    });

    console.log('Poging tot verbinding met database...');

    try {
        // 2. Probeer een eenvoudige query uit te voeren om de connectie te testen
        const [rows] = await db.query('SELECT * FROM woningen LIMIT 5'); 
        
        console.log('✅ SUCCES! Connectie is actief en de query is uitgevoerd.');
        console.log('Resultaat van de query (eerste 5 rijen):', rows);

    } catch (err) {
        console.error('❌ FOUT! De verbinding is mislukt of de query gaf een fout:', err.message);
        console.error('Controleer de XAMPP MySQL-status en de databasegegevens (naam, gebruiker, wachtwoord).');
    } finally {
        // 3. Sluit de pool (optioneel voor een eenmalige test, maar goede gewoonte)
        await db.end(); 
    }
}
testDB();