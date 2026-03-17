# Testplan en Acceptatiecriteria

Dit document beschrijft de basis testen om te valideren dat het systeem werkt.

## Scope
De test richt zich op:
- Login en gebruikersbeheer
- Pompenstatus via MQTT
- Servo commando’s
- Basis performance en stabiliteit

---

## Test 1 - Login (user)
**Doel:** gebruiker kan inloggen.

Stappen:
1. Open webapp in browser.
2. Login met geldig account.

Verwacht:
- Login succesvol
- Dashboard zichtbaar

---

## Test 2 - Login (fout)
**Doel:** foutieve login wordt geweigerd.

Stappen:
1. Login met verkeerd wachtwoord.

Verwacht:
- Foutmelding "Ongeldige login"

---

## Test 3 - Pompenstatus zichtbaar
**Doel:** status van pomp is zichtbaar.

Stappen:
1. Zorg dat Pico live is.
2. Open dashboard.

Verwacht:
- Pomp staat in lijst.
- Status wijzigt wanneer MQTT bericht binnenkomt.

---

## Test 4 - Servo actie via webapp
**Doel:** servo beweegt na actie in webapp.

Stappen:
1. Klik “stop knop” / servo actie in webapp.
2. Observeer servo op device.

Verwacht:
- Servo beweegt (SWEEP).
- Event zichtbaar in statusboek (indien logging actief).

---

## Test 5 - MQTT manual publish
**Doel:** broker communicatie werkt.

Stappen:
```bash
mosquitto_pub -h <BROKER_IP> -t "asvz/woning_a/pomp_1/set" -m "SWEEP" -u <MQTT_USER> -P <MQTT_PASS>
```

Verwacht:
- Device reageert op commando.

---

## Acceptatiecriteria (samenvatting)
- Minimaal 1 gebruiker kan inloggen.
- MQTT status updates worden zichtbaar in webapp.
- Servo commando vanuit webapp werkt.
- Admin kan gebruikers beheren.
- Basis stabiliteit: app draait >1 uur zonder crash.
