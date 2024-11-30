const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(
            'mongodb+srv://1234567890:1234567890@cluster0.xeaub.mongodb.net/test/certificates',
        );
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        // process.exit(1);
    }
};

module.exports = connectDB;
