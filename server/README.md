# Server installatie (Ubuntu) – ASVZ Webapplicatie

Deze handleiding beschrijft hoe je de **Linux server** opzet en de webapplicatie draait met **PM2**.
Doel: een herhaalbare procedure voor herstel of nieuwe deployments.

---

## 1. Benodigdheden
- Ubuntu 20.04/22.04/24.04
- SSH toegang + sudo
- Een domein of IP

---

## 2. Systeem voorbereiden

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y git curl build-essential
```

---

## 2.1 MySQL installeren (database)

### Handmatig

```bash
sudo apt install -y mysql-server
sudo systemctl enable mysql
sudo systemctl start mysql
```

Database en schema importeren:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS asvz_db;"
mysql -u root -p /opt/asvz/webapplicatie/db/asvz_db.sql
```

---

### Automatisch (script)
Gebruik het meegeleverde script:

```bash
sudo bash /opt/asvz/server/deploy_db_ubuntu.sh
```

Script verwacht dat de repo al staat in `/opt/asvz` en dat
`/opt/asvz/webapplicatie/db/asvz_db.sql` bestaat.

---

## 3. Node.js installeren (LTS)

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

---

## 4. PM2 installeren

```bash
sudo npm install -g pm2
pm2 -v
```

---

## 5. Project deployen

```bash
cd /opt
sudo git clone <REPO_URL> asvz
sudo chown -R $USER:$USER /opt/asvz
cd /opt/asvz/webapplicatie
```

Installeer dependencies:

```bash
npm install
```

---

## 6. Configuratie (.env)
Maak een `.env` in `webapplicatie/` (zelfde map als `package.json`).
Voorbeeld keys:

```
DB_HOST=
DB_PORT=
DB_USER=
DB_PASS=
DB_NAME=
HOST=
PORT=

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

---

## 7. Build & start

```bash
npm run build
pm2 start npm --name asvz-webapp -- start
pm2 save
```

Zorg dat PM2 automatisch start bij reboot:

```bash
pm2 startup
# volg de output en voer het command uit dat PM2 geeft
```

---

## 8. Basis firewall (optioneel)
Als UFW aan staat:

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

> De app zelf luistert standaard op poort 3000. Gebruik bij voorkeur een reverse proxy (Nginx) naar 3000.

---

## 9. Reverse proxy (Nginx) – aanbevolen

```bash
sudo apt install -y nginx
```

Voorbeeld config:

```nginx
server {
    listen 80;
    server_name <YOUR_DOMAIN_OR_IP>;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Herstart Nginx:

```bash
sudo systemctl restart nginx
```

---

## 10. Updates deployen

```bash
cd /opt/asvz/webapplicatie

git pull
npm install
npm run build
pm2 restart asvz-webapp
```

---

## 11. Logs bekijken

```bash
pm2 logs asvz-webapp
```

---

## 12. Troubleshooting
- **App start niet**: check `pm2 logs`.
- **MQTT errors**: check broker IP/credentials in `.env`.
- **DB errors**: check DB host/user/pass.
- **Poort bezet**: check `sudo ss -lntp | grep 3000`.

---

## 13. Checklijst (na installatie)
- `pm2 status` toont process **online**
- `curl http://localhost:3000` geeft HTML terug
- `/api/pompen` geeft JSON
- MQTT broker bereikbaar (zie `mqtt/INSTALL_UBUNTU.md`)

---

## 14. Opmerking
Deze setup draait **zonder Docker** en is bedoeld voor een **Ubuntu server met PM2**.
