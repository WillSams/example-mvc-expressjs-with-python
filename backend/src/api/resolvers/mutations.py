from typing import Any, Dict, cast

from api import DbSession
from api.helpers import (
    calculate_total_charge,
    check_date_validity,
    get_room,
    is_room_available,
)
from api.models import Reservation

import api.utils as utils


def create_reservation_resolver(obj, info, input: dict) -> Dict[str, Any]:
    try:
        room_id = cast(str, input.get("room_id"))
        checkin_date = utils.convert_to_local_date_from_str(
            str(input.get("checkin_date"))
        )
        checkout_date = utils.convert_to_local_date_from_str(
            str(input.get("checkout_date"))
        )

        check_date_validity(checkin_date, checkout_date)

        room = get_room(room_id)

        available = is_room_available(
            room_id=room_id, checkin_date=checkin_date, checkout_date=checkout_date
        )

        if not available["success"]:
            for message in available["errors"]:
                utils.log_api_error(__name__, message)
            return {"success": False, "errors": available["errors"]}

        daily_rate = cast(int, room.daily_rate)
        total_charge = calculate_total_charge(daily_rate, checkin_date, checkout_date)

        reservation = Reservation(
            room_id=room_id,
            checkin_date=checkin_date,
            checkout_date=checkout_date,
            total_charge=total_charge,
        )

        db = DbSession()
        db.add(reservation)
        db.commit()

        return {"success": True, "reservation": reservation.to_dict()}

    except ValueError as error:
        utils.log_api_error(__name__, str(error))
        return {"success": False, "errors": [str(error)]}


def delete_reservation_resolver(obj, info, reservationId: int) -> Dict[str, Any]:
    reservation_id = reservationId
    try:
        db = DbSession()
        reservation = (
            db.query(Reservation).filter(Reservation.id == reservation_id).first()
        )
        if reservation:
            db.delete(reservation)
            db.commit()

            data = reservation.to_dict()
            return {"success": True, "errors": [], "reservation": data}
        else:
            errors = ["Room not found"]
            return {"success": False, "errors": errors, "room": None}
    except Exception as error:
        utils.log_api_error(__name__, str(error))
        return {"success": False, "errors": [str(error)], "room": None}
