const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://pskaushal88:4wW8mLTq8bqfJb67@namastenode.g5n4p.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
