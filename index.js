const express = require("express");
const app = express();
const port = 7999;
const connectDb = require("./config/database");
const userModel = require("./models/userModel");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

app.get("/user", async (req, res) => {
  try {
    const data = await userModel.find({});
    const { token } = req.cookies;
    const decoded = await jwt.verify(token, "vignesh@2019");
    console.log(decoded);
    const loginedUser = await userModel.findById({ _id: decoded._id });
    res.send(loginedUser);
  } catch (error) {
    console.log("err in getting data" + error.message);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw new Error("Please Check your mail!");
    }

    const isValid = bcrypt.compare(password, user?.password);
    if (!isValid) {
      throw new Error("Password is incorrect!");
    }
    const token = await jwt.sign({ _id: user._id }, "vignesh@2019");
    res.cookie("token", token);
    res.send("user loggined sucessfully");
  } catch (error) {
    res.status(500).send({ message: "Login Issue", error: error.message });
  }
});

app.post("/user", async (req, res) => {
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

app.delete("/user", async (req, res) => {
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

app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params?.userID;
    const data = req.body;
    const isAllowed = ["firstName", "lastName", "phone", "age"];
    const isUpdated = Object.keys(data).every((k) => isAllowed.includes(k));
    if (data.phone > 10) {
      throw new Error("This is not add extra number exceeding 10");
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

app.use("/", (err, req, res) => {
  res.status(400).send("something went wrong " + err);
});

connectDb()
  .then(() => {
    console.log("connected to the mongodb database");
    app.listen(port, () => {
      console.log("The connect is sucessfull with port " + port);
    });
  })
  .catch((err) => {
    console.log("connection error in database");
  });
