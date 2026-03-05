# MQTT – ASVZ Innovatie

Deze README beschrijft de MQTT‑communicatie tussen webapp en hardware.

## 1. Doel
MQTT wordt gebruikt om:
- statusupdates van pompen te ontvangen
- commando’s (zoals servo‑acties) naar devices te sturen

## 2. Broker
De broker is **Eclipse Mosquitto**.

Belangrijk:
- De broker draait op een **Ubuntu server** (geen Docker).
- Gebruik het IP/DNS van de server als broker‑host.

## 3. Topics
### Status (device → server)
```
asvz/{woning}/{pomp}/status
```
Voorbeeld:
```
asvz/woning_a/pomp_1/status
```

### Command (server → device)
```
asvz/{woning}/{pomp}/set
```
Voorbeeld:
```
asvz/woning_a/pomp_1/set
```
Payload voorbeeld:
```
SWEEP
```

## 4. Server‑side verwerking
- MQTT client draait **server‑side** (niet in de frontend)
- `src/infra/mqttClient.ts` maakt de connectie
- `src/core/pompenStore.ts` verwerkt de berichten en houdt een snapshot

## 5. Servo‑actie via API
Flow:
1. Frontend → `POST /api/servo`
2. API → `src/core/servo/commands.ts`
3. Core → `src/infra/mqttPublish.ts`
4. Broker → device

## 6. Configuratie (.env)
Voorbeeld keys:
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

## 7. Testen (handmatig)
Gebruik bijv. `mosquitto_pub` en `mosquitto_sub`:

```
mosquitto_sub -h <broker> -t "asvz/+/+/status" -u <user> -P <pass>
```

```
mosquitto_pub -h <broker> -t "asvz/woning_a/pomp_1/set" -m "SWEEP" -u <user> -P <pass>
```

## 8. Open punten
- QoS‑niveau bepalen
- Retained messages evalueren
- Last Will & Testament instellen
- Broker persistence configureren

## Ubuntu installatie
Zie `INSTALL_UBUNTU.md` voor de volledige handleiding.

Snelle setup via script:
```bash
sudo bash setup_mqtt_ubuntu.sh
```
