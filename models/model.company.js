const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");
const companySchema = new Schema(
  {
    fullName: { type: String, required: true, maxLength: 255, trim: true }, //signup
    password: { required: true, type: String, minLength: 8, maxLength: 1024 }, //signup
    email: { required: true, type: String, unique: true }, //signup
    role: { type: "String", default: "company" },
    coverPhoto: { type: String },
    picture: { type: String },
    websiteUrl: { type: String },
    numTel: { type: String }, //signup
    city: { type: String }, //signup
    registerCommerce: { type: String }, //file verified by admin + signup
    isConfirmed: { type: Boolean, default: false },

    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

companySchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }

    const Rating = mongoose.model("Rating");

    // Get all ratings for this company
    const ratings = await Rating.find({ _id: { $in: this.listofRates } });

    // Calculate the average rating if there are ratings
    if (ratings.length > 0) {
      const totalRating = ratings.reduce(
        (acc, rating) => acc + rating.rating,
        0
      );
      this.averageRating = totalRating / ratings.length;
    }

    next();
  } catch (error) {
    next(error);
  }
});

companySchema.methods.matchPassword = async function (password) {
  try {
    const match = await bcrypt.compare(password, this.password);
    return match;
  } catch (err) {
    throw err;
  }
};
const Companies = mongoose.model("company", companySchema, "company");
module.exports = Companies;
