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

  const transporter = await nodemailer.createTransport({
    host: '',
    port: 465,
    secure: true,
    auth: {
      user: '',
      pass: '',
    },
  });

  const mailOptions = {
    from: '"',
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

    return { doc: { message: 'Successfully sent the OTP' } };
  } catch (error) {
    return { err: error.message };
  }
};

module.exports = { send };
