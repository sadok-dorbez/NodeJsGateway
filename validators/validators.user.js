yup = require("yup");

const userValidator = yup.object().shape({
  fullName: yup.string().required().max(255),
  password: yup.string().required().max(1024).min(8),
  email: yup.string().email().required(),
  gender: yup.string().required().max(255).oneOf(["male", "female", "other"]),
  city: yup.string().required().max(255),
  role: yup.string().required().max(255).oneOf(["user", "admin", "expert"]),
  numTel: yup.string().required().max(8).min(8),
});
const userProfile = yup.object().shape({
  fullName: yup.string().required().max(255),
  gender: yup.string().required().max(255).oneOf(["male", "female", "other"]),
  city: yup.string().required().max(255),
  role: yup.string().required().max(255).oneOf(["user", "admin", "expert"]),
  numTel: yup.string().required().max(8).min(8),
});
const skill = yup.object().shape({
  name: yup.string().required().max(255),
  level: yup
    .string()
    .required()
    .max(255)
    .oneOf(["beginner", "intermediate", "advanced"]),
});
const experience = yup.object().shape({
  poste: yup.string().required().max(255),
  company: yup.string().required().max(255),
  startDate: yup.date().required(),
  endDate: yup.date(),
});
const ScoreValidate = yup.object().shape({
  scoreTotal: yup.number().nullable(true).oneOf([0, 25, 50, 75, 100]),
});

module.exports = {
  userValidator,
  userProfile,
  ScoreValidate,
  skill,
  experience,
};
