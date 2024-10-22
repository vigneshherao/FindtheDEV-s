const express = require("express");
const app = express();
const port = 7999;
const connectDb = require("./config/database");
const cookieParser = require("cookie-parser");

//Routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");

//middleware
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);

//Error Handling middleware
app.use((err, req, res, next) => {
  res.status(400).send("Something went wrong: " + err.message);
});

//Connection string for the middle ware

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
