#!/usr/bin/env bash
set -e

echo "=== CHECK SNAP STATUS ==="
snap version || true

echo "=== CHECK SNAP REPOSITORY FOR CERTBOT ==="
snap info certbot || true

echo "=== CHECK PIP FOR CERTBOT ==="
python3 -m pip --version 2>/dev/null || true

