import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILER_MAIL_ID,
    pass: process.env.MAILER_MAIL_PASSWORD,
  },
  tls: {
    ciphers: 'SSLv3',
  },
});

export const sendMail = async (
  mailTo: string,
  subject: string,
  htmlText: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: process.env.MAILER_MAIL_ID,
      to: mailTo,
      subject,
      html: htmlText,
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        console.log(`Email sent: ${info.response}`);
        resolve();
      }
    });
  });
};
