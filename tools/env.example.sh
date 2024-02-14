export ENV=development
export NODE_ENV=${ENV}
export IS_DEBUG=1
export FRONTEND_SECRET=jwt-s3cr3t
export SECRET_KEY=s3cr3t-k3y
export REFRESH_SECRET_KEY=s3cr3t-k3y
export COOKIE_EXPIRATION=86400

export FRONTEND_PORT=3000

export RESERVATION_PORT=8080
export RESERVATION_API=http://localhost:${RESERVATION_PORT}/${ENV}/graphql

export CACHE_KEY_PREFIX=cache-acme-hotel-example
export SESSION_KEY_PREFIX=session-api-user-acme-hotel-example

export CACHE_HOST=localhost
export CACHE_PORT=3001
export CACHE_SERVER=${CACHE_HOST}:${CACHE_PORT}
export CACHE_PASSWD=memcache
export CACHE_EXPIRATION=10
export MEMCACHED_SERVER=${CACHE_URL}
export MEMCACHIER_SERVERS=localhost:3001
export PG_CLIENT=postgresql+psycopg2
export PG_USER=postgres
export PG_PASSWD=postgres
export PG_HOST=localhost
export PG_NAME=hotel_$ENV
export PG_PORT=8081
export PG_URL=${PG_CLIENT}://${PG_USER}:${PG_PASSWD}@${PG_HOST}:${PG_PORT}/${PG_NAME}

