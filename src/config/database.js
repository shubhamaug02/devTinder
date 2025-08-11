const mongoose = require('mongoose');

const connectDB = async () => {
    // console.log(process.env);
    await mongoose.connect(process.env.DATABASE_CONNECTION_SECRET);
}

module.exports = connectDB;