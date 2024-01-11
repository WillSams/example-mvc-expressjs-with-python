from datetime import timezone
from typing import Any, Dict

from pydantic import BaseModel

from sqlalchemy import (
    Column,
    Boolean,
    Integer,
    String,
    ForeignKey,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from api import Base
import api.utils as utils

unique_reservation_cols = ("room_id", "checkin_date", "checkout_date")


class ApiData(BaseModel):
    data: Dict[str, Any]
    status: utils.StatusCode


class Room(Base):
    __tablename__ = "rooms"

    id = Column(String, primary_key=True, unique=True)
    num_beds = Column(Integer)
    allow_smoking = Column(Boolean)
    daily_rate = Column(Integer)
    cleaning_fee = Column(Integer)

    def to_dict(self):
        return {
            "id": self.id,
            "num_beds": self.num_beds,
            "allow_smoking": self.allow_smoking,
            "daily_rate": self.daily_rate,
            "cleaning_fee": self.cleaning_fee,
        }


class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True)
    room_id = Column(String, ForeignKey("rooms.id"))
    checkin_date = Column(String)
    checkout_date = Column(String)
    total_charge = Column(Integer)

    room = relationship("Room")

    UniqueConstraint(*unique_reservation_cols, "unique_reservation_dates")

    def to_dict(self):
        return {
            "id": self.id,
            "room_id": self.room_id,
            "checkin_date": self.checkin_date,
            "checkout_date": self.checkout_date,
            "total_charge": self.total_charge,
        }
