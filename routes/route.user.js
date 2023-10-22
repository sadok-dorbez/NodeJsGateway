const express = require("express");
const router = express.Router();
const validate = require("../middleware/schemaValidation");

const { authorize, AUTH_ROLES } = require("../middleware/auth");
const { USER, COMPANY } = AUTH_ROLES;
const { upload } = require("../utils/upload");
const {
  updatePassword,
  updateProfile,
  updateCoverPhoto,
  updatePicture,
  updateCV,
  getUsers,
  addNewEducation,
  addNewCertification,
  addNewSkill,
  addNewExperience,
  getUserById,
  updateScore,
} = require("../controller/controller.user");
const {
  getCompanies,
  updateCoverPhotoCompany,
  updatePictureCompany,
  getOneCompanies,
} = require("../controller/controller.company");
const { userProfile, ScoreValidate } = require("../validators/validators.user");
const { changePassword } = require("../validators/validators.changePassword");
router.get("/users", getUsers);
router.get("/user/:id", getUserById);
router.get("/companies", getCompanies);
router.get("/companies/:id", getOneCompanies);
router.put(
  "/password",
  authorize([USER]),
  validate(changePassword),
  updatePassword
);
router.put(
  "/companyCover",
  authorize(COMPANY),
  upload.single("coverPhoto"),
  updateCoverPhoto
);
router.put(
  "/companyProfile",
  authorize(COMPANY),
  upload.single("picture"),
  updatePictureCompany
);
router.put(
  "/coverPhoto",
  authorize([USER]),
  upload.single("coverPhoto"),
  updateCoverPhoto
);
router.put(
  "/picture",
  authorize([USER]),
  upload.single("picture"),
  updatePicture
);
router.put("/cv", authorize([USER]), upload.single("cv"), updateCV);
router.post("/upload", upload.single("file"), (req, res) => {
  res.status(200).json({ file: req.file });
});

router.put("/experience", authorize([USER]), addNewExperience);
router.put("/skill", authorize([USER]), addNewSkill);
router.put(
  "/certification",
  upload.single("certificate"),
  authorize([USER]),
  addNewCertification
);
router.put("/education", authorize([USER]), addNewEducation);
router.put("/:id", authorize([USER]), validate(userProfile), updateProfile);
router.put("/updateScore/:userId", updateScore);

//update profile
//experience popup
//logout
//private route admin and user
//upload file
module.exports = router;
