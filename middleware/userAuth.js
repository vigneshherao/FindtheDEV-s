const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const decodedObj = await jwt.verify(token, "vignesh@2019");
    const user = await userModel.findById({ _id: decodedObj._id });
    console.log("hai");

    if (!user) {
      throw new Error("User is not authenicated");
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(404).send("error while verifing user :" + error);
  }
};

module.exports = userAuth;
