import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: 'password',
   database: 'tp_dw',
});

export default db;
