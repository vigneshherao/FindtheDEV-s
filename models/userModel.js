const mongoose = require("mongoose");
const { type } = require("os");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
    },
    lastName: {
      type: String,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return value.toString().length === 10;
        },
        message: "Phone number should be of length 10",
      },
    },
    age: {
      type: Number,
      min: 18,
      validate(value) {
        if (value.toString().length > 2) {
          throw new Error("age should be in two digits");
        }
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("give the correct mail format");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Give the Strong password");
        }
      },
    },
    intrest: {
      type: [String],
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJwt = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "vignesh@2019", {
    expiresIn: "1h",
  });
  console.log("this is " + token);
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  try {
    const user = this;
    const isValid = await bcrypt.compare(password, user?.password);
    return isValid;
  } catch (error) {
    console.log(error);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
