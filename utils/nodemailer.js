const nodemailer = require("nodemailer");

const sendEmail = async (receiver, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: "noreplycali00@gmail.com",
      to: receiver,
      subject: subject,
      text: text,
    });

    console.log("EMAIL SUCCESSFULLY SENT!");
  } catch (error) {
    console.log(error, "FAILED SENDING EMAIL...");
  }
};

module.exports = sendEmail;
