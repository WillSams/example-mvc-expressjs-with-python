from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker, declarative_base

from settings import DB_URL

# Create the engine and metada
engine = create_engine(DB_URL)
metadata = MetaData()

DbSession = sessionmaker(bind=engine)
Base = declarative_base(metadata=metadata)
metadata.create_all(engine)
