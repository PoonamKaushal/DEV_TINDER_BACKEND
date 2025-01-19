const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

// Feed API get all users
profileRouter.get("/allusers", userAuth, async (req, res) => {
  try {
    console.log("10", "alluserfetcheeddd.");

    const users = await User.find({});
    res.json({ data: users, message: "Users fetch successfully." });
  } catch (error) {
    res.status(500).send("Can't fetch the users");
  }
});

// get a user profile who has logged in using jwt token
profileRouter.get("/userProfile", userAuth, async (req, res) => {
  try {
    const { user_id } = req.user;
    const user = await User.findById(user_id);
    // const data = {
    //   user,
    //   message: "Profile gets succesfully.",
    // };
    return res.json({ user, message: "Profile gets succesfully." });
  } catch (error) {
    res.status(400).send("Can't validate token");
  }
});

// update a user
profileRouter.patch("/update/:userId", async (req, res) => {
  const userId = req.params?.userId;
  console.log(userId);
  const data = req?.body;
  console.log("38", data);

  try {
    const updateAllowedData = ["age", "skills"];
    const isupdateKey = Object.keys(data).every((k) =>
      updateAllowedData.includes(k)
    );
    if (!isupdateKey) {
      res.send("Can't update the user");
    }
    if (data?.skills.length > 10) {
      console.log("entered");
      res.send("Can not enter more than 10 skills");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true, // enabled to update the existing data in database
    });
    console.log(user);
    res.send("user updated successfully.");
  } catch (error) {
    console.log(error);

    res.status(500).send("Error updating the user");
  }
});
module.exports = profileRouter;
