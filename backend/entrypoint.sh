#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."
python -c '
import socket, time
s = socket.socket()
for i in range(30):
    try:
        s.connect(("db", 5432))
        break
    except Exception:
        time.sleep(1)
s.close()
'

echo "PostgreSQL is reachable. Ensuring alembic_version table supports long revision IDs..."
python -c '
import os, psycopg
db_url = os.environ.get("DATABASE_URL", "").replace("postgresql+psycopg://", "postgresql://")
if db_url:
    try:
        with psycopg.connect(db_url) as conn:
            with conn.cursor() as cur:
                cur.execute("CREATE TABLE IF NOT EXISTS alembic_version (version_num VARCHAR(128) NOT NULL PRIMARY KEY);")
                cur.execute("ALTER TABLE alembic_version ALTER COLUMN version_num TYPE VARCHAR(128);")
            conn.commit()
    except Exception as e:
        print("Notice:", e)
'

echo "Running Alembic migrations..."
alembic upgrade head

echo "Starting Uvicorn production server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2 --proxy-headers --forwarded-allow-ips="*"

