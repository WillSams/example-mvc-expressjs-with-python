import cache from '../cache.js';
import { getListOfReservations } from '../graphql.js';

const about = async (_req, res) => {
  const message =
    'This is a web application that allows you to view existing reservations and to create new ones.';
  res.render('about', { title: 'ABOUT', message });
};

const index = async (req, res) => {
  let reservations = [];

  const jwtToken = req.session.jwtToken;
  if (req.url.includes('/home?success')) {
    reservations = await getListOfReservations(jwtToken);
  } else {
    reservations = await cache.getOrSet(
      req.url,
      jwtToken,
      getListOfReservations
    );
  }
  res.render('index', { title: 'HOME - RESERVATIONS', reservations });
};

const login = async (req, res) => {
  //un-implemented but leaving here for future use
  res.render('login', { title: 'LOGIN' });
};

const logout = async (req, res) => {
  //un-implemented but leaving here for future use
  // todo: we'll pop a modal after clearing cookies, then we'll redirect
  res.redirect('/login');
};

export default { index, about, login, logout };
