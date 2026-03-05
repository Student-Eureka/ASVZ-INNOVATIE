#!/usr/bin/env bash
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run as root: sudo bash setup_mqtt_ubuntu.sh"
  exit 1
fi

read -rp "MQTT username: " MQTT_USER
read -rsp "MQTT password: " MQTT_PASS
echo

apt update
apt install -y mosquitto mosquitto-clients

mkdir -p /etc/mosquitto/conf.d

cat > /etc/mosquitto/conf.d/asvz.conf <<'EOF'
listener 1883
allow_anonymous false
password_file /etc/mosquitto/passwd
persistence true
persistence_location /var/lib/mosquitto/
log_dest file /var/log/mosquitto/mosquitto.log
EOF

mosquitto_passwd -c /etc/mosquitto/passwd "$MQTT_USER"

systemctl restart mosquitto
systemctl enable mosquitto

echo "Done. Broker running on port 1883."
