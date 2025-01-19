const jwt = require("jsonwebtoken");
const User = require("../models/user");
const adminAuth = (req, res, next) => {
  try {
    const token = "abc";
    const isAdminAuthrized = token === "abc";
    if (!isAdminAuthrized) {
      res.status(401).send("Unauthorized user.");
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

// Main use of auth middleware is to
// Read the token from request cookies
// validate the token
// And then find the user in the database who has logged in
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.send("Token is not valid!!!!!");
    }
    const isUserAuthrized = jwt.verify(token, "DEV@TINDER");

    const loggedInUser = await User.findById(isUserAuthrized.id);

    if (!loggedInUser) {
      return res.send("User not found.");
    }

    req.user = { ...loggedInUser };
    req.user.user_id = isUserAuthrized?.id;

    next(); // next function will move to request handler
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
