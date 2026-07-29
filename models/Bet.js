const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  gameType: { type: String, required: true }, // 'sportsbook', 'aviator', 'keno'
  stake: { type: Number, required: true },
  odds: { type: Number, required: true },
  potentialPayout: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'won', 'lost'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bet', betSchema);