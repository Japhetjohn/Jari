#!/usr/bin/env bash
set -e

echo "=== CHECKING DOMAIN VARIANTS ==="
for dom in bitnova.com bitnova.africa bitnovaafrica.cloud bitnova.com.ng bitnova.ng; do
  echo "--- $dom ---"
  dig +short $dom @8.8.8.8 || true
  dig +short NS $dom @8.8.8.8 || true
done

