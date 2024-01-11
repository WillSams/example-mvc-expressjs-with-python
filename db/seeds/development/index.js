import { readFile } from 'fs/promises';

const jsonReader = async (filepath, callback) => {
  try {
    const data = await readFile(filepath);
    const obj = JSON.parse(data);
    callback(null, obj);
    return obj;
  } catch (error) {
    return Promise.reject(error);
  }
};

const seedData = async (knex, tableName, data) => {
  await knex(tableName).del();
  return await knex(tableName).insert(data);
};

const injectTables = async (knex, tableName) => {
  try {
    const data = await jsonReader(`./seeds/development/${tableName}.json`, (error, data) => {
      if (error) throw error;
      else return data;
    });
    await seedData(knex, tableName, data);
  } catch (ex) {
    console.log(`Json file read failed: ${ex.message}`);
  }
};

export const seed = async (knex) => {
  await injectTables(knex, 'rooms');
  await injectTables(knex, 'reservations');
};
