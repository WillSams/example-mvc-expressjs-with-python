$env:ENV = development
$env:NODE_ENV = ${env:ENV}
$env:IS_DEBUG = 1
$env:FRONTEND_SECRET = jwt-s3cr3t
$env:SECRET_KEY = s3cr3t-k3y
$env:REFRESH_SECRET_KEY = s3cr3t-k3y
$env:COOKIE_EXPIRATION = 86400

$env:FRONTEND_PORT = 3000

$env:RESERVATION_PORT = 8080
$env:RESERVATION_API = http://localhost:${env:RESERVATION_PORT}/${env:ENV}/graphql

$env:CACHE_KEY_PREFIX = cache-acme-hotel-example
$env:SESSION_KEY_PREFIX = session-api-user-acme-hotel-example

$env:CACHE_HOST = localhost
$env:CACHE_PORT = 3001
$env:CACHE_SERVER = ${env:CACHE_HOST}:${env:CACHE_PORT}
$env:CACHE_PASSWD = memcache
$env:CACHE_EXPIRATION = 10
$env:MEMCACHED_SERVER = ${env:CACHE_URL}
$env:MEMCACHIER_SERVERS = localhost:3001
$env:PG_CLIENT = postgresql+psycopg2
$env:PG_USER = postgres
$env:PG_PASSWD = postgres
$env:PG_HOST = localhost
$env:PG_NAME = hotel_$ENV
$env:PG_PORT = 8081
$env:PG_URL = ${env:PG_CLIENT}://${env:PG_USER}:${env:PG_PASSWD}@${env:PG_HOST}:${env:PG_PORT}/${env:PG_NAME}

