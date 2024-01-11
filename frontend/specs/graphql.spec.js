import { gql, request } from 'graphql-request';
import * as graphql from '../src/graphql'; // adjust the path based on your project structure

jest.mock('graphql-request'); // mock the entire graphql-request module

describe('GraphQL Client', () => {
  const sampleReservation = {
    id: 1,
    room_id: 'A101',
    checkin_date: '2024-01-10',
    checkout_date: '2024-01-15',
    total_charge: 500,
  };

  const sampleReservations = [sampleReservation];

  const sampleRooms = [
    { id: 'A101' },
    { id: 'B202' },
    // ... other room objects
  ];

  const mockQueriesAndMutations = {
    getExistingReservations: jest.fn(),
    getRoomIds: jest.fn(),
    createReservation: jest.fn(),
    deleteReservation: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('should cancel a reservation', async () => {
    request.mockResolvedValueOnce({ deleteReservation: { success: true, errors: null } });

    const result = await graphql.cancelReservation(1);

    expect(result).toEqual({ success: true, errors: null });
  });

  it('should get a list of reservations', async () => {
    request.mockResolvedValueOnce({
      getAllReservations: { reservations: sampleReservations },
    });

    const result = await graphql.getListOfReservations();

    expect(result).toEqual(sampleReservations);
  });

  it('should get a list of room IDs', async () => {
    request.mockResolvedValueOnce({ getAllRooms: { rooms: sampleRooms } });

    const result = await graphql.getListOfRoomIds();

    expect(result).toEqual(sampleRooms.map((room) => room.id));
  });

  it('should make a reservation', async () => {
    const inputReservation = { "checkin_date": "2024-01-10", "checkout_date": "2024-01-15", "room_id": "A101" };
    request.mockResolvedValueOnce({
      createReservation: {
        success: true,
        errors: null,
        reservation: sampleReservation,
      }
    });

    const result = await graphql.makeReservation(inputReservation);

    expect(result).toEqual({ success: true, errors: null, reservation: sampleReservation });
  });
});

