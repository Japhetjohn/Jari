# JARI VPS Deployment, Backup & Rollback Runbook

## 1. Architecture Overview
- **VPS Host**: `72.61.97.210` (Ubuntu 24.04.3 LTS)
- **Deployment Location**: `/opt/jari`
- **Reverse Proxy**: System Nginx (`/etc/nginx/sites-available/jari.conf`) -> `http://127.0.0.1:8000`
- **Docker Compose Stack**: `jari`
  - Container `jari_backend_api`: FastAPI application (Uvicorn 2 workers) on internal port `8000`
  - Container `jari_postgres_db`: PostgreSQL 16 Alpine (no public port exposure)
  - Network `jari_internal_net`: Isolated bridge network
  - Volume `jari_pgdata`: Persistent PostgreSQL data
  - Volume `jari_uploads`: Persistent documents storage

---

## 2. Reusable Deployment Procedure
To redeploy backend updates after making code changes:
```bash
./deploy.sh
```
This automated script:
1. Backs up the running PostgreSQL database to `/opt/jari/backups/`.
2. Packages and transfers updated backend code (`alembic`, `app`, `requirements.txt`, `Dockerfile`).
3. Validates the Docker Compose configuration.
4. Builds the updated backend container image.
5. Re-runs any pending Alembic migrations safely during container entrypoint.
6. Restarts only `jari_backend_api`, preserving `jari_postgres_db` and persistent volumes.
7. Waits for the health check on `http://127.0.0.1:8000/health`.

---

## 3. Database Backup Procedure

### Automated Backup (from deployment script)
Backups are saved automatically into `/opt/jari/backups/jari_backup_<TIMESTAMP>.sql` before each deployment.

### Manual On-Demand Backup
Run via SSH:
```bash
ssh root@72.61.97.210 "mkdir -p /opt/jari/backups && docker exec -i jari_postgres_db pg_dump -U jari_user -d jari_db > /opt/jari/backups/manual_backup_\$(date +%Y%m%d_%H%M%S).sql"
```

### Document Storage Backup
```bash
ssh root@72.61.97.210 "tar -czf /opt/jari/backups/uploads_backup_\$(date +%Y%m%d_%H%M%S).tar.gz -C /var/lib/docker/volumes/jari_uploads/_data ."
```

---

## 4. Database Restore Procedure
To restore a database backup:
```bash
ssh root@72.61.97.210
cd /opt/jari

# Identify the backup file
ls -la backups/

# Drop existing schema and restore
docker exec -i jari_postgres_db psql -U jari_user -d jari_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
docker exec -i jari_postgres_db psql -U jari_user -d jari_db < backups/jari_backup_YYYYMMDD_HHMMSS.sql

# Restart backend API
docker compose --env-file .env.production -f docker-compose.prod.yml restart api
```

---

## 5. Rollback to Previous Backend Version
If a newly deployed backend image has an issue:
```bash
ssh root@72.61.97.210
cd /opt/jari

# Roll back code to previous commit using git or extract previous archive
# Re-run compose build and recreate API:
docker compose --env-file .env.production -f docker-compose.prod.yml build api
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --no-deps api
```

---

## 6. SSL Certificate Activation (Post-DNS Propagation)
Once the DNS A record `api.bitnova.africa` -> `72.61.97.210` is active:
```bash
ssh root@72.61.97.210 "/opt/jari/setup-ssl.sh"
```
Or directly:
```bash
ssh root@72.61.97.210 "certbot --nginx -d api.bitnova.africa --non-interactive --agree-tos -m admin@bitnova.africa --redirect"
```

