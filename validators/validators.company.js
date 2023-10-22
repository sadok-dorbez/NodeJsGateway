yup = require("yup");
const companyValidator = yup.object().shape({
  fullName: yup.string().required().max(50).min(2),
  password: yup.string().required().max(1024).min(8),
  email: yup.string().email().required(),
  role: yup.string().required().oneOf(["expert", "company", "user"]),
  numTel: yup.string().required().max(8).min(8),
  city: yup.string().required().max(50).min(2),
});
const companyProfileValidator = yup.object().shape({
  name: yup.string().required().max(50).min(2),
  country: yup.string().required().max(50).min(2),
  category: yup.string().required().oneOf(["pe", "pme", "ge", "mega"]),
  websiteUrl: yup.string().url(),
  fields: yup.array().of(yup.string()).required(),
});

module.exports = {
  companyValidator,
  companyProfileValidator,
};
