"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports._DB = void 0;
const pg_1 = require("pg");
const dotenv_1 = require("dotenv");
const pgp = require('pg-promise')();
(0, dotenv_1.config)();
const DATABASE_URL = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;
exports._DB = pgp(DATABASE_URL);
exports.pool = new pg_1.Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: Number(process.env.PGPORT),
});
