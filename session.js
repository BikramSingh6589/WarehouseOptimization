const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

const sessionMiddleware = session({
  store: new PgSession({
    pool: pool,                
    tableName: "session"       
  }),
  secret: "abc",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 }
});

module.exports = sessionMiddleware;