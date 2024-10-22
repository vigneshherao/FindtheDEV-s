const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/userAuth");
const userModel = require("../models/userModel");
const { validateData } = require("../utils/validate");

router.get("/profile", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.json({
      message: `${user.firstName} retrived sucesffully`,
      data: user,
    });
  } catch (error) {
    console.log("err in getting data" + error.message);
  }
});

router.patch("/profile/edit", userAuth, (req, res) => {
  try {
    if (!validateData(req)) {
      throw new Error("Only Some data are allowed to edit");
    }

    const logginedInUser = req.user;
    Object.keys(req.body).forEach(
      (keys) => (logginedInUser[keys] = req.body[keys])
    );

    logginedInUser.save();

    res.json({
      message: `${logginedInUser.firstName} updated sucessfully`,
      data: logginedInUser,
    });
  } catch (error) {
    res.send("Error " + error.message);
  }
});

module.exports = router;
