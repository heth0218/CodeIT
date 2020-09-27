const nodemailer = require('nodemailer');
const config = require('config');

const SendEmail = async (options) => {
  let transporter = nodemailer.createTransport({
    host: config.get('SMTP_HOST'),
    port: config.get('SMTP_PORT'),

    auth: {
      user: config.get('SMTP_EMAIL'),
      pass: config.get('SMTP_PASSWORD'),
    },
  });

  // send mail with defined transport object
  const message = {
    from: `${config.get('FROM_NAME')} <${config.get('FROM_EMAIL')}>`, // sender address
    to: options.email,
    subject: options.subject, // Subject line
    text: options.message,
  };

  let info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = SendEmail;
