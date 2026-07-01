require("./utils/env");

const express = require("express");
const cors = require("cors");
const user = require("./routes/users");
const home = require("./routes/home");
const stripe = require("./routes/stripe");
var path = require("path");
const appex = express();
const http = require("http");
const https = require("https");
const fs = require("fs");
const port = process.env.PORT || 3000;
const songsPath = process.env.SONGS_PATH || path.join(__dirname, "public/assets/songs");
const serverSongsPath = process.env.SERVER_SONGS_PATH;
const shouldLogStaticPaths = process.env.LOG_STATIC_PATHS === "true";

appex.use(cors());

appex.use(
  cors({
    origin: "*", // Allow all origins (update this to specific origins if needed)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Custom-Header"],
  })
);

global.__basedir = __dirname;
// global.S3_URL = "https://karakover.com/assets/songs/";
global.S3_URL = process.env.S3_URL || "https://api.karakover.com/assets/songs/";
// global.S3_URL = "http://karakover.com/assets/songs/";

if (shouldLogStaticPaths) {
  console.info(`[server] Serving local songs from: ${songsPath}`);
}

appex.use(
  "/assets/songs",
  express.static(songsPath, {
    setHeaders: (res) => {
      res.set("Access-Control-Allow-Origin", "*");
    },
  })
);

if (serverSongsPath) {
  if (shouldLogStaticPaths) {
    console.info(`[server] Serving server songs from: ${serverSongsPath}`);
  }

  appex.use(
    "/assets/songs",
    express.static(serverSongsPath, {
      setHeaders: (res) => {
        res.set("Access-Control-Allow-Origin", "*");
      },
    })
  );
}


appex.use("/", stripe);
appex.use(express.json());
appex.use(
  express.urlencoded({
    extended: true,
  })
);
appex.use(express.static("public"));
appex.use("/", user);
appex.use("/", home);

appex.get("/", (req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*",
    "https://api.karakover.com",
    { reconnect: true }
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Accept, X-Custom-Header,Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  } else {
    return res.send({ success: false, message: "Hello World" });
  }
});

// http
//   .createServer(

//     // {
//     //   ca: fs.readFileSync("/var/www/html/ssl/ca_bundle.crt"),
//     //   key: fs.readFileSync("/var/www/html/ssl/private.key"),
//     //   cert: fs.readFileSync("/var/www/html/ssl/certificate.crt"),
//     // },
//     appex
//   )
//   .listen(3500, () => {
//     console.log("serever is runing at port 3500");
//   });



appex.listen(port, function () {
  console.info(`[server] API listening: http://localhost:${port}`);
});
module.exports = appex;
