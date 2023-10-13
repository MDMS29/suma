import { Pool } from 'pg';

const pgp = require('pg-promise')();


// const DATABASE_URL = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${Number(process.env.PORT)}/${process.env.PGDATABASE_URL}`;

export const _DB = pgp(`postgres://postgres:123123@localhost:5432/data_suma`);
export const client = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: Number(process.env.PGPORT),
});