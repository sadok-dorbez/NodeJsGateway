const express = require("express");
const router = express.Router();
const MessageController = require("./controller");
router
.post("/add", MessageController.create)
.get("/get/:id", MessageController.get)
module.exports = router;
