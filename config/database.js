const mongoose = require("mongoose");
// "mongodb+srv://vigneshfornavy:nz3zbQZApX9aAWy8@mernprojects.ga7ko.mongodb.net/findTheDev?retryWrites=true&w=majority&appName=MERNPROJECTS"
const connectDb = async () => {
  await mongoose.connect("mongodb://localhost:27017");
};

module.exports = connectDb;
