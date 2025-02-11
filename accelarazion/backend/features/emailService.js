const nodemailer = require("nodemailer");
require("dotenv").config()
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // Use 465 for SSL or 587 for TLS
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true, 
  debug: true,
  tls: {
    rejectUnauthorized: false, 
  },
});
// const transporter = nodemailer.createTransport({
//   service: "Gmail", // Replace with your email service (e.g., Outlook, Yahoo, etc.)
//   auth: {
//     user: process.env.EMAIL_USER, // Your email address
//     pass: process.env.EMAIL_PASS, // Your email password or app-specific password
//     },
//     logger: true, // Enable logging
//     debug: true, // Enable debugging
//     tls: {
//             rejectUnauthorized: false, // Ignore certificate errors
//           },
// });

transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter verification failed:", error);
  } else {
    console.log("Server is ready to take messages:", success);
  }
});

const sendEmail = async (to, subject, text, html) => {
  console.log("send email from emailService.senEmail", to, subject, text, html);
  
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
  // Send an email
  // const mailOptions = {
  //     from: process.env.EMAIL_USER, // Sender address
  //     to: 'arielle.benadi@gmail.com', // Receiver address
  //     subject: 'Test Email', // Subject line
  //     // text: 'This is a test email from Nodemailer!',
  //     html: 'This is a test email from Nodemailer!'
  // };

  //         transporter.sendMail(mailOptions, (error, info) => {
  //             if (error) {
  //                 return console.error('Error sending email:', error);
  //             }
  //             console.log('Email sent:', info.response);
  // });

}
module.exports = { sendEmail };


