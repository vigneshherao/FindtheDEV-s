const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/userAuth");
const connectionModel = require("../models/connectionModel");

router.get("/user/requests", userAuth, async (req, res) => {
  try {
    const logginedUser = req.user;
    const requests = await connectionModel
      .find({
        toUserId: logginedUser._id,
        status: "add",
      })
      .populate("fromUserId", ["firstName", "lastName"]);

    if (!requests) {
      throw new Error("No connection requrest found");
    }

    res.json({
      message: `${
        requests
          ? `${requests.length} requests are pending`
          : "No pending Request"
      }  `,
      data: requests,
    });
  } catch (error) {
    res.status(404).send("Error " + error.message);
  }
});

module.exports = router;
