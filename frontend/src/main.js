import express from 'express';
import logger from 'morgan';
import methodOverride from 'method-override';
import nodeSassMiddleware from 'node-sass-middleware';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

import rateLimiter from './middleware/rateLimiter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Note: you must place sass-middleware *before* 'express.static'.
app.use(nodeSassMiddleware({
  src: `${__dirname}/public/css/sass`,
  dest: `${__dirname}/public/css`,
  outputStyle: 'compressed',
  prefix: '/css',
  debug: true,
}));

app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);

app.use(logger(process.env.ENV));
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.use(rateLimiter);

import session from 'express-session';
import MemcachedStoreFactory from 'connect-memjs';

const MemcachedStore = MemcachedStoreFactory(session);
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MemcachedStore({
      servers: [process.env.CACHE_SERVER],
      prefix: process.env.SESSION_PREFIX,
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    },
  })
);

import moment from 'moment';
app.locals.moment = moment;

import routes from './routes.js';
routes(app);

const main = app.listen(process.env.FRONTEND_PORT, () => {
  const host = main.address().address;
  const port = main.address().port;

  console.log('Hotel Reservation Web UI - listening at http://%s:%s', host, port);
});

export default main;
