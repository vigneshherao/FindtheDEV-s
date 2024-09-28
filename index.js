const express = require("express");
const app = express();
const port = 7999;
const connectDb = require("./config/database");

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
