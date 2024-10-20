const express = require("express");
const app = express();
const port = 7999;
const connectDb = require("./config/database");
const userModel = require("./models/userModel");
const cookieParser = require("cookie-parser");

const userAuth = require("./middleware/userAuth");

//Routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");

//middleware
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);

app.post("/addFriend", userAuth, (req, res) => {
  try {
    res.send(req.user.firstName + " Send you an requrest");
  } catch (error) {}
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
