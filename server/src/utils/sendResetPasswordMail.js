const { createMailTransporter } = require("./createMailTransporter");

const sendResetPasswordMail = (user, token) => {
  const transporter = createMailTransporter();

  const mailOptions = {
    from: '"Plateguessr" <plateguessr@outlook.com>',
    to: user.email,
    subject: "Password Reset",
    html: `
    <p>Hello ${user.email}</p>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href='${process.env.CLIENT_URL}/set-password/${token}'>Reset my password</a>
    <p>If you didn’t request a password reset, you can ignore this email.</p>
    <p>Best,</p>
    <p>Plateguessr Team</p>`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Reset password email sent");
    }
  });
};

module.exports = { sendResetPasswordMail };
