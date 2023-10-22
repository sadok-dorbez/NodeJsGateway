const Users = require("../models/model.user");
const Companies = require("../models/model.company");
const { sendAffirmationEmail, sendBlockEmail } = require("../utils/mail");
const blockUser = async (req, res) => {
  console.log(req.body);
  try {
    const { id } = req.params;
    const blockedReason = req.body.blockedReason;
    const user = await Users.findByIdAndUpdate(id, {
      isBlocked: true,
      blockedReason,
    });
    const company = await Companies.findByIdAndUpdate(id, {
      isBlocked: true,
      blockedReason: req.body.blockedReason,
    });
    const document = user || company;
    sendBlockEmail(document.email, req.body.blockedReason);
    return res.status(200).json(user || company);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
const unblockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByIdAndUpdate(id, { isBlocked: false });
    const company = await Companies.findByIdAndUpdate(id, { isBlocked: false });
    return res.status(200).json(user || company);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
const blockCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Companies.findByIdAndUpdate(id, {
      isBlocked: true,
      blockedReason: req.body.blockedReason,
    });
    sendBlockEmail(user.email, req.body.blockedReason);
    return res.status(200).json(company);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
const unblockCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Companies.findByIdAndUpdate(id, { isBlocked: false });
    return res.status(200).json(company);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
const confirmUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findByIdAndUpdate(id, { isConfirmed: true });
    const company = await Companies.findByIdAndUpdate(id, {
      isConfirmed: true,
    });
    sendAffirmationEmail(user || company);
    return res.status(200).json(user || company);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};
const unConfirmUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByIdAndUpdate(id, { isConfirmed: false });
    const company = await Companies.findByIdAndUpdate(id, {
      isConfirmed: false,
    });
    return res.status(200).json(user || company);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
const confirmCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Companies.findByIdAndUpdate(id, {
      isConfirmed: true,
    });
    sendAffirmationEmail(company);
    return res.status(200).json(company);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
const unConfirmCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Companies.findByIdAndUpdate(id, {
      isConfirmed: false,
    });
    return res.status(200).json(company);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
// const getDocuments = async (req, res) => {
//   const users = await Users.find({ isActive: true, role: "user" });
//   const companies = await Companies.find({ isActive: true, role: "company" });
//   const experts = await Users.find({ isActive: true, role: "expert" });
//   const documents = {
//     users,
//     companies,
//     experts,
//   };
//   return res.status(200).json(documents);
// };
const getDocuments = async (req, res) => {
  try {
    const users = await Users.find({ isActive: true, role: "user" });
    const companies = await Companies.find({ isActive: true, role: "company" });
    const experts = await Users.find({ isActive: true, role: "expert" });
    const documents = [...users, ...companies, ...experts];
    return res.status(200).json(documents);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
const getUsers = async (req, res) => {
  try {
    const users = await Users.find({
      isActive: true,
    });
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
const getCompanies = async (req, res) => {
  try {
    const companies = await Companies.find({
      isActive: true,
    });
    return res.status(200).json(companies);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
module.exports = {
  blockUser,
  unblockUser,
  blockCompany,
  unblockCompany,
  confirmUser,
  unConfirmUser,
  confirmCompany,
  unConfirmCompany,
  getUsers,
  getCompanies,
  getDocuments,
};
