require("../utils/env");

const jwt = require("jsonwebtoken");
const { fetchUserById } = require("../models/users");
const jwtSecret = process.env.JWT_SECRET;
// const key = require("../config/key");
const auth = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (bearerHeader) {
      const bearer = bearerHeader.split(" ");

      if (bearer[0] !== "Bearer" || !bearer[1]) {
        return res.json({
          message: "Token Not Provided",
          status: 400,
          success: false,
        });
      }

      req.token = bearer[1];
      const verifyUser = jwt.verify(req.token, jwtSecret)
      const [user] = await fetchUserById(verifyUser.data.id);

      if (user !== null) {
        req.user = user
        next();
      } else {
        return res.json({
          message: "Access Forbidden",
          status: 401,
          success: false,
        });
      }
    } else {
      return res.json({
        message: "Token Not Provided",
        status: 400,
        success: false,
      });
    }
  } catch (err) {
    return res.json({
      message: "Access forbidden",
      status: 401,
      success: false,
    });
  }
};

module.exports = auth;
