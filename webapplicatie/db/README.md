# Database - ASVZ (MySQL/MariaDB)

Deze map bevat het SQL schema voor de webapplicatie.

## Bestanden
- `asvz_db.sql` - volledige database dump (schema + data indien aanwezig)

## Database naam
Standaard: `asvz_db`

## Importeren
Handmatig importeren:
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS asvz_db;"
mysql -u root -p /opt/asvz/webapplicatie/db/asvz_db.sql
```

## Tabellen (kort)
Op basis van de dump:
- `woningen`: gebruikers per locatie
  - `gebruikersnaam` + `wachtwoord`
  - `rol`: `admin` of `user`
  - `last_login`

> Raadpleeg het SQL-bestand voor de exacte kolommen en constraints.

## Users en rechten (aanbevolen)
Gebruik een aparte database user voor de webapp:
```sql
CREATE USER 'asvz_app'@'localhost' IDENTIFIED BY 'SterkWachtwoord';
GRANT ALL PRIVILEGES ON asvz_db.* TO 'asvz_app'@'localhost';
FLUSH PRIVILEGES;
```

## Backups (handmatig)
```bash
mysqldump -u root -p asvz_db > asvz_db_backup.sql
```

## Restore (handmatig)
```bash
mysql -u root -p asvz_db < asvz_db_backup.sql
```
