require("../utils/env");

// const baseURL = "https://karakover.com";
const baseURL = process.env.WEB_URL || "https://karakover.com";
// const base_URL = "https://api.karakover.com";

module.exports = baseURL;
