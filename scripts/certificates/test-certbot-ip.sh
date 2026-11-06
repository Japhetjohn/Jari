#!/usr/bin/env bash
set -e

mkdir -p /var/www/html/.well-known/acme-challenge
chmod -R 755 /var/www/html

echo "=== TESTING DRY RUN FOR IP CERTIFICATE ==="
/opt/certbot-venv/bin/certbot certonly \
  --preferred-profile shortlived \
  --ip-address 72.61.97.210 \
  --webroot \
  --webroot-path /var/www/html \
  --non-interactive \
  --agree-tos \
  --email "admin@bitnovaafrica.cloud" \
  --dry-run

