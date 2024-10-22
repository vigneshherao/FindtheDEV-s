const express = require("express");

const validateData = (req) => {
  const allowedData = ["firstName", "lastName", "phone", "age", "intrest"];

  const isTrue = Object.keys(req.body).every((field) =>
    allowedData.includes(field)
  );

  return isTrue;
};

module.exports = {
  validateData,
};
