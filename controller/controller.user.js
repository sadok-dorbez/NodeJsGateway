const Users = require("../models/model.user");
const Companies = require("../models/model.company");
const getUsersList = async (req, res) => {
  const users = await Users.find({});

  if (users) {
    res.status(200).json(users);
  } else res.status(200).json("password updated");
};
const getUsers = async (req, res) => {
  try {
    const user = await Users.find()
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((error) => {
        res.status(404).json({ message: "Users not found" });
      });
  } catch (error) {
    res.status(400).json({ message: `Error getting users  .Error:\n${error}` });
  }
};

const updatePassword = async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  const match = await user.matchPassword(req.body.password);
  if (!match) return res.status(400).json({ error: "wrong password" });
  user.password = req.body.newPassword;
  await user.save();
  return res.status(200).json("password updated");
};
const updateProfile = async (req, res) => {
  const { role, email } = req;
  const id = req.id; //changement
  if (role == "user" || role == "expert") {
    await Users.findByIdAndUpdate(id, req.body);
    return res.status(200).json("profile updated");
  }
  if (role == "company") {
    await Companies.findByIdAndUpdate(id, req.body);
    return res.status(200).json("profile updated");
  }
};
const updateScore = async (req, res) => {
  try {
    const id = req.params.userId;
    const score = parseInt(req.body.score);
    const User = await Users.findById({ _id: id });
    User.scoreTotal = parseInt(User.scoreTotal) + parseInt(score);
    await User.save();
    return res.status(201).json("User updated");
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
const updateCoverPhoto = async (req, res) => {
  const { id, role, email } = req;
  if (role == "user" || role == "expert") {
    const user = await Users.findByIdAndUpdate(id, {
      coverPhoto: req.file?.filename,
    });
    return res.status(200).json(user);
  }
  if (role == "company") {
    const company = await Companies.findByIdAndUpdate(id, {
      coverPhoto: req.file?.filename,
    });
    return res.status(200).json(company);
  }
};
const updatePicture = async (req, res) => {
  console.log(req.file);
  try {
    const { id, role, email } = req;
    if (role == "user" || role == "expert") {
      const user = await Users.findByIdAndUpdate(id, {
        picture: req.file?.filename,
      });
      return res.status(200).json(user);
    }

    if (role == "company") {
      const company = await Companies.findByIdAndUpdate(id, {
        picture: req.file?.filename,
      });
      return res.status(200).json(company);
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
const updateCV = async (req, res) => {
  console.log(req.file);
  try {
    const { id, role, email } = req;
    if (role == "user" || role == "expert") {
      const user = await Users.findByIdAndUpdate(id, {
        picture: req.file?.filename,
      });
      return res.status(200).json(user);
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
const addNewExperience = async (req, res) => {
  try {
    const { id, role } = req;
    if (role == "user" || role == "expert") {
      const user = await Users.findById(id);
      user.experience.push(req.body);
      await user.save();
      return res.status(200).json(user);
    } else return res.status(403).json("Access denied");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const addNewSkill = async (req, res) => {
  try {
    const { id, role } = req;
    if (role == "user" || role == "expert") {
      const user = await Users.findById(id);
      user.skills.push(req.body);
      await user.save();
      return res.status(200).json(user);
    } else return res.status(403).json("Access denied");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const addNewCertification = async (req, res) => {
  console.log("user5");
  try {
    const { id, role } = req;
    if (role == "user" || role == "expert") {
      const user = await Users.findById(id);
      const body = { ...req.body, file: req.file.filename };
      console.log(body);
      user.certificates.push(body);
      await user.save();
      return res.status(200).json(user);
    } else return res.status(403).json("Access denied");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const addNewEducation = async (req, res) => {
  try {
    const { id, role } = req;
    if (role == "user" || role == "expert") {
      const user = await Users.findById(id);
      user.studyCarrier.push(req.body);
      await user.save();
      return res.status(200).json(user);
    } else return res.status(403).json("Access denied");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await Users.findById(id)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((error) => {
        res.status(404).json({ message: "User NOT FOUND" });
      });
  } catch (error) {
    res
      .status(400)
      .json({ message: `Error getting user by Id. Error:\n${error}` });
  }
};

module.exports = {
  getUsers,
  updatePassword,
  updateProfile,
  updateCoverPhoto,
  updatePicture,
  updateCV,
  getUserById,
  addNewEducation,
  addNewCertification,
  addNewSkill,
  addNewExperience,
  getUsersList,
  updateScore,
};
