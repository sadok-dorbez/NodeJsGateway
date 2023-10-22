const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const userSchema = new Schema(
  {
    fullName: { required: true, type: String, maxLength: 255, trim: true }, // signup
    password: {
      required: true,
      type: String,
      minLength: 8,
      maxLength: 1024,
    }, // signup
    role: { type: String, enum: ["user", "admin", "expert"], default: "user" },
    email: { required: true, type: String, unique: true }, //signup
    gender: { required: true, type: String, enum: ["female", "male"] }, //signup

    isActive: { type: Boolean, default: false },
    isConfirmed: { type: Boolean, default: false },
    picture: { type: String },
    coverPhoto: { type: String },
    numTel: { type: String },

    city: { type: String }, //signup

    expertise: [{ type: String }], //verification by admin + signup expert
  },
  { timestamps: true }
);
userSchema.methods.matchPassword = async function (password) {
  try {
    const match = await bcrypt.compare(password, this.password);
    return match;
  } catch (err) {
    throw err;
  }
};
userSchema.pre("save", async function (nxt) {
  try {
    if (!this.isModified("password")) return nxt();
    this.password = await bcrypt.hash(this.password, 10);
    return nxt();
  } catch (err) {
    throw err;
  }
});
const Users = mongoose.model("user", userSchema, "user");
module.exports = Users;
