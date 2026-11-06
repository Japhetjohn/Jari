#!/usr/bin/env bash
set -e

grep -rn "default_server" /etc/nginx/sites-enabled/ || true

