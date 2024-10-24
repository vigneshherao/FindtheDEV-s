const express = require("express");
const userAuth = require("../middleware/userAuth");
const router = express.Router();
const ConnectionModel = require("../models/connectionModel");

router.post("/request/user/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const fromUserId = req.user;

    const connectionReq = new ConnectionModel({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionReq.save();

    res.json({
      message: "Friend request done sucessfully",
      data,
    });
  } catch (error) {
    res.send("Error" + error.message);
  }
});

module.exports = router;
