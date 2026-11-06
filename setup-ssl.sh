#!/usr/bin/env bash
set -e

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/jari-api.key \
  -out /etc/ssl/certs/jari-api.crt \
  -subj "/CN=api.bitnova.africa"

cat << 'EOF' > /etc/nginx/sites-available/jari.conf
server {
    listen 80;
    listen [::]:80;
    server_name api.bitnova.africa;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        client_max_body_size 10M;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name api.bitnova.africa;

    ssl_certificate /etc/ssl/certs/jari-api.crt;
    ssl_certificate_key /etc/ssl/private/jari-api.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        client_max_body_size 10M;
    }
}
EOF

nginx -t
systemctl reload nginx
echo "SSL configured and Nginx reloaded successfully!"

