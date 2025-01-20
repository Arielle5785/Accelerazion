const jwt = require("jsonwebtoken");
require("dotenv").config();

const { JWT_SECRET } = process.env;

const verifyToken = (req, res, next) => {
  const token = req.cookies["token"]; //
  if (!token) {
    res.status(401).json({ message: "unauthorized" });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decode) => {
    if (err) {
      res.status(403).json({ message: "forbidden", error: err.message });
      return;
    }

    /** layer - check token in db / user */
    console.log(decode);

    /** global type of request */
    req.user = decode;

    // console.log(req);

    next();
  });
};

module.exports = {
  verifyToken,
};
