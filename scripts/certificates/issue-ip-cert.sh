#!/usr/bin/env bash
set -e

echo "=== ISSUING PRODUCTION SHORTLIVED IP CERTIFICATE FOR 72.61.97.210 ==="
/opt/certbot-venv/bin/certbot certonly \
  --preferred-profile shortlived \
  --ip-address 72.61.97.210 \
  --webroot \
  --webroot-path /var/www/html \
  --non-interactive \
  --agree-tos \
  --email "admin@bitnovaafrica.cloud" \
  --deploy-hook "systemctl reload nginx"

echo "=== CERTIFICATE ISSUED! CHECKING FILES ==="
ls -la /etc/letsencrypt/live/72.61.97.210/

echo "=== CHECKING CERTIFICATE DETAILS ==="
openssl x509 -in /etc/letsencrypt/live/72.61.97.210/cert.pem -noout -text | grep -E "Issuer:|Subject:|Not Before|Not After|IP Address"

