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
        values: ["add", "reject", "accepted"],
        message: "enum failed correct the `{VALUE}`",
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionSchema.pre("save", function (next) {
  const connectionUser = this;

  if (connectionUser.fromUserId.equals(connectionUser.toUserId)) {
    throw new Error("You cannot send yourself requrest");
  }

  next();
});

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionSchema);

module.exports = ConnectionRequest;
