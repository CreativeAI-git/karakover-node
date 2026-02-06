const mysql = require("mysql2");
const util = require("util");

const db_config = {
  host: "localhost",
  user: "root",
  password: "BE&8mA@95Onp",
  port: "3306",
  database: "karakover-admin",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// ? CREATE POOL (instead of createConnection)
const pool = mysql.createPool(db_config);

// optional logs
pool.on("connection", () => {
  console.log("MySQL Pool Connected");
});

pool.on("error", (err) => {
  console.error("MySQL Pool Error:", err);
});

// ? SAME INTERFACE AS BEFORE
function makeDb() {
  return {
    query(sql, args) {
      console.log("db connected localhost");
      console.log(sql);
      return util.promisify(pool.query).call(pool, sql, args);
    },
    close() {
      console.log("db pool closed");
      return util.promisify(pool.end).call(pool);
    },
  };
}

const db = makeDb();
module.exports = db;
