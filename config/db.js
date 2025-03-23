const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Is Connecting");
  } catch (error) {
    console.log(error);
    
  }
};

module.exports = connectToDB