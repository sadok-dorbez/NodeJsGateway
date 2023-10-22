const express = require("express");
const router = express.Router();
const validate = require("../middleware/schemaValidation");
const {
  signIn,
  confirmAccount,
  restPasswordMail,
  restPasswordToken,
  signUpExpert,
  signUpCompany,
  signUpUser,
} = require("../controller/controller.auth");
const { upload } = require("../utils/upload");
const { companyValidator } = require("../validators/validators.company");
const { loginValidator } = require("../validators/validators.auth");
const { userValidator } = require("../validators/validators.user");
router.post("/signIn", validate(loginValidator), signIn);
router.post(
  "/expert",
  upload.single("expertise"),
  validate(userValidator),
  signUpExpert
);
router.post(
  "/company",
  upload.single("registerCommerce"),
  validate(companyValidator),
  signUpCompany
);
router.post("/user", upload.single("cin"), validate(userValidator), signUpUser);
router.put("/confirm/:id", confirmAccount);
router.get("/restPasswordMail/:email", restPasswordMail);
router.put("/reset/password/:id", restPasswordToken);
//login with google
module.exports = router;
