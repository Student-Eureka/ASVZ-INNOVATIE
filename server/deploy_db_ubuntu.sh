#!/usr/bin/env bash
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run as root: sudo bash deploy_db_ubuntu.sh"
  exit 1
fi

echo "ASVZ MySQL setup (Ubuntu)"

read -rp "Repo target dir (default: /opt/asvz): " TARGET_DIR
TARGET_DIR=${TARGET_DIR:-/opt/asvz}

read -rp "Database name (default: asvz_db): " DB_NAME
DB_NAME=${DB_NAME:-asvz_db}

SQL_FILE="$TARGET_DIR/webapplicatie/db/asvz_db.sql"

if [ ! -f "$SQL_FILE" ]; then
  echo "ERROR: SQL file not found: $SQL_FILE"
  echo "Check your repo path or copy the SQL file there."
  exit 1
fi

apt update
apt install -y mysql-server

systemctl enable mysql
systemctl start mysql

echo "Creating database: $DB_NAME"
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME};"

echo "Importing schema/data from: $SQL_FILE"
mysql -u root -p "$DB_NAME" < "$SQL_FILE"

echo "Done."
echo "Tip: update your webapp .env with DB_HOST/DB_USER/DB_PASS/DB_NAME."
