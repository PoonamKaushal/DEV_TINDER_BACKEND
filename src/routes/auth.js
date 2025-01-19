const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
// const { validateSignUpData } = require("./utils/validation");

// signup api
authRouter.post("/signup", async (req, res) => {
  try {
    // API level validation of data
    // validateSignUpData(req); // this is also a way to validate you data but for me its not working.
    const { firstName, lastName, gender, age, skills, password, email } =
      req.body || {};
    // encrypting the password for security
    const hashPassword = await bcrypt.hash(password, 10);

    // created a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      gender,
      age,
      skills,
      email,
      password: hashPassword,
    });
    await user.save();
    res.send("Signed Up successfully.");
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      // Collect error messages from the validation error object
      const errors = Object.values(error.errors).map((err) => err.message);
      res.status(400).send({ message: errors.join(", ") });
    } else {
      res.status(400).send("Bad request.");
    }
  }
});

// Login APi
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      return res.json({
        message: "Invalid user.",
      });
    }
    // let data = {};
    const isvalidPassword = await user.validatePassword(password);
    console.log(isvalidPassword);

    if (isvalidPassword) {
      const token = await user.getJWT();
      res.cookie("token", token);
      data = {
        token,
        message: "Logged in successfully",
      };
    } else {
      throw new Error("Invaild credentials.");
    }
    return res.send({ data });
  } catch (error) {
    console.log(error);
    res.status(400).send("Can't login");
  }
});

// Logout Api
authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("Logged out successfully.");
});
module.exports = authRouter;
