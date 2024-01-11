import pytest
import json

from routes import create_app
from routes.graphql import GraphqlRoute


class DescribeGraphqlRoutes:
    @pytest.fixture(scope="module")
    def client(self):
        from fastapi.testclient import TestClient

        app = create_app(GraphqlRoute())
        with TestClient(app=app) as client:
            yield client

    def get_post_response(self, client, payload):
        response = client.post("/test/graphql", json=payload)

        assert response.status_code == 200
        return json.loads(response.content)

    def should_return_playground_page(self, client):
        response = client.get("/test/graphql")
        assert response.status_code == 200
        expected = b"(c) 2021 GraphQL Contributors\n *  All rights reserved."
        assert expected in response.content

    def should_return_data_for_get_all_reservations(self, client):
        query_string = "query { getAllReservations {reservations{room_id}}}"
        query = {"query": query_string}
        response = self.get_post_response(client, query)
        assert "data" in response
        assert "getAllReservations" in response["data"]
        assert "reservations" in response["data"]["getAllReservations"]

    def should_return_data_for_create_reservation(self, client):
        mutation = {
            "query": (
                "mutation { createReservation( input: { "
                'room_id: "91754a14-4885-4200-a052-e4042431ffb8", '
                'checkin_date: "2098-12-31", '
                'checkout_date: "2099-01-02", '
                " }) { "
                "success errors reservation { "
                "id room_id checkin_date checkout_date total_charge } } }"
            )
        }

        response = self.get_post_response(client, mutation)
        assert "data" in response
        assert "createReservation" in response["data"]
        assert "reservation" in response["data"]["createReservation"]

    def should_return_data_for_get_available_rooms(self, client):
        query = {
            "query": (
                "query { getAvailableRooms( input: { "
                'checkin_date: "2098-12-31", '
                'checkout_date: "2099-01-02" }) { '
                "success errors rooms { "
                "id num_beds allow_smoking daily_rate cleaning_fee } } }"
            )
        }
        response = self.get_post_response(client, query)
        assert "data" in response
        assert "getAvailableRooms" in response["data"]
        assert "rooms" in response["data"]["getAvailableRooms"]
