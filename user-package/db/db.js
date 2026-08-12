import mysql from 'mysql2'
import config from '../../config/index.js';
import ErrorLog from '../../utils/fsError.js';

var connection = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
});

connection.connect((err) => {
    if (err) ErrorLog(err, 'user.database.connect');
    else console.log('数据库连接成功！');
});

export default connection;
