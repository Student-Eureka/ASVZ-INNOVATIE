# Architectuur Overzicht (Systeemniveau)

Dit document beschrijft de totale systeemarchitectuur: webapp, database, MQTT broker en hardware.
Het is bedoeld als high-level overzicht naast de technische details in de submappen.

## Componenten
- **Webapplicatie (Next.js)**: UI + API + server-side MQTT client
- **Database (MySQL/MariaDB)**: users, locaties, statusboek
- **MQTT Broker (Mosquitto)**: messaging tussen webapp en hardware
- **Hardware (Pico W + servo)**: publiceert status en voert commando’s uit

## Datastromen

### 1) Login
Frontend → `/api/login` → core → DB  
Resultaat: session cookie

### 2) Status (device → webapp)
Pico W → MQTT topic `asvz/{woning}/{pomp}/status` → server-side MQTT client → core store → `/api/pompen` → frontend

### 3) Servo commando (webapp → device)
Frontend → `/api/servo` → core → MQTT publish → `asvz/{woning}/{pomp}/set` → Pico W

## Protocols en poorten
- HTTP: `3000` (webapp)
- MySQL: `3306` (DB)
- MQTT TCP: `1883` (broker)
- MQTT WebSocket: `9001` (optioneel, tooling)

## Logging en observability
Bronnen:
- `pm2 logs asvz-webapp`
- `/var/log/mosquitto/mosquitto.log`
- MySQL service status

## Security en scope
- Geen automatische acties; alle servo-acties zijn expliciete gebruikersacties.
- MQTT authenticatie via user/pass.
- Database toegang via aparte app-user (niet `root`).
