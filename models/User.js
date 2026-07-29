const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 1000.0 }, // Initial demo balance
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);