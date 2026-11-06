#!/usr/bin/env bash
set -e

curl -s https://pypi.org/pypi/certbot/json | python3 -c "import sys, json; data=json.load(sys.stdin); print('Latest PyPI Certbot version:', data['info']['version'])"

