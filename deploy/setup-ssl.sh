#!/usr/bin/env bash
set -e

DOMAIN="api.bitnova.africa"
VPS_IP="72.61.97.210"

echo "Checking DNS resolution for $DOMAIN..."
RESOLVED_IP=$(getent hosts "$DOMAIN" | awk '{ print $1 }' | head -n 1 || true)

if [ "$RESOLVED_IP" != "$VPS_IP" ]; then
    echo "DNS for $DOMAIN does not yet resolve to $VPS_IP (Found: '$RESOLVED_IP')."
    echo "Please ensure the DNS A record for host 'api' is pointing to $VPS_IP."
    echo "Once DNS propagates, re-run this script to automatically obtain Let's Encrypt SSL."
    exit 1
fi

echo "DNS confirmed! Requesting Let's Encrypt SSL certificate for $DOMAIN..."
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email "admin@bitnova.africa" --redirect

echo "Testing Nginx configuration..."
nginx -t
systemctl reload nginx

echo "Testing HTTPS endpoint..."
curl -i "https://${DOMAIN}/health"
echo "SSL configured successfully for https://${DOMAIN}!"

