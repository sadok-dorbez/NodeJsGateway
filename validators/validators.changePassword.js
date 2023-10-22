yup = require("yup");
const changePassword = yup.object().shape({
  password: yup.string().required().max(1024).min(8),
  newPassword: yup.string().required().max(1024).min(8),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("newPassword")], "password doesn't match"),
});
module.exports = { changePassword };
