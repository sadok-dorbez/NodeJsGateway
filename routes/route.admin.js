var express = require("express");
var router = express.Router();
const Users = require("../models/model.user");
const Companies = require("../models/model.company");
const { authorizeAdmin, AUTH_ROLES } = require("../middleware/auth");
const { verifyDoc } = require("../middleware/verfieDocument");
const {
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
} = require("../controller/controller.admin");

router.get("/", getDocuments);
router.get("/companies", authorizeAdmin, getCompanies);

router.put("/user/block/:id", blockUser);
router.put("/company/block/:id", verifyDoc(Companies, "id"), blockCompany);
router.put("/user/confirm/:id", confirmUser);
router.put("/user/unconfirm/:id", unConfirmUser);
router.get("/company/confirm/:id", verifyDoc(Companies, "id"), confirmCompany);
router.get(
  "/company/unconfirm/:id",
  verifyDoc(Companies, "id"),
  unConfirmCompany
);
router.put("/user/unblock/:id", unblockUser);
router.put("/company/unblock/:id", verifyDoc(Companies, "id"), unblockCompany);
module.exports = router;
