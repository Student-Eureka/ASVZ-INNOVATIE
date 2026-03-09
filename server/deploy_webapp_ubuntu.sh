#!/usr/bin/env bash
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run as root: sudo bash deploy_webapp_ubuntu.sh"
  exit 1
fi

echo "ASVZ Webapp deploy (Ubuntu + PM2)"

read -rp "Git repo URL: " REPO_URL
read -rp "Target directory (default: /opt/asvz): " TARGET_DIR
TARGET_DIR=${TARGET_DIR:-/opt/asvz}

read -rp "App name for PM2 (default: asvz-webapp): " APP_NAME
APP_NAME=${APP_NAME:-asvz-webapp}

# Base system deps
apt update
apt install -y git curl build-essential

# Node LTS
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
  apt install -y nodejs
fi

# PM2
if ! command -v pm2 >/dev/null 2>&1; then
  npm install -g pm2
fi

# Clone repo
mkdir -p "$TARGET_DIR"
chown -R "$SUDO_USER:$SUDO_USER" "$TARGET_DIR"

if [ -d "$TARGET_DIR/.git" ]; then
  echo "Repo already exists. Pulling latest..."
  sudo -u "$SUDO_USER" git -C "$TARGET_DIR" pull
else
  sudo -u "$SUDO_USER" git clone "$REPO_URL" "$TARGET_DIR"
fi

WEBAPP_DIR="$TARGET_DIR/webapplicatie"

if [ ! -d "$WEBAPP_DIR" ]; then
  echo "ERROR: webapplicatie/ not found in repo."
  exit 1
fi

# Install + build
sudo -u "$SUDO_USER" bash -lc "cd '$WEBAPP_DIR' && npm install"
sudo -u "$SUDO_USER" bash -lc "cd '$WEBAPP_DIR' && npm run build"

# Start with PM2
sudo -u "$SUDO_USER" bash -lc "cd '$WEBAPP_DIR' && pm2 start npm --name '$APP_NAME' -- start"

# Save PM2 process list
sudo -u "$SUDO_USER" bash -lc "pm2 save"

echo "Deploy done."
echo "Let op: vul nu de .env in:"
echo "  nano $WEBAPP_DIR/.env"
echo "of:"
echo "  cat > $WEBAPP_DIR/.env"
