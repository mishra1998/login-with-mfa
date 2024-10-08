/* eslint-disable no-console */
const nodemailer = require('nodemailer');

const getText = (payload) => {
  const {
    email, otp, validity,
  } = payload;

  const templateText = `
  Your OTP is below:
  Email: ${email}
  OTP: ${otp}
  Validity: ${validity} minutes
  Regards,
  `;

  return templateText;
};

const send = async (payload) => {
  const { email, otp, validity } = payload;

  const testAccount = await nodemailer.createTestAccount();

  const transporter = await nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const mailOptions = {
    from: '"Test Sender" <test@example.com>',
    to: email,
    subject: 'OTP verification',
    text: getText({
      email, otp, validity,
    }),
  };

  try {
    const mailResponse = await transporter.sendMail(mailOptions);
    const { messageId } = mailResponse;

    console.log('Message sent: %s', messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(mailResponse));

    return { doc: { message: 'Successfully sent the OTP' } };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }

  // const transporter = await nodemailer.createTransport({
  //   host: 'your_smtp_host',
  //   port: 465,
  //   secure: true,
  //   auth: {
  //     user: 'your_email@example.com',
  //     pass: 'your_password',
  //   },
  // });

  // const mailOptions = {
  //   from: '"Your Name" <your_email@example.com>',
  //   to: email,
  //   subject: 'OTP verification',
  //   text: getText({
  //     email, otp, validity,
  //   }),
  // };

  // try {
  //   const mailResponse = await transporter.sendMail(mailOptions);
  //   const { messageId } = mailResponse;

  //   console.log('Message sent: %s', messageId);

  //   return { doc: { message: 'Successfully sent the OTP' } };
  // } catch (error) {
  //   console.error('Error sending email:', error);
  //   throw error;
  // }
};

module.exports = { send };
