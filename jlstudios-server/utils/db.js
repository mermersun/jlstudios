const mysql = require("mysql");
const pool = mysql.createPool({
  connectionLimit: 20,
  host: "localhost",
  user: "root",
  database: "jlstudios",
});

// 为pool新增一个方法,同步执行sql方法
pool.querySync = (sql, params) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};
module.exports = pool;
