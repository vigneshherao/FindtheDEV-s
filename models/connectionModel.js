const { timeStamp } = require("console");
const mongoose = require("mongoose");
const { type } = require("os");

const connectionSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["addFriend,reject,accepted"],
        message: "enum failed correct the `{VALUE}`",
      },
    },
  },
  {
    timestamps: true,
  }
);

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionSchema);

module.exports = ConnectionRequest;
