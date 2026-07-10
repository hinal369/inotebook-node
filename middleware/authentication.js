const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) res.status(401).send({ error: "Invalid token!" });

  const data = jwt.verify(token, process.env.JWT_SECRET);
  req.user = data.user;

  next();
};

module.exports = authentication;