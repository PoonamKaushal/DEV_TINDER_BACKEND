const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 15,
    },
    lastName: {
      type: String,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender is not valid.");
        }
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address" + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    skills: {
      type: [String, String],
    },
    password: {
      type: String,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Your password is not so strong.");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

// mongoose methods to refactor the code
// to create the token at login
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ id: user._id }, "DEV@TINDER", {
    expiresIn: "7d",
  });
  return token;
};

// to compare the passwords
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const isValidPassword = await bcrypt.compare(
    passwordInputByUser,
    user.password
  );
  return isValidPassword;
};
//indexing to run the query fast
userSchema.index({ firstName: 1 });
module.exports = mongoose.model("User", userSchema);
