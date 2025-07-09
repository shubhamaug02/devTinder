const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://mongodbUser:t62Gw5sgWk6PHqzZ@mongodb-learning.b7e06wz.mongodb.net/devTinder");
}

module.exports = connectDB;