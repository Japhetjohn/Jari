#!/usr/bin/env bash
set -e

# ==============================================================================
# JARI Backend Deployment & Update Automation Script
# Targets only the isolated JARI Docker Compose stack on the VPS.
# Never disrupts other VPS services or deletes database volumes.
# ==============================================================================

VPS_IP="${VPS_IP:-72.61.97.210}"
VPS_USER="${VPS_USER:-root}"
DEPLOY_DIR="/opt/jari"

echo "=================================================================="
echo " Starting JARI Backend Production Deployment to ${VPS_USER}@${VPS_IP}"
echo "=================================================================="

# 1. Package backend source files
echo "==> Step 1: Packaging local backend files..."
TEMP_ARCHIVE=$(mktemp /tmp/jari-backend-XXXXXX.tar.gz)
tar -czf "$TEMP_ARCHIVE" -C backend alembic app alembic.ini requirements.txt Dockerfile entrypoint.sh docker-compose.prod.yml

# 2. Transfer files to VPS
echo "==> Step 2: Uploading backend files to ${DEPLOY_DIR} on VPS..."
/usr/bin/scp -o StrictHostKeyChecking=no "$TEMP_ARCHIVE" "${VPS_USER}@${VPS_IP}:${DEPLOY_DIR}/backend.tar.gz"
rm -f "$TEMP_ARCHIVE"

# 3. Deploy and execute update on VPS
echo "==> Step 3: Extracting files, validating compose, and building image..."
/usr/bin/ssh -o StrictHostKeyChecking=no "${VPS_USER}@${VPS_IP}" "bash -s" << 'EOF'
set -e
cd /opt/jari

# Backup current database before applying updates
mkdir -p backups
BACKUP_FILE="backups/jari_backup_$(date +%Y%m%d_%H%M%S).sql"
if docker ps -q -f name=jari_postgres_db | grep -q .; then
    echo "Creating safety database backup at $BACKUP_FILE..."
    docker exec -i jari_postgres_db pg_dump -U jari_user -d jari_db > "$BACKUP_FILE" 2>/dev/null || true
fi

# Extract updated files
tar -xzf backend.tar.gz
rm -f backend.tar.gz
chmod +x entrypoint.sh

# Validate Docker Compose configuration
echo "Validating Docker Compose configuration..."
docker compose --env-file .env.production -f docker-compose.prod.yml config > /dev/null

# Build updated backend image
echo "Building updated JARI backend image..."
docker compose --env-file .env.production -f docker-compose.prod.yml build api

# Recreate API container only, leaving PostgreSQL and volumes untouched
echo "Recreating JARI API service..."
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --no-deps api

# Wait for backend health check
echo "Waiting for backend health check..."
for i in {1..30}; do
    if curl -s -f http://127.0.0.1:8000/health | grep -q "ok"; then
        echo "Backend is healthy!"
        break
    fi
    echo "Waiting for API startup... ($i/30)"
    sleep 2
done

# Verify Nginx reverse proxy
echo "Verifying Nginx reverse proxy routing..."
curl -s -i -H "Host: api.bitnova.africa" http://127.0.0.1/health | grep -E "HTTP|status"

echo "Checking if SSL certificate can be renewed/obtained..."
if [ -f setup-ssl.sh ]; then
    ./setup-ssl.sh || true
fi
EOF

echo ""
echo "=================================================================="
echo " JARI Backend Production Deployment Completed Successfully!"
echo " Public Health Check: curl -i -H 'Host: api.bitnova.africa' http://${VPS_IP}/health"
echo "=================================================================="

