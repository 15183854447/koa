var mysql = require('mysql');

var pool = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'specimen',
});

let allServices = {
    query: function (sql, params) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if (err) {
                    console.log('连接数据库失败');
                    reject(err)
                } else {
                    console.log('数据库连接成功');
                    connection.query(sql, params, (err, results) => {
                        if (err) {
                            console.log('数据操作失败');
                            reject(err)
                        } else {
                            resolve(results)
                        }
                        connection.release()
                    })
                }
            })
        })
    }
};
module.exports = allServices;