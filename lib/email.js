const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationEmail(email) {
  const verificationCode = generateVerificationCode();

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"گالری  موسیقی شهریار" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "کد تایید ایمیل",
    text: `کد تایید شما: ${verificationCode}`,
    html: `<p>کد تایید شما: <strong>${verificationCode}</strong></p>`,
  });

  return verificationCode;
}

module.exports = { sendVerificationEmail };
