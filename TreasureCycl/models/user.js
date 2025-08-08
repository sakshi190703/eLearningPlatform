const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    username: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Buyer', 'Seller', 'Both'],default : 'Both',
        required: true
    },
    bio: String
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return candidatePassword === this.password;
};

module.exports = mongoose.model('User', userSchema);