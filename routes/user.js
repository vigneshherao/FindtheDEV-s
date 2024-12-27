const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/userAuth");
const connectionModel = require("../models/connectionModel");
const userModel = require("../models/userModel");
const { set } = require("mongoose");

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

router.get("/user/connections", userAuth, async (req, res) => {
  try {
    const logginedUser = req.user;

    const connections = await connectionModel
      .find({
        $or: [
          {
            toUserId: logginedUser._id,
            status: "accepted",
          },
          {
            fromUserId: logginedUser._id,
            status: "accepted",
          },
        ],
      })
      .populate("fromUserId", ["firstName", "lastName"]);

    const dataFromUser = connections.map((connection) => {
      if (String(connection.fromUserId._id) === String(logginedUser._id)) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });

    res.json({
      message: `${
        connections ? `${connections.length} connections` : "No Connections"
      }  `,
      data: dataFromUser,
    });
  } catch (error) {
    res.status(404).send("Error " + error.message);
  }
});

router.get("/user/feeds", userAuth, async (req, res) => {
  try {
    const logginedUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const connectionsRequerst = await connectionModel
      .find({
        $or: [
          {
            toUserId: logginedUser._id,
          },
          {
            fromUserId: logginedUser._id,
          },
        ],
      })
      .select("fromUserId toUserId");

    const hiderUsers = new Set();

    connectionsRequerst.forEach((connection) => {
      hiderUsers.add(connection.fromUserId.toString());
      hiderUsers.add(connection.toUserId.toString());
    });

    const feeds = await userModel
      .find({
        $and: [
          { _id: { $nin: Array.from(hiderUsers) } },
          { _id: { $ne: logginedUser._id } },
        ],
      })
      .select("firstName lastName email")
      .skip(skip)
      .limit(limit);

    res.json({
      message: `${feeds ? `${feeds.length} feeds` : "No Feeds"}  `,
      data: feeds,
    });
  } catch (error) {
    res.status(404).send("Error " + error.message);
  }
});

module.exports = router;
