const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail", // Replace with your email service (e.g., Outlook, Yahoo, etc.)
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
    logger: true, // Enable logging
    debug: true, // Enable debugging
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter verification failed:", error);
  } else {
    console.log("Server is ready to take messages:", success);
  }
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to, // List of receivers (can be a single email or an array)
      subject, // Subject line
      text, // Plain text body
      html, // HTML body
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return info.response;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};

module.exports = { sendEmail };
