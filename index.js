const express = require("express");
const cors = require("cors");
const user = require("./routes/users");
const home = require("./routes/home");
var path = require("path");
const appex = express();
const http = require("http");
const https = require("https");
const fs = require("fs");
appex.use(cors());

appex.use(cors({
  origin: '*', // Allow all origins (update this to specific origins if needed)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header']
}));

global.__basedir = __dirname;
// global.S3_URL = "https://159.223.251.167/assets/songs/";
global.S3_URL = "https://159.223.251.167:3000/assets/songs/";
// global.S3_URL = "http://159.223.251.167/assets/songs/";

console.log(path.join(__dirname, 'public/assets/songs'), "path");

appex.use('/assets/songs', express.static(path.join(__dirname, 'public/assets/songs'), {
  setHeaders: (res, path) => {
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

appex.use('/assets/songs', express.static('/var/www/html/assets/songs', {
  setHeaders: (res, path) => {
    res.set('Access-Control-Allow-Origin', '*');
  }
}));



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
    "https://159.223.251.167:3000",
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
    return res.send({ success: "0", message: "Hello World" });
  }
});

http
  .createServer(

    // {
    //   ca: fs.readFileSync("/var/www/html/ssl/ca_bundle.crt"),
    //   key: fs.readFileSync("/var/www/html/ssl/private.key"),
    //   cert: fs.readFileSync("/var/www/html/ssl/certificate.crt"),
    // },
    appex
  )
  .listen(3500, () => {
    console.log("serever is runing at port 3500");
  });



// appex.listen(3000, function () {
//   console.log("Node appex is running on port 3000");
// });
module.exports = appex;
