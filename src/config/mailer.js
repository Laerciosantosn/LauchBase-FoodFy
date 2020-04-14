const nodemailer = require("nodemailer")

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "62117918b63e1a",
      pass: "8b4508cbbdc285"
    }
  });
