
import connection from '../db/db.js';

class userServiceImpl {
    addUser(userInfo) {
        return new Promise((resolve, reject) => {
            const { name, age, sex, phone } = userInfo;
            const sql = 'INSERT INTO `user` (`name`, `age`, `sex`, `phone`) VALUES (?, ?, ?, ?)';
            connection.query({ sql, values: [name, age, sex, phone], timeout: 5000 }, (err, result) => {
                if (err) return reject(err);
                resolve(result.affectedRows > 0);
            });
        });
    }
    getUserAll() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM `user`';
            connection.query({ sql, timeout: 5000 }, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
}


export const userService = new userServiceImpl();
