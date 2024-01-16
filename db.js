const Pool = require('pg').Pool
require('dotenv').config({path: "./vars/.env"})

const pool = new Pool({
    user: 'lucky',
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.DBPORT,
    database: 'enroll'
})

module.exports = pool