"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports._DB = void 0;
const pg_1 = require("pg");
const pgp = require('pg-promise')();
exports._DB = pgp(`postgres://postgres:123123@localhost:5432/data_suma`);
exports.client = new pg_1.Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: '123123',
    port: 5432,
});
