const express = require("express");
const userAuth = require("../middleware/userAuth");
const router = express.Router();
const ConnectionModel = require("../models/connectionModel");
const User = require("../models/userModel");

router.post("/request/user/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const toUserId = req.params.toUserId;

    const status = req.params.status;
    const fromUserId = req.user._id;

    const allowed = ["add", "reject"];

    const isallowed = allowed.includes(status);

    if (!isallowed) {
      throw new Error("Bad Request send to status");
    }

    const isValidUser = await User.findById(toUserId);

    const isExist = await ConnectionModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (isExist) {
      throw new Error("Request already pending!!");
    }

    if (!isValidUser) {
      throw new Error("Not a valid user to send request");
    }

    const connectionReq = new ConnectionModel({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionReq.save();

    res.json({
      message: `${req.user.firstName} ${status}'s ${isValidUser.firstName}`,
      data,
    });
  } catch (error) {
    res.send("Error " + error.message);
  }
});

module.exports = router;
