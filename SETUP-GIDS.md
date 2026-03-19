# Setup Gids (End-to-end installatiepad)

Dit document beschrijft de volledige installatie van het systeem, van server tot hardware.
Het is bedoeld als snelle, herhaalbare handleiding voor een nieuwe omgeving.

## Overzicht
Volg deze volgorde:
1. Server basis setup
2. Database (MySQL/MariaDB)
3. MQTT broker (Mosquitto)
4. Webapplicatie (Next.js)
5. Hardware (Raspberry Pi Pico W)
6. End-to-end test

---

## 1. Server basis setup (Ubuntu)
Zie `server/README.md` voor details. Samenvatting:

1. Update server en installeer basis tools:
```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y git curl build-essential
```

2. Clone de repo:
```bash
cd /opt
sudo git clone <REPO_URL> asvz
sudo chown -R $USER:$USER /opt/asvz
```

---

## 2. Database installeren en vullen
Zie `server/README.md` voor detail en `webapplicatie/db/asvz_db.sql` voor het schema.

1. Installeer MySQL:
```bash
sudo apt install -y mysql-server
sudo systemctl enable mysql
sudo systemctl start mysql
```

2. Maak database en importeer schema:
```bash
sudo mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS asvz_db;"
sudo mysql -u root -p "<database-name>" < "Path To .sql file from bash"
```
Als wachtwoord nodig is voor localhost@root, "sudo passwd root" om wachtwoord te veranderen.

3. Maak een app-user (aanbevolen):
```bash
sudo mysql
```
```sql
CREATE USER 'asvz_app'@'localhost' IDENTIFIED BY 'SterkWachtwoord';
GRANT ALL PRIVILEGES ON asvz_db.* TO 'asvz_app'@'localhost';
FLUSH PRIVILEGES;
```

---

## 3. MQTT broker installeren
Zie `mqtt/INSTALL_MQTT.md` voor detail.

1. Installeer Mosquitto:
```bash
sudo apt update
sudo apt install -y mosquitto mosquitto-clients
```

2. Voeg configuratie toe:
```bash
sudo mkdir -p /etc/mosquitto/conf.d
sudo nano /etc/mosquitto/conf.d/asvz.conf
```

Inhoud:
```conf
listener 1883
allow_anonymous false
password_file /etc/mosquitto/passwd

listener 9001
protocol websockets
```

3. Maak MQTT user:
```bash
sudo mosquitto_passwd -c /etc/mosquitto/passwd mqttuser
sudo chown mosquitto:mosquitto /etc/mosquitto/passwd
sudo chmod 640 /etc/mosquitto/passwd
```

4. Herstart Mosquitto:
```bash
sudo systemctl restart mosquitto
sudo systemctl enable mosquitto
```

---

## 4. Webapplicatie deployen
Zie `server/README.md` en `webapplicatie/README.md` voor detail.

1. Ga naar de webapp map en installeer dependencies:
```bash
cd /opt/asvz/webapplicatie
sudo apt install npm
npm install
```

2. Maak `.env` in `webapplicatie/`. en verwissel de placeholders met jou eigen informatie.
```bash
sudo nano .env
```

met minimaal:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=asvz_app
DB_PASS=SterkWachtwoord
DB_NAME=asvz_db
HOST=0.0.0.0
PORT=3000

MQTT_BROKER_URL=mqtt://<BROKER_IP>:1883
MQTT_USER=<MQTT_USER>
MQTT_PASS=<MQTT_PASS>

SERVO_MQTT_HOST=<BROKER_IP>
SERVO_MQTT_PORT=1883
SERVO_MQTT_PROTOCOL=mqtt
SERVO_MQTT_USER=<MQTT_USER>
SERVO_MQTT_PASS=<MQTT_PASS>
SERVO_MQTT_REJECT_UNAUTHORIZED=false
```

3. Build en start:
```bash
npm run build
npm install -g pm2
pm2 start npm --name asvz-webapp -- start
pm2 save
```

---

## 5. Hardware (Raspberry Pi Pico W)
Zie `hardware/` voor code. Er moet nog een `hardware/README.md` komen met flashing en wiring.

Voor nu:
1. Zet `main.py` op de Pico W.
2. Update in `main.py`:
   - `WIFI_SSID`
   - `WIFI_PASSWORD`
   - `MQTT_BROKER`
   - `MQTT_USER`
   - `MQTT_PASSWORD`
   - `WONING` en `POMP`

3. Start de Pico en controleer of hij connect met MQTT.

---

## 6. End-to-end test
1. Check webapp status:
```bash
curl http://localhost:3000
```

2. Check API pompen:
```bash
curl http://localhost:3000/api/pompen
```

3. MQTT status volgen:
```bash
mosquitto_sub -h <BROKER_IP> -t "asvz/+/+/status" -u <MQTT_USER> -P <MQTT_PASS>
```

4. Servo command testen:
```bash
mosquitto_pub -h <BROKER_IP> -t "asvz/woning_a/pomp_1/set" -m "SWEEP" -u <MQTT_USER> -P <MQTT_PASS>
```

---

## Belangrijk
- Vul overal `<...>` waarden in met echte gegevens.
- Zorg dat MQTT en DB bereikbaar zijn vanaf de webapp server.
- Zet secrets nooit in git, gebruik `.env` of een secret manager.
