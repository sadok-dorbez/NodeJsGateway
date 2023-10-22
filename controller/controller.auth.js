const { sendConfirmationEmail, sendRestEmail } = require("../utils/mail");
const Users = require("../models/model.user");
const Companies = require("../models/model.company");
const activationToken = require("../models/model.activationToken");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();
const { AUTH_ROLES } = require("../middleware/auth");
const ResetPasswordTokens = require("../models/model.resetPasswordToken");
const bcrypt = require("bcryptjs");
const { getUserById } = require("./controller.user");

const signUpExpert = async (req, res) => {
  try {
    const expertise = [];
    expertise.push(req.file?.filename);
    const document = await Users.findOne({ email: req.body.email })
      .select({ email: 1 })
      .lean()
      .exec();
    const other = await Companies.findOne({ email: req.body.email })
      .select({ email: 1 })
      .lean()
      .exec();
    if (document) {
      return res
        .status(400)
        .json({ error: { path: "email", msg: "email already registered" } });
    }
    if (other) {
      return res
        .status(400)
        .json({ error: { path: "email", msg: "email already registered" } });
    }
    const newDocument = new Users({ ...req.body, expertise });
    const newCode = new activationToken({
      owner: newDocument._id,
      ref: Users.collection.name,
    });
    await Promise.all([newDocument.save(), newCode.save()]);
    sendConfirmationEmail(newDocument);
    return res.status(200).json(newDocument);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
const signUpUser = async (req, res) => {
  try {
    const cin = [];
    cin.push(req.file?.filename);
    const document = await Users.findOne({ email: req.body.email })
      .select({ email: 1 })
      .lean()
      .exec();
    const other = await Companies.findOne({ email: req.body.email })
      .select({ email: 1 })
      .lean()
      .exec();
    if (document) {
      return res
        .status(400)
        .json({ error: { path: "email", msg: "email already registered" } });
    }
    if (other) {
      return res
        .status(400)
        .json({ error: { path: "email", msg: "email already registered" } });
    }
    const newDocument = new Users({ ...req.body, cin });
    const newCode = new activationToken({
      owner: newDocument._id,
      ref: Users.collection.name,
    });
    await Promise.all([newDocument.save(), newCode.save()]);
    sendConfirmationEmail(newDocument);
    return res.status(200).json(newDocument);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
const signUpCompany = async (req, res) => {
  try {
    const registerCommerce = req.file?.filename;
    const document = await Companies.findOne({ email: req.body.email })
      .select({ email: 1 })
      .lean()
      .exec();
    const other = await Users.findOne({ email: req.body.email })
      .select({ email: 1 })
      .lean()
      .exec();
    if (document) {
      return res
        .status(400)
        .json({ error: { path: "email", msg: "email already registered" } });
    }
    if (other) {
      return res
        .status(400)
        .json({ error: { path: "email", msg: "email already registered" } });
    }
    const newDocument = new Companies({ ...req.body, registerCommerce });
    const newCode = new activationToken({
      owner: newDocument._id,
      ref: Users.collection.name,
    });
    await Promise.all([newDocument.save(), newCode.save()]);
    sendConfirmationEmail(newDocument);
    return res.status(200).json(newDocument);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

//

// const signInWithGoogle = async (req, res, next) => {
//   const { idToken } = req.body;
//   try {
//     if (!idToken)
//       throw new res.status(500).json({
//         message: "Missing Google login infos!",
//       });
//     let response = await client.verifyIdToken({
//       idToken,
//     });
//     const { email_verified, email } = response.payload;
//     if (!email_verified)
//       res.status(400).json({
//         message: "Google account not verified!",
//       });
//     let user = await Users.findOne({ email })
//       .select({
//         email: 1,
//         password: 1,
//         isActive: 1,
//         isBlocked: 1,
//       })
//       .populate("friends")
//       .lean();
//     if (user) {
//       const token = jwt.sign(
//         { _id: user._id, role: AUTH_ROLES.USER },
//         process.env.JWT_SECRET,
//         {
//           expiresIn: "15d",
//         }
//       );
//       return res.status(200).json({
//         user,
//         token,
//       });
//     } else {
//       user = new Users({
//         firstName: "FirstnameUser",
//         lastName: "LastnameUser",
//         email,
//         password: email,
//         birthDate: new Date(),
//         country: "Country",
//         gender: "male",
//         isActive: true,
//       });
//       let googleUser = await user.save();
//       const token = jwt.sign(
//         { _id: googleUser._id, role: AUTH_ROLES.USER },
//         process.env.JWT_SECRET,
//         {
//           expiresIn: "15d",
//         }
//       );
//       return res.status(200).json({
//         user,
//         token,
//       });
//     }
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email }).maxTimeMS(30000);
    const company = await Companies.findOne({ email });

    if (!user && !company) {
      return res.status(400).json({ error: "user not found" });
    }
    const document = user || company;
    const isMatch = await bcrypt.compare(password, document.password);
    if (!isMatch) {
      return res.status(400).json({ error: "invalid password" });
    }
    const token = jwt.sign(
      { email, role: document.role, _id: document._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "15d",
      }
    );
    if (!document.isActive) {
      return res.status(400).json({ error: "not active" });
    }
    if (document.isBlocked) {
      return res.status(400).json({ error: "blocked" });
    }
    const confirmationRole = [AUTH_ROLES.EXPERT, AUTH_ROLES.COMPANY];
    console.log(confirmationRole.includes(document.role));
    if (!document.isConfirmed && confirmationRole.includes(document.role)) {
      return res.status(400).json({ error: "not confirmed" });
    }
    return res.status(200).json({
      user: document,
      token,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error });
  }
};
const confirmAccount = async (req, res) => {
  try {
    let ref = "";
    const user = await Users.findById(req.params.id);
    if (user) ref = "user";
    const company = await Companies.findById(req.params.id);
    if (company) ref = "company";
    const document = user || company;
    if (document.isActive) {
      await activationToken.deleteMany({ owner: req.params.id });
      return res.status(400).json({ error: "already active" });
    }
    const token = activationToken.findOne({ owner: req.params.id, ref }).lean();
    if (!token) {
      return res.status(400).json({ error: "error" });
    }
    document.isActive = true;
    await Promise.all([
      activationToken.deleteMany({
        owner: req.params.id,
        ref: ref,
      }),
      document.save(),
    ]);
    return res.status(200).json("active");
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
const restPasswordMail = async (req, res) => {
  try {
    const email = req.params.email;
    let user = await Users.findOne({ email: req.params.email }).lean();
    const company = await Companies.findOne({ email }).lean();
    const document = user || company;
    if (!document) return res.status(400).json({ error: "!invalid email" });
    if (!document.isActive)
      return res.status(400).json({ error: "!inactive account" });
    if (document.isBlocked)
      return res.status(400).json({ error: "!blocked account" });
    const ref =
      document.role === AUTH_ROLES.EXPERT
        ? "user"
        : document.role === AUTH_ROLES.COMPANY
        ? "company"
        : "user";
    console.log(ref);
    console.log(document._id);
    sendRestEmail(req.params.email, ref, document._id);
    return res.status(200).json("ok");
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
const restPasswordToken = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "invalid params" });
    }
    const token = await ResetPasswordTokens.findById(id).lean();
    if (!token) {
      return res.status(400).json({ error: "invalid token" });
    }
    if (token.ref === "user") {
      const user = await Users.findById(token.owner);
      user.password = req.body.password;
      await user.save();
      return res.status(200).json("ok");
    }
    if (token.ref === "company") {
      const company = await Companies.findById(token.owner);
      company.password = req.body.password;
      await company.save();
      return res.status(200).json("ok");
    }
    return res.status(400).json({ error: "invalid token" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

module.exports = {
  signUpExpert,
  signIn,
  confirmAccount,
  restPasswordMail,
  restPasswordToken,

  signUpUser,
  signUpCompany,
};
