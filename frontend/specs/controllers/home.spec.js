import homeController from '../../src/controllers/home.js';
import { getListOfReservations, } from '../../src/graphql.js';
import cache from '../../src/cache.js';

jest.mock('../../src/graphql.js');

describe('Home Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('index', () => {
    it('should render index template with reservations from cache', async () => {
      const req = { url: '/home', session: { jwtToken: 'fake-token' } };
      const res = { render: jest.fn(), };

      const mockReservations = [{ id: 1, room_id: 101, checkin_date: '2024-01-10', checkout_date: '2024-01-15' }];

      jest.spyOn(cache, 'getOrSet').mockResolvedValueOnce(mockReservations);

      await homeController.index(req, res);

      expect(res.render).toHaveBeenCalledWith('index', {
        title: 'HOME - RESERVATIONS',
        reservations: mockReservations,
      });
    });

    it('should render index template with reservations from GraphQL if URL includes /home?success', async () => {
      const req = { url: '/home?success=somevalue', session: { jwtToken: 'fake-token' } };
      const res = { render: jest.fn() };

      const mockReservations = [
        { id: 1, room_id: 101, checkin_date: '2024-01-10', checkout_date: '2024-01-15' },
      ];
      getListOfReservations.mockResolvedValueOnce(mockReservations);

      await homeController.index(req, res);

      expect(res.render).toHaveBeenCalledWith('index', {
        title: 'HOME - RESERVATIONS',
        reservations: mockReservations,
      });
    });

    describe('about', () => {
      it('should render about template', async () => {
        const req = { url: '/about' };
        const res = { render: jest.fn(), };

        await homeController.about(req, res);

        expect(res.render).toHaveBeenCalledWith('about', {
          title: 'ABOUT',
          message: "This is a web application that allows you to view existing reservations and to create new ones.",
        });
      });
    });
  });
});
