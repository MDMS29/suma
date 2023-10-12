import { Pool } from 'pg';

const pgp = require('pg-promise')();

export const _DB = pgp(`postgres://postgres:123123@localhost:5432/data_suma`);
export const client = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: '123123',
    port: 5432,
});