require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const indexRouter = require("./routes/route.index");
const Socket = require("./utils/SocketClass");
//data base
require("./database");
const cors = require("cors");
const app = express();
const path = require("path");
//socket setup
global.io = new Socket(3005, {
  cors: {
    origin: "*",
  },
});
// view engine setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use("/", indexRouter);
app.use("/data", express.static(path.join(__dirname, "public")));
app.use("/api/Messages", require("./module/Messages"));
// error handler
app.use(function (err, req, res, next) {
  console.log(err.message);
  return res.status(err.status || 500).json({ error: err.message });
});
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});

// Import Eureka registration
require("./eureka");
