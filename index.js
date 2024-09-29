const express = require("express");
const app = express();
const port = 7999;
const connectDb = require("./config/database");
const userModel = require("./models/userModel");

app.use(express.json());

app.get("/user", async (req, res) => {
  try {
    const data = await userModel.find({});
    res.send(data);
  } catch (error) {
    console.log("err in getting data");
  }
});

app.post("/user", async (req, res) => {
  try {
    const user = new userModel(req.body);
    await user.save();

    res.send("user added sucessfully");
  } catch (error) {
    console.log("something error on adding user", error);
  }
});

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const data = await userModel.findByIdAndDelete(userId);
    res.send("user is deleted");
  } catch (error) {
    console.log("err in getting data");
  }
});

app.patch("/user", async (req, res) => {
  try {
    const { userId, ...data } = req.body;
    const updated = await userModel.findOneAndUpdate(
      { _id: userId },
      { $set: { ...data } }
    );
    res.send("updated");
  } catch (error) {
    console.log(error);
  }
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
