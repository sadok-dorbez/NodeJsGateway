const Companies = require("../models/model.company");
const mongoose = require("mongoose");
const { isErrored } = require("nodemailer/lib/xoauth2");
const followerDetails = {
  firstName: 1,
  lastName: 1,
  picture: 1,
  coverPhoto: 1,
  field: 1,
  score: 1,
  country: 1,
};
const updatePassword = async (req, res) => {
  try {
    const company = await Companies.findById(req.company._id);
    const match = await company.matchPassword(req.body.password);
    if (!match) return res.status(400).json({ error: "worng password" });
    company.password = req.body.newPassword;
    await company.save();
    return res.status(200).json("password updated");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const updateCompany = async (req, res) => {
  try {
    await Companies.findByIdAndUpdate(req.company._id, req.body).exec();
    return res.status(200).json("updated");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const deleteCompany = async (req, res) => {
  try {
    await Companies.findByIdAndDelete(req.params.id).exec();
    return res.status(200).json("deleted successfully");
  } catch (err) {
    return res.status(500).json({ error: isErrored.message });
  }
};
const addContact = async (req, res) => {
  try {
    const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValid) return res.status(400).json({ error: "invalid params" });
    const company = await Companies.findById(req.params.id);
    if (!company) return res.status(400).json("! wrong params");
    if (company.owner.toString() !== req.user._id.toString())
      return res.status(401).json("you are not the owner");
    const contact = company.contacts.findIndex(
      (e) => e.number === req.body.number && e.code === req.body.code
    );
    if (contact !== -1) return res.status(200).json("contact already exists");
    company.contacts.push(req.body);
    await company.save();
    return res.status(200).json("contact added");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const updateContact = async (req, res) => {
  try {
    const isValid = mongoose.Types.ObjectId.isValid(req.params.idC);
    if (!isValid) return res.status(400).json({ error: "invalid params" });
    const company = await Companies.findById(req.params.id);
    const index = company.contacts.findIndex(
      (e) => e._id.toString() === req.params.idC
    );
    if (index === -1) return res.status(200).json("!invalid params");
    company.contacts.splice(index, 1, req.body);
    await company.save();
    return res.status(200).json("contact updated");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};
const currentCompany = async (req, res) => {
  const { company } = req;
  console.log(company);
  try {
    const company = await Companies.findById(req.company._id).lean();
    return res.status(200).json(company);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const deleteContact = async (req, res) => {
  try {
    const isValid = mongoose.Types.ObjectId.isValid(req.params.idC);
    if (!isValid) return res.status(400).json({ error: "invalid params" });
    const company = await Companies.findById(req.params.id);
    const index = company.contacts.findIndex(
      (e) => e._id.toString() === req.params.idC
    );
    if (index === -1) return res.status(200).json("!invalid params");
    company.contacts.splice(index, 1);
    await company.save();
    return res.status(200).json("contact deleted");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};
const followCompany = async (req, res) => {
  try {
    const company = await Companies.findById(req.params.id);
    const index = company.followers.indexOf(req.user._id);
    if (index !== -1) return res.status(400).json("already follwed");
    company.followers.push(req.user._id);
    await company.save();
    return res.status(200).json("company fllowed");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};
const unfollowCompany = async (req, res) => {
  try {
    const company = await Companies.findById(req.params.id);
    const index = company.followers.indexOf(req.user._id);
    if (index === -1) return res.status(400).json("you are not a follower");
    company.followers.splice(index, 1);
    await company.save();
    return res.status(200).json("company unfllowed");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};
const getFollowers = async (req, res) => {
  try {
    const company = await Companies.findById(req.params.id).populate({
      path: "followers",
      select: followerDetails,
    });
    if (company.followers.length === 0)
      return res.status(204).json(company.followers);
    return res.status(200).json(company.followers);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};
const getCompanyByEmail = async (req, res) => {
  try {
    const user = await Companies.findOne({ email: req.params.email })
      .select({ email: 1 })
      .lean();

    if (user) {
      return res.status(200).json({ exist: true });
    }
    return res.status(200).json({ exist: false });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const getCompanies = async (req, res) => {
  try {
    const Company = await Companies.find()
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((error) => {
        res.status(404).json({ message: "companies not found" });
      });
  } catch (error) {
    res
      .status(400)
      .json({ message: `Error getting companies  .Error:\n${error}` });
  }
};
const updateCoverPhotoCompany = async (req, res) => {
  const { id, role, email } = req;
  if (role === "company") {
    const company = await Companies.findByIdAndUpdate(id, {
      coverPhoto: req.file?.filename,
    });
    return res.status(200).json(company);
  }
};
const updatePictureCompany = async (req, res) => {
  console.log(req.file);
  try {
    const { id, role, email } = req;
    if (role === "company") {
      const company = await Companies.findByIdAndUpdate(id, {
        picture: req.file?.filename,
      });
      return res.status(200).json(company);
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
const getOneCompanies = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const company = await Companies.findOne({ _id: id })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((error) => {
        res.status(404).json({ message: "companies not found" });
      });
    return company;
  } catch (error) {
    res
      .status(400)
      .json({ message: `Error getting companies  .Error:\n${error}` });
  }
};
module.exports = {
  getCompanies,
  updateCompany,
  deleteCompany,
  addContact,
  deleteContact,
  updateContact,
  followCompany,
  unfollowCompany,
  getFollowers,
  currentCompany,
  updatePassword,
  getCompanyByEmail,
  updatePictureCompany,
  updateCoverPhotoCompany,
  getOneCompanies,
};
