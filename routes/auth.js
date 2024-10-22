const express = require("express");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw new Error("Please Check your mail!");
    }

    const isValid = user.comparePassword(password);
    if (!isValid) {
      throw new Error("Password is incorrect!");
    }

    const token = await user.getJwt();
    console.log(token);
    res.cookie("token", token, { expires: new Date(Date.now() + 8 + 900000) });
    res.send("user loggined sucessfully");
  } catch (error) {
    res.status(500).send({ message: "Login Issue", error: error.message });
  }
});

router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, phone, password, age } = req.body;
  try {
    const hasedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({
      firstName,
      lastName,
      email,
      phone,
      password: hasedPassword,
      age,
    });
    await user.save();
    res.send("user added sucessfully");
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error adding user", error: error.message });
  }
});

router.post("/logout", (req, res) => {
  try {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("logout done");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
