const { Client } = require('pg')
const fs = require('fs')
const env = require("dotenv")
env.config()

const db = new Client({
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE, 
    password: process.env.DB_PASSWORD, 
    port: process.env.DB_PORT, 
    host: process.env.DB_HOST,
    connectionTimeoutMillis: 30000,
    ssl: {
      rejectUnauthorized: true,
      ca : fs.readFileSync('./utils/ca.pem').toString()
    }
  })

module.exports = {db}