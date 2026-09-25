#!/bin/bash
set -e

# --- Validate required env vars ---
: "${POSTGRES_USER:?POSTGRES_USER is required}"
: "${POSTGRES_DB:?POSTGRES_DB is required}"
: "${REPLICATION_USER:?REPLICATION_USER is required}"
: "${REPLICATION_PASSWORD:?REPLICATION_PASSWORD is required}"

# --- Create replication user (env-substituted, safely quoted) ---
psql -v ON_ERROR_STOP=1 \
     --username "$POSTGRES_USER" \
     --dbname "$POSTGRES_DB" \
     -v repl_user="$REPLICATION_USER" \
     -v repl_pass="$REPLICATION_PASSWORD" <<-'EOSQL'
    CREATE ROLE :"repl_user" WITH REPLICATION LOGIN PASSWORD :'repl_pass';
EOSQL

# --- Allow replication connections from the docker network ---
echo "host replication ${REPLICATION_USER} all md5" >> "$PGDATA/pg_hba.conf"

# --- Enable streaming replication settings ---
cat >> "$PGDATA/postgresql.conf" <<-'EOF'
wal_level = replica
max_wal_senders = 10
max_replication_slots = 10
hot_standby = on
EOF

# --- Reload config ---
psql -v ON_ERROR_STOP=1 \
     --username "$POSTGRES_USER" \
     --dbname "$POSTGRES_DB" \
     -c "SELECT pg_reload_conf();"

echo "Primary initialized with replication user '${REPLICATION_USER}'."
