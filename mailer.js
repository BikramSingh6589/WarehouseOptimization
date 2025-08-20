
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: "bishtbiko@gmail.com",
    pass: "aips gyqe rpgu uydv",
  },
});

module.exports = transporter;