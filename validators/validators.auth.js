yup = require("yup");
const loginValidator = yup.object().shape({
  password: yup.string().required().max(1024).min(8),
  email: yup.string().email().required(),
});
module.exports = { loginValidator };
