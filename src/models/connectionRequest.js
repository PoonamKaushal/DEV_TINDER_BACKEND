const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["Ignored", "Accepted", "Interested", "Rejected"],
      },
    },
  },
  {
    timestamps: true,
  }
);
ConnectionRequestSchema.pre("save", function (next) {
  connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error(" Can't send a connection request to yourself!");
  }
  next();
});
module.exports = mongoose.model(
  "ConnectionRequestSchema",
  ConnectionRequestSchema
);
