import { Pool } from 'pg';

import { config } from 'dotenv';

import pg from 'pg-promise'

const pgp = pg();

config();

export const _DB = pgp(`${process.env.PGURL}`);

export class Database {
    connect_query() {
        return new Pool({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: Number(process.env.PGPORT),
        })
    }
}