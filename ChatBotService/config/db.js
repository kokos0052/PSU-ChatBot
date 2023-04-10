const mongoose = require("mongoose");

async function connectDB() {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB connected: ${connect.connection.host}`);
    } catch (err) {
        console.log(`Error: ${err.message}`);
        process.exit();
    }
}

module.exports = connectDB;