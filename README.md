# ASVZ Innovatie - Alarm Stop Systeem

## Project in een zin

Met dit project kunnen begeleiders via een webapp **op afstand een fysieke stopknop indrukken**, zodat een alarmsignaal snel wordt uitgezet zonder dat iemand naar het apparaat hoeft te lopen. Dit bespaart tijd, vermindert onrust en houdt de controle bij de begeleider.

---

## Probleem & Context

Op ASVZ-locaties geven apparaten zoals sondepompen een piepend alarm dat handmatig moet worden uitgezet. Praktische problemen:

- Begeleiders zijn niet altijd in de buurt
- Het piepen veroorzaakt stress en onrust bij clienten
- Begeleiders moeten hun werk onderbreken om het alarm uit te zetten

---

## Doel & Uitgangspunten

Doel: een **simpele, betrouwbare oplossing** waarmee begeleiders een alarm **bewust en handmatig op afstand** kunnen stoppen.

Belangrijke uitgangspunten:

- Geen automatische acties - alles gebeurt bewust
- Elke locatie heeft eigen inloggegevens
- Hardware is gekoppeld aan een fysieke knop per apparaat
- Betrouwbaarheid staat boven snelheid

---

## Oplossing

De oplossing bestaat uit twee onderdelen die samen een probleem oplossen.

### Webapplicatie

- Laat begeleiders inloggen per locatie
- Een duidelijke knop voor het stoppen van alarmsignalen
- Browser-based, geen aparte apps nodig

### Hardware

- Ontvangt signalen van de webapp via MQTT
- Drukt mechanisch de echte stopknop in
- Onafhankelijk van het apparaat, waardoor bestaande apparatuur niet aangepast hoeft te worden

### Workflow (visueel)

```
[Piep apparaat]
      |
      v
[Begeleider logt in Webapp]
      |
      v
[Drukt digitale stopknop]
      |
      v
[MQTT Broker]
      |
      v
[Hardware]
      |
      v
[Fysieke Stopknop ingedrukt]
      |
      v
[Piep stopt]
```

---

## Voor wie

- **Begeleiders** - sneller reageren zonder andere taken te laten vallen
- **Technisch beheer & innovatie** - reproduceerbaar en onderhoudbaar
- **Ontwikkelaars** - begrijpelijk, aanpasbaar en uitbreidbaar

Niet bedoeld voor consumenten; het is specifiek voor de zorgcontext.

---

## Beveiliging & Toegang

- Gebruikers zien alleen hun eigen apparaten
- Clienten hebben geen toegang
- Simpel accountsysteem voor makkelijk beheer
- Elke actie wordt bewust uitgevoerd door een begeleider

---

## Randvoorwaarden

- Elke locatie heeft een eigen account
- Hardware is gekoppeld aan een fysieke knop
- Betrouwbaarheid belangrijker dan snelheid
- Geen automatische acties; verantwoordelijkheid blijft bij de begeleider

---

## Wat dit project niet is

- **Geen volledig IoT-platform** - het project is bewust beperkt tot het specifiek stoppen van alarmsignalen. Het is geen universeel systeem om alle apparaten op afstand te beheren of data te verzamelen.
- **Geen AI-oplossing** - er wordt geen voorspelling of automatische besluitvorming uitgevoerd. Het systeem reageert alleen op acties van de begeleider.
- **Vervangt geen bestaande alarmsystemen** - het systeem werkt ernaast en ondersteunt alleen de bestaande hardware, het neemt de veiligheid of waarschuwingen van het originele systeem niet over.

Door deze focus blijft het systeem betrouwbaar, overzichtelijk en veilig.

---

## Projectstructuur

```
ASVZ_Innovatie/
|-- README.md              # Main overzicht (dit document)
|-- webapplicatie/
|   |-- README.md           # Technische setup, login flow, API
|   |-- Project-Overdracht.md
|   `-- ...
`-- hardware/
    |-- README.md           # Hardware-opbouw, pinout, code
    `-- ...
```

---

## Status

| Component              | Status             |
| ---------------------- | ------------------ |
| Concept & Architectuur | ✅ Voltooid         |
| Webapplicatie          | ⚙️ In ontwikkeling |
| Hardware               | 🧪 Prototype       |
| Productie-klaar        | ❌ Nog niet         |

---

## Toekomstblik

Ideeën voor mogelijke vervolgontwikkeling (voor toekomstige stagiairs of teams):

- **Docker + Docker Compose**: het idee is om de volledige stack te draaien in een Docker omgeving. Op dit moment draait alles op een Linux server met PM2; frontend, backend, MQTT en database worden los beheerd. Dit kan vereenvoudigd worden door alles te bundelen in een `docker-compose.yml`, inclusief alle configuraties. Daarmee kun je de complete stack in 1 keer starten, consistent uitrollen en bij problemen eenvoudig op een andere machine opnieuw opstarten.

  Een mogelijke herstructurering die hierbij past:
  
  ```
  ASVZ-INNOVATIE/
  Frontend/
  Backend/
  Mqtt/
  Server/ (server scripts en documentatie)
  ```
  
  De database kan dan ook via Docker worden gedraaid.

---

- **PostgreSQL**: kan een logische upgrade zijn wanneer het datamodel complexer wordt (audit logging, rapportages, JSON-velden). Het biedt sterke data-betrouwbaarheid en krachtige query-mogelijkheden. Voor de huidige scope blijft MySQL voldoende en eenvoudiger in beheer.

---

## Documentatie & Reproduceerbaarheid

Deze repository bevat:

- Installatie-instructies
- Configuratie-uitleg
- Hardware-informatie en onderdelen
- Uitleg voor begeleiders
- Informatie om het systeem op andere locaties opnieuw te bouwen

Links naar detaildocumentatie:

- `webapplicatie/README.md` - Webapp setup, login flow, API
- `webapplicatie/Project-Overdracht.md` - Technische overdracht (huidige stand)
- `hardware/README.md` - Pinout, actuator, hardware code
- `mqtt/README.md` - Topics, QoS, setup
- `mqtt/INSTALL_UBUNTU.md` - MQTT installatie op Ubuntu
- `server/README.md` - Linux server setup (Ubuntu + PM2)
