require("./env");

const mysql = require("mysql2");
const util = require("util");

const requiredEnvKeys = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_PORT", "DB_NAME"];
const missingEnvKeys = requiredEnvKeys.filter((key) => process.env[key] === undefined);

if (missingEnvKeys.length > 0) {
  throw new Error(
    `Missing required DB env values in .env: ${missingEnvKeys.join(", ")}`
  );
}

const db_config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

const shouldLogQueries = process.env.DB_LOG_QUERIES === "true";
const shouldLogPoolConnections = process.env.DB_LOG_POOL === "true";
const shouldLogConfig = process.env.DB_LOG_CONFIG === "true";
const connectionLabel = `${db_config.user}@${db_config.host}:${db_config.port}/${db_config.database}`;

function maskPassword(password) {
  if (!password) {
    return "(empty)";
  }

  return `${"*".repeat(Math.min(password.length, 8))} (${password.length} chars)`;
}

function logDbConfig() {
  if (!shouldLogConfig) {
    return;
  }

  console.info("[database] MySQL configuration loaded");
  console.table({
    host: db_config.host,
    port: db_config.port,
    user: db_config.user,
    database: db_config.database,
    password: maskPassword(db_config.password),
    connectionLimit: db_config.connectionLimit,
    queryLogging: shouldLogQueries ? "enabled" : "disabled",
    poolLogging: shouldLogPoolConnections ? "enabled" : "disabled",
  });
}

const pool = mysql.createPool(db_config);

logDbConfig();

pool.getConnection((err, connection) => {
  if (err) {
    console.error("[database] MySQL connection failed", {
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState,
      sqlMessage: err.sqlMessage,
      connection: connectionLabel,
    });
    return;
  }

  console.info(`[database] MySQL connected: ${connectionLabel}`);
  connection.release();
});

pool.on("connection", () => {
  if (shouldLogPoolConnections) {
    console.info(`[database] Pool connection opened: ${connectionLabel}`);
  }
});

pool.on("error", (err) => {
  console.error("[database] MySQL pool error", {
    code: err.code,
    message: err.message,
  });
});

function makeDb() {
  return {
    query(sql, args) {
      if (shouldLogQueries) {
        console.debug(`[database] Query on ${connectionLabel}`);
        console.debug("[database] SQL:", sql);
      }

      return util.promisify(pool.query).call(pool, sql, args);
    },
    close() {
      console.info("[database] MySQL pool closed");
      return util.promisify(pool.end).call(pool);
    },
  };
}

const db = makeDb();
module.exports = db;
