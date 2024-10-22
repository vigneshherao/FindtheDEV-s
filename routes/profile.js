const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/userAuth");
const userModel = require("../models/userModel");
const { validateData } = require("../utils/validate");
const bcrypt = require("bcrypt");

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

router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateData(req)) {
      throw new Error("Only Some data are allowed to edit");
    }

    const logginedInUser = req.user;
    Object.keys(req.body).forEach(
      (keys) => (logginedInUser[keys] = req.body[keys])
    );

    await logginedInUser.save();

    res.json({
      message: `${logginedInUser.firstName} updated sucessfully`,
      data: logginedInUser,
    });
  } catch (error) {
    res.send("Error " + error.message);
  }
});

router.patch("/profile/update/password", userAuth, async (req, res) => {
  try {
    const allowed = ["newPassword", "confirmedPassword"];
    if (!Object.keys(req.body).every((keys) => allowed.includes(keys))) {
      throw new Error("Only passwords are allowed");
    }

    const { newPassword, confirmedPassword } = req.body;

    if (newPassword !== confirmedPassword) {
      throw new Error("passwords are not matching");
    }

    const logginedInUser = req.user;
    const hasedPassword = await bcrypt.hash(newPassword, 10);
    logginedInUser.password = hasedPassword;
    await logginedInUser.save();

    res.json({
      message: "Password updated sucuessfully",
      data: logginedInUser,
    });
  } catch (error) {
    console.log("Error " + error);
  }
});

module.exports = router;
