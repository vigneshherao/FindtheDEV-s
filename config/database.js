const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://vigneshfornavy:nz3zbQZApX9aAWy8@mernprojects.ga7ko.mongodb.net/findTheDev?retryWrites=true&w=majority&appName=MERNPROJECTS"
  );
};

module.exports = connectDb;
