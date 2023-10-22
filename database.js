mongoose = require("mongoose");
module.exports = mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("connection etablished "))
  .catch((err) => console.log(err));
