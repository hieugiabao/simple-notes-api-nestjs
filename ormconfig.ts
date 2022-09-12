/* eslint-disable @typescript-eslint/no-var-requires */
const typeorm = require('typeorm');
require('dotenv').config();

console.log(process.env.DATABASE_URL);

const AppDataSource = new typeorm.DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  ssl:
    process.env.NODE_ENV !== 'local' && process.env.NODE_ENV !== 'test'
      ? { rejectUnauthorized: false }
      : false,
  logging: true,
  entities: ['dist/src/app/domain/entities/**/*.js'],
  migrations: ['dist/src/migrations/**/*.js'],
  subscribers: ['dist/src/subscriber/**/*.js'],
  migrationsTransactionMode: 'each',
});

module.exports = { AppDataSource };
