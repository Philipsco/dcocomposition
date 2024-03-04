const env = require("dotenv")
env.config()

const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE, 
    password: process.env.DB_PASSWORD, 
    port: process.env.DB_PORT, 
    host: process.env.DB_HOST, 
    connectionTimeoutMillis: 200
  });

module.exports = {pool}