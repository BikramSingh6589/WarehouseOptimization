const db = require('../db.js');
const bcrypt = require('bcryptjs');
const ejs = require("ejs");
const path = require("path");
const transporter = require("../mailer.js");
const express = require('express');
const app = express();\


app.set("views", path.join(__dirname, "../views"));




const get = (req, res) => {
  const sameEmail = req.session.sameEmail || false;
  req.session.sameEmail = null;
  res.render("signup", { sameEmail });
};

const post = async (req, res) => {
  const { name, email, password, companyName } = req.body;
  console.log(email, password, companyName);

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (user) {
      req.session.sameEmail = true;
      return res.redirect("/");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    req.session.tempUser = {
      username: name,
      useremail: email,
      pass: hashedPassword,
      companyName: companyName,
      otp: otp,
    };

    // Render email template
    ejs.renderFile(
      path.join(__dirname, "../views/emailTemplate.ejs"),
      { name, otp },
      async (err, html) => {
        if (err) {
          console.log("Ejs render error:", err);
          return;
        }

        // Send email
        await transporter.sendMail({
          from: `"Shelf_Master" <bishtbiko@gmail.com>`,
          to: email,
          subject: "Your OTP Code",
          text: `Your OTP code is ${otp}`,
          html,
        });
      }
    );

    res.redirect("/verify-otp");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { get, post };
