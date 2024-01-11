from fastapi import FastAPI
from fastapi import APIRouter


def create_app(*routes):
    app = FastAPI()
    routers = APIRouter()
    for route in routes:
        routers.include_router(route.router)

    app.include_router(routers)
    return app
