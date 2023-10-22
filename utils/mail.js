const RestPasswordTokens = require("../models/model.resetPasswordToken");
nodemailer = require("nodemailer");
jwt = require("jsonwebtoken");
const frontUrl = "http://localhost:3000";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTls: true,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
sendConfirmationEmail = (user) => {
  const name = user.name || user.fullName;
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "email activation",
    html: ` <h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
       
        <a href=${frontUrl}/auth/confirm/${user._id || user.id}> Click here</a>
        </div>`,
  });
};
sendAffirmationEmail = (user) => {
  console.log(user);
  const name = user.fullName;
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "account confirmation",
    html: ` <h1>Congratulations your account has ben confirmed</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=${frontUrl}/auth/login> Click here</a>
        </div>`,
  });
};
sendRestEmail = async (email, ref, owner) => {
  console.log(ref);
  console.log(owner);
  const resetToken = new RestPasswordTokens({ owner, ref });
  console.log(resetToken._id || resetToken.id);
  await resetToken.save();
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "rest password",
    html: ` <h1>Email Confirmation</h1>
        <h2>Hello </h2>
        <p>you can rest your password  by clicking on the following link</p>
        <a href=${frontUrl}/auth/newPassword/${
      resetToken._id || resetToken.id
    }> Click here</a>
        </div>`,
  });
};

sendBlockEmail = (email, blockReason) => {
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "account blocked",
    html: ` <h1>your account has been blocked</h1>
        <h2>Hello </h2>
        <p>your account has been blocked for the following reason</p>
        <p>${blockReason}</p>
        </div>`,
  });
};
sendMeetingEmail = (company, user, offer) => {
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "accept your application",
    html: `congratulation your application has been accepted by ${company.fullName} for ${offer.name} and ${offer.mode} and ${offer.category}`,
  });
};
module.exports = {
  sendConfirmationEmail,
  sendRestEmail,
  sendAffirmationEmail,
  sendBlockEmail,
  sendMeetingEmail,
};
