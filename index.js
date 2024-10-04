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
