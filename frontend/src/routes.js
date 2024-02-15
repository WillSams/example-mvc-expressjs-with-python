import home_controller from './controllers/home.js';
import reservation_controller from './controllers/reservation.js';
import { protectRoute } from './middleware/authentication.js';
import { authSession } from './middleware/session.js';
import limiter from './middleware/rateLimiter.js';

const routes = app => {
  [
    app.get(['/', '/home'], authSession, home_controller.index),
    app.get('/about', home_controller.about),
    app.get('/login', [authSession, protectRoute, limiter], home_controller.login),
    app.get('/logout', [authSession, protectRoute, limiter], home_controller.logout),

    app.get('/reservation/new', authSession, reservation_controller.newReservation),
    app.post('/reservation/create', authSession, reservation_controller.createReservation),
    app.delete('/reservation/:id/delete', authSession, reservation_controller.deleteReservation),
  ];
};

export default routes;
