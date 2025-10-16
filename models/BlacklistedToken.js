const mongoose = require('mongoose');

const blSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true }
});

blSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // auto-remove expired docs

module.exports = mongoose.model('BlacklistedToken', blSchema);
