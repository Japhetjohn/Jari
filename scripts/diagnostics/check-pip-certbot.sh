#!/usr/bin/env bash
set -e

echo "=== CHECK PYPI CERTBOT VERSIONS ==="
python3 -m pip install --dry-run certbot 2>/dev/null || true

echo "=== CHECK APT CERTBOT ==="
apt-cache policy certbot

