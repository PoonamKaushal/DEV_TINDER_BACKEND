const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

userRouter.get("/allRequests/received", userAuth, async (req, res) => {
  try {
    const { user_id: loggedInUserId } = req.user;
    // need to find all those connection request a user get
    // means loggedInUserId === toUserID
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: "Interested",
    }).populate("fromUserId", ["firstName", "lastName"]);
    res.json({
      message: "Connection requests fetched successfully.",
      data: connectionRequests,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Something went wrong.");
  }
});

userRouter.get("/allConnections/accepted", userAuth, async (req, res) => {
  try {
    const { user_id: loggedInUserId } = req.user;
    const acceptedConnections = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUserId,
          status: "Accepted",
        },
        {
          fromUserId: loggedInUserId,
          status: "Accepted",
        },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);
    const data = acceptedConnections.map((connectedUser) => {
      if (
        connectedUser.fromUserId._id.toString() === loggedInUserId.toString()
      ) {
        return connectedUser.toUserId;
      }
      return connectedUser.fromUserId;
    });
    res.json({
      message: "Connection requests fetched successfully.",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request.");
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const { user_id: loggedInuserId } = req.user;

    let limit = parseInt(req.query.limit) || 10;
    // sanitizing the limit
    limit = limit > 50 ? 50 : limit;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInuserId,
        },
        {
          toUserId: loggedInuserId,
        },
      ],
    }).select("fromUserId toUserId");

    const hideUsersFromfeed = new Set(); // this set data structure is an array and will take only unique values means don't take duplicate value
    connectionRequest.forEach((req) => {
      hideUsersFromfeed.add(req.fromUserId.toString());
      hideUsersFromfeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        {
          _id: { $nin: Array.from(hideUsersFromfeed) },
        },
        {
          _id: { $ne: loggedInuserId },
        },
      ],
    })
      .select("firstName lastName skills")
      .skip(skip)
      .limit(limit);

    return res.json({ message: "Users fetched successfully", data: users });
  } catch (error) {
    console.log("feed", error);
    res.status(500).send("Something went wrong.");
  }
});
module.exports = userRouter;
