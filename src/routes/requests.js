const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestsRouter = express.Router();

requestsRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const { user_id: fromUserId } = req.user;
      const status = req.params?.status;
      const toUserId = req.params?.toUserId;

      //  check if the toUser exist in the db or not
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).send("User not found.");
      }
      // status validation only ignored or interested should be accepted.
      const allowedStatus = ["Interested", "Ignored"];
      if (!allowedStatus.includes(status)) {
        return res.send(400).json({
          meassage: "Invalid status" + status,
        });
      }
      // connection request should be only from one side the other user can accept or reject it.
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      console.log("36", existingRequest);

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: "Connection request sent successfully.",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error" + error.message);
    }
  }
);

requestsRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      // validate allowed status
      // only the user to whom one has send the request can see the review req. so we need to check if reuestId===loggedInuser
      // validate reuestId means it should not be random
      const { status, requestId } = req.params;
      const { user_id: loggedInUserId } = req.user;
      const allowedStatus = ["Accepted", "Rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ meassage: "Invalid status." });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUserId,
        status: "Interested",
      });

      if (!connectionRequest) {
        return res.status(404).json({
          message: "Connection request not found.",
        });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        meassage: "Request accepted successfully.",
        data,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = requestsRouter;
