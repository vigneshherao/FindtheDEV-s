const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://vignesh:MSzA7aS1uoI44alb@cluster0.ao1473g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/findTheDev"
  );
};

module.exports = connectDb;
