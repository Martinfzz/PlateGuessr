const { createMailTransporter } = require("./createMailTransporter");

const sendVerificationMail = (user) => {
  const transporter = createMailTransporter();

  const mailOptions = {
    from: '"Plateguessr" <plateguessr@outlook.com>',
    to: user.email,
    subject: "Verify your account",
    html: `
    <p>Hello ${user.email}</p>
    <p>Thank you for signing up! Please verify your email by clicking the link below:</p>
    <a href='${process.env.CLIENT_URL}?emailToken=${user.emailToken}'>Verify my email</a>
    <p>If you didn’t sign up, you can ignore this email.</p>
    <p>Best,</p>
    <p>Plateguessr Team</p>`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Verification email sent");
    }
  });
};

module.exports = { sendVerificationMail };
