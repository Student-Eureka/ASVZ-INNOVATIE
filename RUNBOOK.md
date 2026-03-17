# Runbook - Storingen en Checks

Dit document helpt bij storing, debugging en gezondheid checks.

## Snelstart checks (bij storing)
1. Webapp draait?
```bash
pm2 status
pm2 logs asvz-webapp
```

2. Webapp bereikbaar?
```bash
curl http://localhost:3000
curl http://localhost:3000/api/pompen
```

3. Database draait?
```bash
sudo systemctl status mysql
mysql -u root -p -e "SHOW DATABASES;"
```

4. MQTT broker draait?
```bash
sudo systemctl status mosquitto
sudo ss -lntp | egrep "1883|9001"
```

5. MQTT connectie werkt?
```bash
mosquitto_sub -h <BROKER_IP> -t "asvz/+/+/status" -u <MQTT_USER> -P <MQTT_PASS>
```

---

## Veelvoorkomende issues

### Webapp start niet
Check:
- `pm2 logs asvz-webapp`
- `.env` bestaat en is volledig
- poort 3000 vrij

Command:
```bash
sudo ss -lntp | grep 3000
```

### Database errors
Check:
- MySQL service draait
- Credentials in `.env` kloppen

Command:
```bash
sudo systemctl status mysql
mysql -u <DB_USER> -p -e "USE asvz_db; SHOW TABLES;"
```

### MQTT errors in logs
Check:
- Broker bereikbaar
- Username/password correct
- Poort 1883 open

Command:
```bash
mosquitto_pub -h <BROKER_IP> -t "asvz/test" -m "ping" -u <MQTT_USER> -P <MQTT_PASS>
```

### Pico W connect niet
Check:
- SSID / wachtwoord
- 2.4GHz netwerk
- Broker IP

Tip: serial console in Thonny gebruiken voor logs.

### Servo beweegt niet
Check:
- Externe 5V voeding
- GND gedeeld
- GPIO15 correct

---

## Gezondheid checks (periodiek)
1. `pm2 status` = online
2. `curl /api/pompen` geeft JSON
3. `mosquitto_sub` ontvangt status
4. Pico W publiceert elke 5s heartbeat
