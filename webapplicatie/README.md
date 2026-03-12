# Webapplicatie – ASVZ Innovatie

Deze map bevat de Next.js webapplicatie voor het Sondepomp Dashboard.

- [Architecture](./Architecture.md)
- [Project-Overdracht](./Project-Overdracht.md)

## Quick start / lokale run

1. Installeer dependencies:

```bash
npm install
```

2. Maak een `.env` in `webapplicatie/` met de benodigde variabelen (zie `.env.example`).

3. Start de dev‑server:

```bash
npm run dev
```

4. Open de app op `http://localhost:3000`.

## Belangrijke documenten
- `Architecture.md` – architectuur en laagregels
- `Project-Overdracht.md` – volledige technische overdracht

## Architectuur in het kort
De app is opgezet in 4 lagen:

```
Frontend → API → Core → Infra
```

- **Frontend (`src/app/`)**: UI en routing
- **API (`src/app/api/`)**: dunne adapters
- **Core (`src/core/`)**: business logic
- **Infra (`src/infra/`)**: database/MQTT

## Mappenstructuur (relevant)
```
src/
  app/
    _components/
    api/
    dashboard/
    login/
    admin/
    pompen/
    statusboek/
    docs/
  core/
    auth/
    users/
    servo/
  infra/
    db.ts
    userRepo.ts
    sessionRepo.ts
    mqttClient.ts
    mqttPublish.ts
```

## Configuratie (.env)
Deze keys worden verwacht:
```
MQTT_BROKER_URL=
MQTT_USER=
MQTT_PASS=

SERVO_MQTT_HOST=
SERVO_MQTT_PORT=
SERVO_MQTT_PROTOCOL=
SERVO_MQTT_USER=
SERVO_MQTT_PASS=
SERVO_MQTT_REJECT_UNAUTHORIZED=
```

Invulhulp:
- `MQTT_BROKER_URL` → `mqtt://<broker-ip>:1883`
- `MQTT_USER`/`MQTT_PASS` → de user/pass van je MQTT broker
- `SERVO_MQTT_PROTOCOL` → meestal `mqtt`
- `SERVO_MQTT_REJECT_UNAUTHORIZED` → `false` als je geen TLS gebruikt

Belangrijk bij MQTT install:
- Update `.env` met `MQTT_BROKER_URL`, `MQTT_USER`, `MQTT_PASS`.

## Scripts
```
npm run dev
npm run build
npm run start
```

## Notities
- MQTT draait server‑side; de frontend gebruikt alleen HTTP.
- De API‑laag bevat geen DB‑queries; die zitten in `src/infra`.

Voor details en open punten: zie `Project-Overdracht.md`.
