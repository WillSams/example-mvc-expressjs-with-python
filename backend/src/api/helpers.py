from datetime import datetime
from typing import Any, Dict

from sqlalchemy import and_, or_

from api import DbSession
from api.models import Reservation, Room

import api.utils as utils
import api.resolvers.constants as const


def is_room_available(
    room_id: str, checkin_date: datetime, checkout_date: datetime
) -> Dict[str, Any]:
    try:
        if checkin_date < utils.convert_to_local_date(datetime.now()):
            message: str = const.INVALID_DATE_CHECK_IN
            utils.log_api_error(__name__, message)
            return {"success": False, "errors": [message]}

        db = DbSession()
        count = (
            db.query(Reservation)
            .filter(
                and_(
                    Reservation.room_id == room_id,
                    or_(
                        and_(
                            Reservation.checkin_date >= checkin_date,
                            Reservation.checkin_date < checkout_date,
                        ),
                        and_(
                            Reservation.checkout_date > checkin_date,
                            Reservation.checkout_date <= checkout_date,
                        ),
                        and_(
                            Reservation.checkin_date <= checkin_date,
                            Reservation.checkout_date >= checkout_date,
                        ),
                    ),
                )
            )
            .count()
        )

        if count == 0:
            return {"success": True, "errors": []}
        else:
            return {"success": False, "errors": [const.INVALID_DATE_OVERLAP]}

    except Exception as error:
        utils.log_api_error(__name__, str(error))
        return {"success": False, "errors": [str(error)]}


def get_entities(db, entity_type) -> Dict[str, Any]:
    try:
        entities = db.query(entity_type).all()
        entities = [entity.to_dict() for entity in entities]
        payload = {"success": True, f"{entity_type.__name__.lower()}s": entities}
    except Exception as error:
        messages = str(error)
        utils.log_api_error(__name__, messages)
        payload = {"success": False, "errors": messages}
    return payload


def check_date_validity(checkin_date: datetime, checkout_date: datetime) -> None:
    if checkout_date <= checkin_date:
        raise ValueError(const.INVALID_DATE_RANGE)


def get_room(room_id: str) -> Room:
    db = DbSession()
    room = db.get(Room, room_id)
    if room is None:
        raise ValueError(f"Room with id {room_id} not found")
    return room


def calculate_total_charge(
    daily_rate: int, checkin_date: datetime, checkout_date: datetime
) -> int:
    calculated_days = (checkout_date - checkin_date).days
    return daily_rate * calculated_days
