import asyncpg
from asyncpg.pool import Pool

from api.utils import log_api_message
from settings import DB_URL, ENV

_pool: Pool = None


class DummyPool:
    async def close(self):
        pass

    async def execute(self, *args, **kwargs):
        pass

    async def fetch(self, *args, **kwargs):
        pass

    async def fetchval(self, *args, **kwargs):
        pass


class DbConnection:
    """Wraps a single connection acquired from the pool; releases it on close()."""

    def __init__(self, pool: Pool, conn):
        self._pool = pool
        self._conn = conn

    async def close(self):
        await self._pool.release(self._conn)

    async def execute(self, *args, **kwargs):
        return await self._conn.execute(*args, **kwargs)

    async def fetch(self, *args, **kwargs):
        return await self._conn.fetch(*args, **kwargs)

    async def fetchval(self, *args, **kwargs):
        return await self._conn.fetchval(*args, **kwargs)


async def init_pool() -> None:
    global _pool
    try:
        _pool = await asyncpg.create_pool(DB_URL)
        log_api_message(__name__, "Database connection pool created")
    except Exception as e:
        log_api_message(__name__, f"Error creating database connection pool: {e}")
        raise


async def close_pool() -> None:
    global _pool
    if _pool:
        await _pool.close()
        log_api_message(__name__, "Database connection pool closed")


async def DbSession():
    if ENV == "test":
        return DummyPool()

    conn = await _pool.acquire()
    return DbConnection(_pool, conn)
