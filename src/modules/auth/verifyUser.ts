import * as nodemailer from 'nodemailer';

export const sendVerificationEmail = async (
  userEmail: string,
  verificationToken: string,
) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: userEmail,
      subject: 'Please verify your email',
      text: `Please click on the following link to verify your email: http://localhost:3000/verify/${verificationToken}`,
    });
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.log(err);
  }
};
