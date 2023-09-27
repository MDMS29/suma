import { Pool } from 'pg';

export const client = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: '123123',
    port: 5432,
});