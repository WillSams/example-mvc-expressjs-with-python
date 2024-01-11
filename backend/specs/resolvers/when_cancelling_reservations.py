import pytest

from api.resolvers.mutations import delete_reservation_resolver
from api.models import Reservation

from . import mock_db_session, patch_db_to_resolvers


class DescribeDeleteReservationResolver:
    @pytest.mark.usefixtures("patch_db_to_resolvers")
    def should_delete_reservation(self, mock_db_session):
        mock_db_session.query.return_value.all.return_value = [
            Reservation(
                id=1,
                room_id="room_1",
                checkin_date="2023-01-01",
                checkout_date="2023-01-03",
            )
        ]
        mock_execution_context = {"context_key": "context_value"}

        result = delete_reservation_resolver(
            None, mock_execution_context, reservationId=1
        )

        assert result["success"] is True
        assert result["reservation"] is not None
