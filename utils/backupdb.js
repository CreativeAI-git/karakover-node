require("./env");

const mysql = require('mysql2');
const util = require('util');
var db_config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || '3306',
    database: process.env.DB_NAME || 'karakover-admin'
};

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config);

  connection.connect(function (err) {
    if (err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log("Connected to mysql Server!");
    }
  });

  connection.on('error', function (err) {
    console.log('Cannot be connect to Database due to', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

function makeDb() {
  return {
    query(sql, args) {
      console.log("db connected localhost");
      console.log(sql);
      return util.promisify(connection.query).call(connection, sql, args);
    },
    close() {
      console.log("db not connected to localhost");
      return util.promisify(connection.end).call(connection);
    }
  }
}

const db = makeDb();
module.exports = db;
