const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  user: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "login",
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

module.exports = transporter;
