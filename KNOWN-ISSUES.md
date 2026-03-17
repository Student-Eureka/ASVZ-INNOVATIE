# Bekende Issues en Risico's

Dit document verzamelt open punten, technische schuld en risico's voor opvolging.

## Open punten (code)
- Polling (3s) kan vervangen worden door SSE/WebSocket.
- Raspberry Pi Pico kan geen verbinding maken met de MQTT broker op de Linux server wanneer deze op een ander wifi-netwerk zit (bijv. Eureka_wifi).

## Technische risico's
- `.env` bevat secrets; zorg voor `.env.example` en veilige opslag.
- MQTT topics hebben geen QoS afspraken vastgelegd.
- Mosquitto persistence en Last Will & Testament ontbreken.
- `POST /api/pompen` heeft geen auth en kan misbruikt worden buiten trusted netwerk.

## Operationele risico's
- Geen monitoring of alerting standaard ingericht.
- Geen automatische back‑ups van de database vastgelegd.

## Aanbevolen verbeteringen
- Voeg TLS/HTTPS (Nginx + certbot) toe.
- Maak een standaard backup/restore procedure.
- Voeg unit tests toe voor `src/core`.
