const defaults = {
  client: "postgres",
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations'
  },
  pool: { min: 2, max: 10 },
  debug: false,
};

const connection = {
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWD || 'postgres',
};

export const development = {
  ...defaults,
  connection: {
    ...connection,
    database: 'hotel_development',
  },
  seeds: { directory: './seeds/development', },
};

export const test = {
  ...defaults,
  connection: {
    ...connection,
    database: 'hotel_test',
  },
};

export default { development, test };
