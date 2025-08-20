// session.js
const session = require("express-session");

const sessionMiddleware = session({
  secret: "abc",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 },
});

module.exports = sessionMiddleware;
