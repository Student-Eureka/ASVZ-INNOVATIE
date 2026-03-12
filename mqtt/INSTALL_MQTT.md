# MQTT installatie op Ubuntu (Mosquitto)

Dit document legt uit hoe je Mosquitto (MQTT broker) installeert, configureert en test op een Ubuntu server.
Het is bedoeld voor herstel na een server‑uitval.
Let op: waar `<...>` staat moet je **zelf iets invullen** (bijv. `<BROKER_IP>`).

## 1. Benodigdheden
- Ubuntu 20.04/22.04/24.04
- Root/sudo toegang

## 2. Handmatige installatie

### 2.1 Installatie
```bash
sudo apt update
sudo apt install -y mosquitto mosquitto-clients
```

### 2.2 Configuratie
```bash
sudo mkdir -p /etc/mosquitto/conf.d
sudo nano /etc/mosquitto/conf.d/asvz.conf
```

Zet in `asvz.conf`:
```conf
# TCP listener
listener 1883
allow_anonymous false
password_file /etc/mosquitto/passwd

# WebSocket listener (voor MQTT Explorer)
listener 9001
protocol websockets
```

> Opmerking: de standaard `mosquitto.conf` bevat vaak al `persistence` en `log_dest`. Zet die niet dubbel in `asvz.conf`.

### 2.3 Gebruiker aanmaken
```bash
sudo mosquitto_passwd -c /etc/mosquitto/passwd mqttuser
sudo chown mosquitto:mosquitto /etc/mosquitto/passwd
sudo chmod 640 /etc/mosquitto/passwd
```

### 2.4 Service herstarten
```bash
sudo systemctl restart mosquitto
sudo systemctl enable mosquitto
```

---

## 3. Automatische installatie (script)
Het script doet een **clean install**: bestaande Mosquitto + config worden verwijderd.

### 3.1 Script uitvoeren
```bash
chmod +x setup_mqtt_ubuntu.sh
sudo bash ./setup_mqtt_ubuntu.sh
```

Het script vraagt om:
- MQTT gebruiker
- MQTT wachtwoord

Na afloop draait de broker op:
- TCP **1883**
- WebSocket **9001**

Daarna .env bijwerken in de webapp:
- `MQTT_BROKER_URL`
- `MQTT_USER`
- `MQTT_PASS`

---

## 4. Firewall (optioneel)
Als UFW aan staat:
```bash
sudo ufw allow 1883/tcp
sudo ufw allow 9001/tcp
```

---

## 5. Testen (pub/sub)

**Terminal 1 – subscriber**:
```bash
mosquitto_sub -h <BROKER_IP> -t "asvz/test" -u <USER> -P '<PASS>'
```

**Terminal 2 – publisher**:
```bash
mosquitto_pub -h <BROKER_IP> -t "asvz/test" -m "test-ok" -u <USER> -P '<PASS>'
```

Als alles goed is, zie je in terminal 1:
```
test-ok
```

---

## 6. MQTT Explorer via WebSockets
Gebruik in MQTT Explorer:
- **Host**: `<BROKER_IP>`
- **Port**: `9001`
- **Protocol**: `ws`
- **Username/Password**: dezelfde als voor MQTT

---

## 7. Topic‑conventie (ASVZ)

Status (device → server):
```
asvz/{woning}/{pomp}/status
```

Command (server → device):
```
asvz/{woning}/{pomp}/set
```

Payload voorbeeld:
```
SWEEP
```

---

## 8. Troubleshooting
- Check logs:
  ```bash
  sudo tail -f /var/log/mosquitto/mosquitto.log
  ```
- Check config syntax:
  ```bash
  sudo mosquitto -c /etc/mosquitto/conf.d/asvz.conf -v
  ```
- Poorten open:
  ```bash
  sudo ss -lntp | egrep "1883|9001"
  ```
