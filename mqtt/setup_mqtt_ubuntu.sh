#!/usr/bin/env bash
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run as root: sudo bash setup_mqtt_ubuntu.sh"
  exit 1
fi

echo "This will REMOVE any existing Mosquitto installation and config."
read -rp "Type YES to continue: " CONFIRM
if [ "$CONFIRM" != "YES" ]; then
  echo "Aborted."
  exit 1
fi

read -rp "MQTT username: " MQTT_USER
read -rsp "MQTT password: " MQTT_PASS
echo

# Stop and purge existing mosquitto (if any)
if systemctl list-unit-files | grep -q '^mosquitto.service'; then
  systemctl stop mosquitto || true
fi

apt purge -y mosquitto mosquitto-clients || true
apt autoremove -y || true

# Remove old configs and data
rm -rf /etc/mosquitto
rm -rf /var/lib/mosquitto
rm -rf /var/log/mosquitto
rm -rf /run/mosquitto

# Install fresh
apt update
apt install -y mosquitto mosquitto-clients

mkdir -p /etc/mosquitto/conf.d

cat > /etc/mosquitto/conf.d/asvz.conf <<'EOF'
# TCP listener
listener 1883
allow_anonymous false
password_file /etc/mosquitto/passwd

# WebSocket listener
listener 9001
protocol websockets
EOF

mosquitto_passwd -c /etc/mosquitto/passwd "$MQTT_USER"
chown mosquitto:mosquitto /etc/mosquitto/passwd
chmod 640 /etc/mosquitto/passwd

systemctl restart mosquitto
systemctl enable mosquitto

echo "Done. Broker running on ports 1883 (TCP) and 9001 (WebSocket)."
