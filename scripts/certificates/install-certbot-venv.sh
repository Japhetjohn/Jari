#!/usr/bin/env bash
set -e

echo "=== CREATING ISOLATED CERTBOT VENV IN /opt/certbot-venv ==="
python3 -m venv /opt/certbot-venv
/opt/certbot-venv/bin/pip install --upgrade pip
/opt/certbot-venv/bin/pip install "certbot>=5.4" certbot-nginx

echo "=== VERIFYING CERTBOT VERSION ==="
/opt/certbot-venv/bin/certbot --version

echo "=== CHECKING SHORTLIVED AND IP-ADDRESS FLAGS ==="
/opt/certbot-venv/bin/certbot certonly --help all | grep -E "preferred-profile|ip-address" || true

