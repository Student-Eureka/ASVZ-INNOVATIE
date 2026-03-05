#!/usr/bin/env bash
set -euo pipefail

# Controleert of het script als root gedraait wordt
if [ "$(id -u)" -ne 0 ]; then
  echo "Run as root: sudo bash setup_mqtt_ubuntu.sh"
  exit 1
fi

# Waarschuwing: clean install (alles verwijderen)
echo "This will REMOVE any existing Mosquitto installation and config."
read -rp "Type YES to continue: " CONFIRM
if [ "$CONFIRM" != "YES" ]; then
  echo "Aborted."
  exit 1
fi

# Vraagt gebruiker om een username en password
read -rp "MQTT username: " MQTT_USER
read -rsp "MQTT password: " MQTT_PASS
echo

# Stopt en purged (verwijderd) bestaande Mosquitto (als die al bestaat) 
if systemctl list-unit-files | grep -q '^mosquitto.service'; then
  systemctl stop mosquitto || true
fi

apt purge -y mosquitto mosquitto-clients || true
apt autoremove -y || true

# Verwijderd oude configs en data (clean install)
rm -rf /etc/mosquitto
rm -rf /var/lib/mosquitto
rm -rf /var/log/mosquitto
rm -rf /run/mosquitto

# Installeerd Mosquitto helemaal opnieuw
apt update
apt install -y mosquitto mosquitto-clients

# Maakt configuratiemap aan
mkdir -p /etc/mosquitto/conf.d

# Schrijft nieuwe configuratie in aangemaakt file
cat > /etc/mosquitto/conf.d/asvz.conf <<'EOF'
# TCP listener
listener 1883
allow_anonymous false
password_file /etc/mosquitto/passwd

# WebSocket listener
listener 9001
protocol websockets
EOF

# Maakt een MQTT gebruiker aan in password file
mosquitto_passwd -c /etc/mosquitto/passwd "$MQTT_USER"

# Zet permissies correct zodat Mosquitto het bestand kan lezen
chown mosquitto:mosquitto /etc/mosquitto/passwd
chmod 640 /etc/mosquitto/passwd

# Herstart Mosquitto en zorgt dat hij opstart bij reboot
systemctl restart mosquitto
systemctl enable mosquitto

# DONE FEEDBACK
echo "Done. Broker running on ports 1883 (TCP) and 9001 (WebSocket)."
