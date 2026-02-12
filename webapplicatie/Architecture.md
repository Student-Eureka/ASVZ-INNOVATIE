# Architecture - ASVZ Webapplicatie

Laatst bijgewerkt: 9 februari 2026.

## Doel van dit document
Dit document beschrijft de huidige architectuur van de applicatie.
Het dient als:
- Onboarding-document voor nieuwe developers.
- Referentie bij refactors en uitbreidingen.
- Leidraad om architectuurregels te bewaken.
- Context voor reviewers, docenten en toekomstige maintainers.

Dit document is geen design-spec voor toekomstige features, maar een beschrijving van wat er nu is en waarom.

## Overzicht
Dit project is een full-stack Next.js applicatie (App Router) waarin frontend, API-routes en server-side logic in een repository leven.

De code is logisch opgesplitst in duidelijke lagen:
- Frontend (UI & routing) -> `src/app`
- API-laag -> `src/app/api`
- Core (business logic / domein) -> `src/core`
- Infra (IO & externe systemen) -> `src/infra`

## Architectuurregel (belangrijk)
Een laag mag alleen de laag eronder importeren.

Frontend -> API -> Core -> Infra

Imports omhoog zijn niet toegestaan.
Waarom: dit voorkomt cyclische afhankelijkheden, houdt core onafhankelijk van frameworks, en maakt IO-delen vervangbaar en testbaar.

## Top-level mappen en bestanden
- `.next/`
Gegenereerde Next.js build output.
- `node_modules/`
Project dependencies.
- `public/`
Statische assets (logo's, afbeeldingen).
- `db/`
SQL bestanden (bijv. `woningen_db.sql`).
- `lib/`
Legacy utilities en tests (technische schuld). Gebruik dit niet voor nieuwe code.
- `src/`
Alle applicatiecode.
- `Architecture.md`
Dit document.
- `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `.env`
Projectconfiguratie.

## Mappenstructuur in `src/`
```
src/
  app/
    _components/

    admin/
      _components/
      _data/
      _types/

    api/
      login/route.ts
      logout/route.ts
      pompen/route.ts
        _services/pompen.ts
      servo/route.ts
      users/route.ts

    dashboard/
      _components/
      _types/

    docs/
      _components/
      _data/
      _types/

    login/
      _components/
      _types/

    pompen/
      _components/
      _data/
      _types/
      [id]/
        _components/
        _data/
        _types/

    statusboek/
      _components/

  core/
    auth/
    users/
    servo/
    pompenStore.ts

  infra/
    db.ts
    mqttClient.ts
    mqttPublish.ts
    sessionRepo.ts
    userRepo.ts
```

## Architectuurlagen en verantwoordelijkheden
Frontend - `src/app`
Verantwoordelijk voor:
- Routing (Next.js App Router).
- UI rendering.
- User interactions.

Kenmerken:
- Geen directe database- of MQTT-toegang.
- Communiceert via API-routes (`/api/*`).
- Feature-gebaseerde structuur (dashboard, docs, pompen, etc.).

Per feature:
- `_components/` -> UI componenten.
- `_data/` -> statische data.
- `_types/` -> TypeScript types.

Shared UI:
- `src/app/_components/` bevat gedeelde UI componenten.

API-laag - `src/app/api`
Verantwoordelijk voor:
- HTTP request/response handling.
- Validatie en autorisatie.
- Doorsturen naar core-logica.

Kenmerken:
- Bevat geen business logic.
- Roept functies aan uit `src/core`.
- Vormt de grens tussen frontend en core.

Autorisatie en checks:
- Via `src/core/auth/session.ts` en gerelateerde core-logica.

Core - `src/core`
Verantwoordelijk voor:
- Domeinlogica.
- Business rules.
- Use-cases.

Voorbeelden:
- Authenticatie (`auth/`).
- Gebruikersbeheer (`users/`).
- Pompen status en state (`pompenStore.ts`).
- Servo-acties (`servo/commands.ts`).

Kenmerken:
- Kent geen Next.js, HTTP of UI.
- Gebruikt infra voor IO.
- Volledig testbaar zonder frontend.

Infra - `src/infra`
Verantwoordelijk voor:
- IO en externe systemen.

Voorbeelden:
- Database connectie (`db.ts`).
- Repositories (`userRepo.ts`, `sessionRepo.ts`).
- MQTT clients (`mqttClient.ts`, `mqttPublish.ts`).

Kenmerken:
- Bevat geen business rules.
- Wordt alleen aangeroepen door core.
- Mag nooit omhoog importeren.
Waarom: infra is bedoeld als detail (DB/MQTT). Door niet omhoog te importeren blijft core leidend en blijft vervanging of mocking van infra eenvoudig.

## Belangrijke data-flows
Login flow
1. Frontend -> `POST /api/login`.
2. API -> `src/core/auth/login.ts`.
3. Core -> `src/infra/userRepo.ts` + `src/infra/sessionRepo.ts`.
4. API zet session cookie.

Users beheer
1. Frontend -> `GET/POST/PATCH/DELETE /api/users`.
2. API -> `src/core/users/users.ts`.
3. Core -> `src/infra/userRepo.ts`.
4. Session check via `src/core/auth/session.ts`.

Pompen status (MQTT -> UI)
1. `src/infra/mqttClient.ts` maakt MQTT verbinding.
2. `src/core/pompenStore.ts` verwerkt MQTT-berichten.
3. `GET /api/pompen` leest state uit core.
4. Frontend pollt API.
5. `src/app/api/pompen/_services/pompen.ts` bevat nog mockdata en is niet de bron van waarheid.

Servo command
1. Frontend -> `POST /api/servo`.
2. API -> `src/core/servo/commands.ts`.
3. Core -> `src/infra/mqttPublish.ts`.
4. MQTT broker -> device.

## Configuratie en runtime
Scripts (`package.json`)
- `dev` -> `next dev -H 0.0.0.0 -p 3000`
- `build` -> `next build`
- `start` -> `next start -H 0.0.0.0 -p 3000`
- `lint` -> `eslint`

Environment variables
Voorbeelden:
- `MQTT_BROKER_URL`
- `MQTT_USER`
- `MQTT_PASS`
- `SERVO_MQTT_HOST`
- `SERVO_MQTT_PORT`
- `SERVO_MQTT_PROTOCOL`

## Technische schuld en open punten
- `lib/` bevat legacy code (infra + business logic gemengd).
- `src/app/api/pompen/_services/pompen.ts` gebruikt mockdata.
- Admin UI kan verder opgesplitst worden.

Prioriteit:
- Verwijderen van legacy `lib/`.
- Migratie mockdata -> core/infra.
- Verdere opsplitsing admin UI.

## Architectuurregels (samenvatting)
Toegestaan:
- Frontend -> API.
- API -> Core.
- Core -> Infra.

Niet toegestaan (anti-patterns):
- Business logic in API-routes.
- Directe DB/MQTT imports in frontend.
- Core die Next.js of HTTP-types kent.
- Infra die core of app importeert.
Waarom: deze anti-patterns veroorzaken tight coupling, maken testen moeilijker en leiden tot afhankelijkheden die refactors en schaalbaarheid blokkeren.
