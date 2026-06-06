from os import getenv

API_NAME = "Acme Hotel Reservation - Graphql API"
API_PORT = getenv("RESERVATION_PORT") or 80
ENV = getenv("ENV", "development")
DB_URL = getenv("PG_URL")
ALLOWED_ORIGINS = getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

IS_DEBUG = bool(int(getenv("IS_DEBUG", "0"))) or False

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day

_test_mode = ENV == "test"
SECRET_KEY = getenv("SECRET_KEY") or ("test-secret-key" if _test_mode else None)
REFRESH_SECRET_KEY = getenv("REFRESH_SECRET_KEY") or (
    "test-refresh-secret-key" if _test_mode else None
)

_missing = [
    name
    for name, val in [
        ("SECRET_KEY", SECRET_KEY),
        ("REFRESH_SECRET_KEY", REFRESH_SECRET_KEY),
    ]
    if not val
]
if _missing and not _test_mode:
    raise RuntimeError(f"Missing required environment variables: {', '.join(_missing)}")
