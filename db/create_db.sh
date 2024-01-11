#!/bin/bash

# Check if the database already exists
CHECK_DB="PGPASSWORD=$PG_PASSWD psql -h 0.0.0.0 -U $PG_USER -p $PG_PORT -lqt"

if $(eval "$CHECK_DB" | cut -d \| -f 1 | grep -qw "$PG_NAME"); then
  echo "Database $PG_NAME already exists. Skipping creation."
else
  echo "Creating database $POSTGRES_DB..."
  PGPASSWORD=$PG_PASSWD psql \
    -h 0.0.0.0 \
    -p "$PG_PORT" \
    -U "$PG_USER" \
    -c "CREATE DATABASE $PG_NAME;"
fi

