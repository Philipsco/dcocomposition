const { Pool } = require('pg');
const pool = new Pool({
    // username postgres
    user: 'postgres',
    // nama database yang akan kita akses 
    database: 'dcbca_db', 
    // password postgres
    password: 'Mahanaim999', 
    // port postgres
    port: 9090, 
    // host dari postgres
    host: 'localhost', 
    // connectionTimeoutMillis merupakan optional, 
    // ini adalah batas waktu untuk memutuskan koneksi 
    // jika tidak ada aktifitas terhadap database
    connectionTimeoutMillis: 200 // setelah tidak ada aktifitas selama 200 milisecond maka koneksi akan terputus
  });

module.exports = {pool}