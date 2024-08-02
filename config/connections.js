require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({

    host: 'localhost',
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    
   
});

pool.connect(err => {
    if (err) throw err;
    console.log('Connected to the database.');
   
});

module.exports = pool