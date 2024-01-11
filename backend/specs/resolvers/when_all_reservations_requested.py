import pytest

from api.resolvers.queries import get_all_reservations_resolver
from api.models import Reservation

from . import mock_db_session, patch_db_to_resolvers


class DescribeAllReservationsResolver:
    @pytest.mark.usefixtures("patch_db_to_resolvers")
    def should_return_all_reservations_resolver(
        self,
        mock_db_session,
    ):
        mock_reservations = [
            Reservation(
                id=1,
                room_id="room_1",
                checkin_date="2023-01-01",
                checkout_date="2023-01-03",
            ),
            Reservation(
                id=2,
                room_id="room_2",
                checkin_date="2023-01-05",
                checkout_date="2023-01-07",
            ),
        ]

        mock_db_session.query.return_value.all.return_value = mock_reservations
        mock_execution_context = {"context_key": "context_value"}

        result = get_all_reservations_resolver(None, mock_execution_context)

        assert "reservations" in result
        assert result["reservations"] == [
            {
                "id": 1,
                "room_id": "room_1",
                "checkin_date": "2023-01-01",
                "checkout_date": "2023-01-03",
                "total_charge": None,
            },
            {
                "id": 2,
                "room_id": "room_2",
                "checkin_date": "2023-01-05",
                "checkout_date": "2023-01-07",
                "total_charge": None,
            },
        ]

        mock_db_session.query.assert_called_once_with(Reservation)
