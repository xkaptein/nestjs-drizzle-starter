#!/bin/bash
set -e

PGDATA=${PGDATA:-/var/lib/postgresql/data/pgdata}

# If data dir is already initialized, just start postgres
if [ -s "$PGDATA/PG_VERSION" ]; then
  echo "Replica data directory already initialized. Starting postgres..."
  exec docker-entrypoint.sh postgres
fi

echo "Waiting for primary to be ready..."
until PGPASSWORD="$REPLICATION_PASSWORD" pg_isready -h "$PRIMARY_HOST" -U "$REPLICATION_USER"; do
  sleep 2
done

echo "Taking base backup from primary..."
mkdir -p "$PGDATA"
chmod 700 "$PGDATA"

PGPASSWORD="$REPLICATION_PASSWORD" pg_basebackup \
  -h "$PRIMARY_HOST" \
  -U "$REPLICATION_USER" \
  -D "$PGDATA" \
  -Fp -Xs -P -R

# Ensure correct permissions
chmod 700 "$PGDATA"

echo "Replica initialized. Starting standby..."
exec docker-entrypoint.sh postgres
