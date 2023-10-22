const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const activationSchema = new Schema({
  ref: {
    type: String,
    required: true,
    oneOf: ["user", "company"],
  },
  owner: { type: Schema.Types.ObjectId, required: true },
});
const activationToken = mongoose.model(
  "activationToken",
  activationSchema,
  "activationToken"
);
module.exports = activationToken;
