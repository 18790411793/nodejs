import mysql from 'mysql2'
import config from '../config/index.js';
import ErrorLog from '../utils/fsError.js';

var connection = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
});

connection.connect((err) => {
    if (err) ErrorLog(err, 'database.connect');
    else console.log('Database connected successfully');
});

export default connection;
