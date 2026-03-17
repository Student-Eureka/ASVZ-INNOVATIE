# API - Overzicht (Next.js routes)

Deze pagina beschrijft de belangrijkste API endpoints.
Alle routes draaien onder de webapp server (standaard `http://<host>:3000`).

## Auth
Sessies worden beheerd via een `session` cookie (httpOnly).
Alle endpoints hieronder verwachten die cookie, behalve waar expliciet anders vermeld.

---

## Auth routes

### `POST /api/login`
Login met locatie-account.

Body:
```json
{
  "gebruikersnaam": "woning_a",
  "wachtwoord": "geheim"
}
```

Response (200):
```json
{ "success": true }
```

Response (4xx):
```json
{ "message": "Ongeldige login" }
```

### `POST /api/logout`
Logt uit en wist de `session` cookie.

Response:
```json
{ "success": true }
```

### `GET /api/me`
Geeft basisinformatie van de ingelogde gebruiker terug.

Response:
```json
{
  "id": 1,
  "role": "admin",
  "username": "woning_a"
}
```

---

## Pompen

### `GET /api/pompen`
Geeft pompen terug voor de woning van de ingelogde gebruiker.

Response (voorbeeld):
```json
[
  {
    "uniqueId": "woning_a_pomp_1",
    "id": "pomp_1",
    "woning": "woning_a",
    "status": "rust",
    "lastUpdate": "2026-03-10T10:35:00.000Z",
    "statusTopic": "asvz/woning_a/pomp_1/status",
    "commandTopic": "asvz/woning_a/pomp_1/set"
  }
]
```

### `POST /api/pompen`
Interne status update (wordt gebruikt door server-side MQTT/verwerking).

Body:
```json
{
  "woning": "woning_a",
  "pompId": "pomp_1",
  "status": "actief",
  "topic": "asvz/woning_a/pomp_1/status"
}
```

Response:
```json
{ "status": "ok" }
```

Let op: deze route heeft **geen auth** en is bedoeld voor interne verwerking.
Beperk deze route tot een trusted netwerk.

### `GET /api/pompen/events`
Geeft het statusboek (events) van de ingelogde woning terug.

Response (voorbeeld):
```json
[
  {
    "woning": "woning_a",
    "pompId": "pomp_1",
    "status": "actief",
    "timestamp": "2026-03-10T10:35:00.000Z",
    "topic": "asvz/woning_a/pomp_1/status"
  }
]
```

---

## Servo

### `POST /api/servo`
Stuurt een servo commando richting device via MQTT.

Body (defaults in server):
```json
{
  "woning": "woning_a",
  "pompId": "pomp_1",
  "payload": "SWEEP"
}
```

Response:
```json
{
  "success": true,
  "message": "Commando verstuurd naar woning_a/pomp_1"
}
```

---

## Admin

### `GET /api/users`
Admin-only. Alle gebruikers.

### `POST /api/users`
Admin-only. Nieuwe gebruiker aanmaken.

Body:
```json
{
  "name": "woning_b",
  "password": "geheim",
  "role": "user"
}
```

### `PATCH /api/users`
Admin-only. Gebruiker aanpassen.

Body:
```json
{
  "id": 2,
  "name": "woning_b",
  "password": "nieuw",
  "role": "admin"
}
```

### `DELETE /api/users`
Admin-only. Gebruiker verwijderen.

Body:
```json
{ "id": 2 }
```

### `GET /api/admin/audit`
Admin-only. Audit log voor de woning.

### `GET /api/admin/pompen/new`
Admin-only. Laat pompen zien die via MQTT gevonden zijn maar nog niet geregistreerd.

### `POST /api/admin/pompen/new`
Admin-only. Registreert een gevonden pomp.

Body:
```json
{ "pompId": "pomp_4" }
```
