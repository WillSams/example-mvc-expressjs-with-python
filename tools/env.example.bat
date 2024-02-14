@echo off

set ENV=development
set NODE_ENV=%ENV%
set IS_DEBUG=1
set FRONTEND_SECRET=jwt-s3cr3t
set SECRET_KEY=s3cr3t-k3y
set REFRESH_SECRET_KEY=s3cr3t-k3y
set COOKIE_EXPIRATION=86400

set FRONTEND_PORT=3000

set RESERVATION_PORT=8080
set RESERVATION_API=http://localhost:%RESERVATION_PORT%/%ENV%/graphql

set CACHE_KEY_PREFIX=cache-acme-hotel-example
set SESSION_KEY_PREFIX=session-api-user-acme-hotel-example

set CACHE_HOST=localhost
set CACHE_PORT=3001
set CACHE_SERVER=%CACHE_HOST%:%CACHE_PORT%
set CACHE_PASSWD=memcache
set CACHE_EXPIRATION=10
set MEMCACHED_SERVER=%CACHE_URL%
set MEMCACHIER_SERVERS=localhost:3001
set PG_CLIENT=postgresql
set PG_USER=postgres
set PG_PASSWD=postgres
set PG_HOST=localhost
set PG_NAME=hotel_%ENV%
set PG_PORT=8081
set PG_URL=%PG_CLIENT%://%PG_USER%:%PG_PASSWD%@%PG_HOST%:%PG_PORT%/%PG_NAME%

