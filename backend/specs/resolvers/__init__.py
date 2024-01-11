import pytest

from sqlalchemy.orm import Session

from api.models import Reservation, Room


@pytest.fixture
def mock_db_session(mocker):
    return mocker.MagicMock(spec=Session)


@pytest.fixture
def patch_db_to_resolvers(mocker, mock_db_session):
    mocker.patch("api.resolvers.queries.DbSession", return_value=mock_db_session)
    mocker.patch("api.resolvers.mutations.DbSession", return_value=mock_db_session)
    yield mocker


@pytest.fixture
def mock_is_room_available(mocker):
    return mocker.patch("api.resolvers.queries.is_room_available")


@pytest.fixture
def mock_room(mocker):
    return mocker.MagicMock(spec=Room)
