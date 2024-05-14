const mongoose = require('mongoose');

const connectDb = () => {
    const uri = process.env.MONGO_URI;
    mongoose.connect(uri);
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose.connection.once("open", () => {
      console.log("MongoDB connected");
    });
}

module.exports = connectDb;