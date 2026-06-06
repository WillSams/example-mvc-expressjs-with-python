import { request } from 'graphql-request';

//queries
const getExistingReservations = `
  query { getAllReservations { reservations { id room_id checkin_date checkout_date  } } }
`;
const getRoomIds = `query { getAllRooms { rooms { id } } }`;

//mutations
const createReservation = `
  mutation createReservation($input: ReservationInput!) {
    createReservation(input: $input) {
      success
      errors
    }
  }
`;

const deleteReservation = `
  mutation deleteReservation($reservationId: Int!) {
    deleteReservation(reservationId: $reservationId) {
      success
      errors
    }
  }
`;

const getAuthorizationHeader = (token) => {
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const backendRequest = async (token, { query, variables }) => {
  const headers = getAuthorizationHeader(token);
  return request(process.env.RESERVATION_API, query, variables, { headers });
};

const cancelReservation = async (token = '', reservationId) => {
  const payload = { query: deleteReservation, variables: { reservationId } };
  const result = await backendRequest(token, payload);
  return result.deleteReservation;
};

const getListOfReservations = async (token = '') => {
  const payload = { query: getExistingReservations };
  const result = await backendRequest(token, payload);
  const reservations = result.getAllReservations.reservations ?? [];
  const sorted = reservations.sort((a, b) => a.checkin_date.localeCompare(b.checkin_date));
  return sorted;
};

const getListOfRoomIds = async (token = '') => {
  const payload = { query: getRoomIds };
  const result = await backendRequest(token, payload);
  return result.getAllRooms.rooms.map(room => room.id);
};

const makeReservation = async (token = '', reservation) => {
  const payload = { query: createReservation, variables: { input: reservation } };
  const result = await backendRequest(token, payload);
  return result.createReservation;
};

export {
  cancelReservation,
  getAuthorizationHeader,
  getListOfReservations,
  getListOfRoomIds,
  makeReservation,
};
