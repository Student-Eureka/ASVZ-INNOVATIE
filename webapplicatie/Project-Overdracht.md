# Technische Overdracht – ASVZ Innovatie (Sondepomp Dashboard)

Dit document is bedoeld voor **technische begeleiders, IT, en opvolgende studenten**. Het beschrijft de **huidige staat**, gemaakte keuzes, en wat nog open staat.

---

## 1. Projectdoel
Een full‑stack webapplicatie waarmee begeleiders:
- kunnen **inloggen per locatie**
- **pompstatussen** kunnen bekijken
- **servo‑acties** via MQTT kunnen uitvoeren
- **gebruikers** kunnen beheren
- **status/logboek** kunnen raadplegen
- **documentatie** in de app kunnen lezen

---

## 2. Huidige Architectuur
De applicatie volgt een **gelaagde architectuur**:

```
Frontend → API → Core → Infra
```

**Regel:** een laag mag alleen de laag eronder kennen.

### 2.1 Frontend (`src/app`)
- UI, routing, en user‑interaction (Next.js App Router)
- **Geen** DB/MQTT/business logic
- Feature‑gebaseerd opgesplitst in `_components`, `_data`, `_types`

Routes:
```
/dashboard
/login
/admin
/pompen
/pompen/[id]
/statusboek
/docs
```

### 2.2 API‑laag (`src/app/api`)
- Dunne adapters: HTTP → core → HTTP
- **Geen** DB‑queries of business logic

Belangrijkste routes:
- `/api/login`
- `/api/logout`
- `/api/users`
- `/api/pompen`
- `/api/servo`

### 2.3 Core (`src/core`)
- Business logic en domeinregels
- **Geen** Next.js imports

Voorbeelden:
- `core/auth/*`
- `core/users/*`
- `core/servo/*`
- `core/pompenStore.ts`

### 2.4 Infra (`src/infra`)
- Technische implementaties
- DB connectie, repositories, MQTT client/publish
- **Kent core niet**

---

## 3. Belangrijke Data‑Flows

### Login
1. Frontend → `POST /api/login`
2. API → `core/auth/login.ts`
3. Core → `infra/userRepo.ts` + `infra/sessionRepo.ts`
4. API zet sessie‑cookie

### Pompenstatus (MQTT)
1. MQTT client draait server‑side (`infra/mqttClient.ts`)
2. Core verwerkt berichten (`core/pompenStore.ts`)
3. API biedt snapshot via `/api/pompen`
4. Frontend pollt `/api/pompen` (3s interval)

### Servo actie
1. Frontend → `POST /api/servo`
2. API → `core/servo/commands.ts`
3. Core → `infra/mqttPublish.ts`
4. MQTT broker → device

---

## 4. Projectstructuur (relevante delen)
```
webapplicatie/
  Architecture.md
  src/
    app/
      _components/         # AppSidebar
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
      pompenStore.ts
    infra/
      db.ts
      userRepo.ts
      sessionRepo.ts
      mqttClient.ts
      mqttPublish.ts
```

---

## 5. Configuratie (.env)
Belangrijkste keys:
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

---

## 6. Wat er al professioneel staat
- Gelaagde architectuur (frontend → API → core → infra)
- MQTT server‑side (geen MQTT in frontend)
- API‑routes zijn dun
- Core vrij van Next.js imports
- Infra bevat DB/MQTT
- Feature‑based UI structuur
- Globale sidebar op publieke pagina’s

---

## 7. Technische Schuld / open punten
**Moet nog:**
1. **TypeScript fixes**
   - `src/app/pompen/_components/PompenSidebar.tsx` gebruikt `React.ReactNode` zonder import
   - (check overige componenten op hetzelfde patroon)

2. **Mock‑data vervangen**
   - `src/app/api/pompen/_services/pompen.ts` is nog mock; moet data uit core/infra gebruiken

3. **Legacy `lib/` opruimen**
   - `lib/db.js` wordt nog gebruikt via `infra/db.ts` → migreren naar echte infra‑db

4. **Admin‑link rolcheck**
   - Link zichtbaar voor iedereen; later role‑based tonen

5. **Polling vervangen door realtime**
   - Overweeg SSE/WebSocket in plaats van 3s polling

---

## 8. Aanbevolen roadmap

### Fase 1 – Stabiliseren
- TS‑errors oplossen
- Mockdata verwijderen
- Legacy `lib/` opruimen

### Fase 2 – Security
- MQTT authenticatie harden
- `.env.example` aanmaken
- Reverse proxy/HTTPS toevoegen

### Fase 3 – Professionaliseren
- Logging standaardiseren
- Error handling uniform maken
- Unit tests voor core

### Fase 4 – Uitbreiden
- Realtime updates (SSE/WebSocket)
- Audit logging
- Uitgebreid statuslogboek

---

## 9. Voor opvolgende studenten
Lees ook:
1. `Architecture.md`


Belangrijke regels:
- Business logic hoort in `src/core`
- Geen DB/MQTT in frontend
- API‑routes zijn dun
- Infra bevat technische implementatie

---

## 10. Conclusie
Het project is nu **architectonisch gezond en uitbreidbaar**. De grootste winst is de scheiding van lagen en server‑side MQTT. Met het oplossen van de open punten is dit geschikt voor productie of verdere professionalisering.

---

> Tip: Voor een management‑versie kan dit worden ingekort tot 1‑2 pagina’s met alleen doel, impact en status.
