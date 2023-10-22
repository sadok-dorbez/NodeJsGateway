const express = require("express");
const adminRouter = require("./route.admin");
const authRouter = require("./route.auth");
const userRouter = require("./route.user");

const router = express.Router();

const uploadRouter = require("./route.upload");

router.get("/", (req, res) => {
  res.status(200).json("Backend server working properly! 🙌 ");
});

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/user", userRouter);

router.use("/upload", uploadRouter);

module.exports = router;
