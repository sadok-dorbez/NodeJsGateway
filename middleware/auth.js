const jwt = require("jsonwebtoken");
const UserModel = require("../models/model.user");
const CompanyModel = require("../models/model.company");
//Models is an objects of models
//roles is an array of roles
exports.authorizeAdmin = async (req, res, next) => {
  let token = req.header("x-auth-token") || req.headers.authorization;
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }
  token = token.split(" ")[1];
  console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid token.");
    }
    if (!user.role === "admin") {
      return res.status(403).send("Access denied.");
    }
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};
exports.AUTH_ROLES = {
  USER: "user",
  COMPANY: "company",
  EXPERT: "expert",
};
exports.authorize = (roles) => {
  return async (req, res, next) => {
    let token = req.header("x-auth-token") || req.headers.authorization;
    console.log(token);
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }
    token = token.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { email, role } = decoded;
      const user = await UserModel.findOne({ email });
      const company = await CompanyModel.findOne({ email });
      const document = user || company;
      if (!document) {
        return res.status(400).send("Invalid token.");
      }
      if (company && roles.includes("company")) {
        req.email = email;
        req.id = company._id;
        req.role = "company";

        return next();
      }
      if (user && roles.includes("user")) {
        console.log("user");
        req.email = email;
        req.id = user._id;
        req.role = "user";
        console.log("user");
        return next();
      }
      if (user && roles.includes("expert") && user.role === "expert") {
        req.email = email;
        req.id = user._id;
        req.role = "expert";
        return next();
      }
      return res.status(403).send("Access denied.");
    } catch (ex) {
      res.status(400).json({ msg: ex.message });
    }
  };
};
