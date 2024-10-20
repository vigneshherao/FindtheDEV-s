const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/userAuth");
const userModel = require("../models/userModel");

router.get("/profile", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    console.log("err in getting data" + error.message);
  }
});

router.delete("/profile/delete", async (req, res) => {
  try {
    const userId = req.body.userId;
    const data = await userModel.findByIdAndDelete(userId);
    res.send("user is deleted");
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error deleting user", error: error.message });
  }
});

router.patch("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params?.userID;
    const data = req.body;
    const isAllowed = ["firstName", "lastName", "phone", "age"];
    const isUpdated = Object.keys(data).every((k) => isAllowed.includes(k));
    if (data.phone < 10) {
      throw new Error("This is not allowed to add extra number exceeding 10");
    }
    if (!isUpdated) {
      throw new Error("This is not allowed to updated (email)");
    }
    const updated = await userModel.findOneAndUpdate(
      { _id: userId },
      { $set: { ...data }, runValidators: true }
    );
    res.send("updated");
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error adding user", error: error.message });
  }
});

module.exports = router;
