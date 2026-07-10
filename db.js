const mongoose = require("mongoose");
const mongoUri = `mongodb://localhost:27017/inotebook`;

const connection = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected Successfully!!");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

module.exports = connection;
