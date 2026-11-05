#!/usr/bin/env bash
set -e

echo "=== CREATING SYSTEMD SERVICE AND TIMER FOR SHORTLIVED IP CERTIFICATE RENEWAL ==="

cat << 'EOF' > /etc/systemd/system/certbot-ip-renew.service
[Unit]
Description=Certbot IP Shortlived Certificate Renewal
After=network.target

[Service]
Type=oneshot
ExecStart=/opt/certbot-venv/bin/certbot renew --preferred-profile shortlived --deploy-hook "systemctl reload nginx"
EOF

cat << 'EOF' > /etc/systemd/system/certbot-ip-renew.timer
[Unit]
Description=Run Certbot IP Renewal every 12 hours

[Timer]
OnCalendar=*-*-* 00,12:00:00
RandomizedDelaySec=30m
Persistent=true

[Install]
WantedBy=timers.target
EOF

systemctl daemon-reload
systemctl enable --now certbot-ip-renew.timer
systemctl list-timers certbot-ip-renew.timer

echo "=== TESTING DRY RUN RENEWAL ==="
/opt/certbot-venv/bin/certbot renew --dry-run

