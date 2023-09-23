import { Pool } from 'pg';

export const client = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: 'qwerty',
    port: 5432,
});