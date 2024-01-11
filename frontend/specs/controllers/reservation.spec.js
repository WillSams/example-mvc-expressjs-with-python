import cache from '../../src/cache.js';
import {
  CREATE_RESERVATION_FAILURE,
  CREATE_RESERVATION_SUCCESS,
  DELETE_RESERVATION_FAILURE,
  DELETE_RESERVATION_SUCCESS,
  GENERAL_ERROR,
} from '../../src/constants.js';
import utils from '../../src/utils.js';

import reservationController from '../../src/controllers/reservation.js';
import { cancelReservation, getListOfRoomIds, makeReservation } from '../../src/graphql.js';

jest.mock('../../src/graphql.js', () => ({
  cancelReservation: jest.fn().mockResolvedValueOnce({ success: true }),
  getListOfRoomIds: jest.fn(),
  makeReservation: jest.fn(),
}));

describe('Reservation Controller', () => {
  const session = { jwtToken: 'fake-token' };
  let invalidateSpy;

  beforeEach(() => {
    invalidateSpy = jest.spyOn(cache, 'invalidate');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createReservation', () => {
    const input = {
      room_id: 1,
      start_date: '2024-01-10',
      end_date: '2024-01-15'
    };
    const req = { body: input, session };
    const res = { redirect: jest.fn(), status: jest.fn(() => res), send: jest.fn() };

    it('should redirect to /home?success=true when creation is successful', async () => {
      makeReservation.mockResolvedValueOnce({ success: true });

      await reservationController.createReservation(req, res);

      expect(invalidateSpy).toHaveBeenCalledWith('/home');

      const successMsg = `/home?success=true&message=${CREATE_RESERVATION_SUCCESS}`;
      expect(res.redirect).toHaveBeenCalledWith(successMsg);
    });

    it('should redirect to /home?success=false when creation fails', async () => {
      const errors = ['Test Error 1', 'Test Error 2'];

      makeReservation.mockResolvedValueOnce({ success: false, errors });

      await reservationController.createReservation(req, res);


      const errorMsgs = utils.mergeMessages('Errors', errors)
      const failureMsg = `/home?success=false&message=${CREATE_RESERVATION_FAILURE}  ${errorMsgs}`;
      expect(res.redirect).toHaveBeenCalledWith(failureMsg);
    });

    it('should redirect with a general failure message if backend request fails', async () => {
      makeReservation.mockRejectedValue();

      await reservationController.createReservation(req, res);

      const errorMsg = `/home?success=false&message=${GENERAL_ERROR}`;
      expect(res.redirect).toHaveBeenCalledWith(errorMsg);
    });
  });

  describe('deleteReservation', () => {
    const req = { params: { id: 1 }, session };
    const res = { redirect: jest.fn() };

    it('should redirect to /home?success=true when cancellation is successful', async () => {
      cancelReservation.mockResolvedValue({ success: false });

      await reservationController.deleteReservation(req, res);

      expect(invalidateSpy).toHaveBeenCalledWith('/home');

      const successMsg = `/home?success=true&message=${DELETE_RESERVATION_SUCCESS}`;
      expect(res.redirect).toHaveBeenCalledWith(successMsg);
    });


    it('should redirect to /home?success=false when cancellation fails', async () => {
      const errors = ['Test Error 1', 'Test Error 2'];
      cancelReservation.mockResolvedValueOnce({ success: false, errors });

      await reservationController.deleteReservation(req, res);

      expect(invalidateSpy).not.toHaveBeenCalled();

      const errorMsgs = utils.mergeMessages('Errors', errors)
      const failureMsg = `/home?success=false&message=${DELETE_RESERVATION_FAILURE}  ${errorMsgs}`;
      expect(res.redirect).toHaveBeenCalledWith(failureMsg);
    });
  });

  describe('newReservation', () => {
    it('should render the new reservation template with roomIds', async () => {
      const req = { session };
      const res = { render: jest.fn(), };

      const mockRoomIds = [1, 2, 3];
      getListOfRoomIds.mockResolvedValueOnce(mockRoomIds);

      await reservationController.newReservation(req, res);

      expect(res.render).toHaveBeenCalledWith('reservation/new', {
        title: 'NEW - MAKE RESERVATION',
        roomIds: mockRoomIds,
      });
    });
  });
});
