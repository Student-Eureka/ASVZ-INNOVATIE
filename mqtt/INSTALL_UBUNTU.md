# MQTT installatie op Ubuntu (Mosquitto)

Dit document legt uit hoe je Mosquitto (MQTT broker) installeert, configureert en test op een Ubuntu server.
Het is bedoeld voor herstel na een server‑uitval.

## 1. Benodigdheden
- Ubuntu 20.04/22.04/24.04
- Root/sudo toegang

## 2. Installatie (handmatig)

```bash
sudo apt update
sudo apt install -y mosquitto mosquitto-clients
```

Controleer of de service draait:

```bash
sudo systemctl status mosquitto
```

## 3. Configuratie

Maak een eigen configbestand:

```bash
sudo mkdir -p /etc/mosquitto/conf.d
sudo nano /etc/mosquitto/conf.d/asvz.conf
```

Plaats hierin (basisconfig):

```conf
listener 1883
allow_anonymous false
password_file /etc/mosquitto/passwd
persistence true
persistence_location /var/lib/mosquitto/
log_dest file /var/log/mosquitto/mosquitto.log
```

## 4. Gebruikers aanmaken

Maak het wachtwoordbestand en gebruiker:

```bash
sudo mosquitto_passwd -c /etc/mosquitto/passwd mqttuser
```

Voeg extra gebruiker toe:

```bash
sudo mosquitto_passwd /etc/mosquitto/passwd anotheruser
```

## 5. Service herstarten

```bash
sudo systemctl restart mosquitto
sudo systemctl enable mosquitto
```

## 6. Firewall (optioneel)

Als UFW aan staat:

```bash
sudo ufw allow 1883/tcp
```

## 7. Testen

Luister op een topic:

```bash
mosquitto_sub -h <BROKER_IP> -t "asvz/+/+/status" -u mqttuser -P '<PASSWORD>'
```

Publiceer een testbericht:

```bash
mosquitto_pub -h <BROKER_IP> -t "asvz/woning_a/pomp_1/status" -m "actief" -u mqttuser -P '<PASSWORD>'
```

## 8. Topic‑conventie (ASVZ)

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

## 9. Troubleshooting
- Check logs:
  ```bash
  sudo tail -f /var/log/mosquitto/mosquitto.log
  ```
- Check config syntax:
  ```bash
  mosquitto -c /etc/mosquitto/conf.d/asvz.conf -v
  ```
- Poort open:
  ```bash
  sudo ss -lntp | grep 1883
  ```

---

# Script (automatisch)
Gebruik het script hieronder om Mosquitto automatisch te installeren en configureren.

## Script uitvoeren

```bash
sudo bash setup_mqtt_ubuntu.sh
```

Het script vraagt om:
- MQTT gebruiker
- MQTT wachtwoord

