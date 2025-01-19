const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, gender, age, skills, password, email } =
    req.body || {};
  if (!firstName || !lastName) {
    throw new Error("Firstname and lastname is required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Enter a valid email.");
  }
};

module.exports = {
  validateSignUpData,
};
