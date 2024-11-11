const nodemailer = require('nodemailer');

// Set up the transporter with your email service
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  auth: {
    user: 'your_email@example.com',
    pass: 'your_password',
  },
});

module.exports = transporter;
