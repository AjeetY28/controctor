const mongoose = require('mongoose');

const advanceSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  note: { type: String },
  date: { type: Date, default: Date.now }
});

const contractorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String }, // optional contact
  phone: { type: String },
  salary: { type: Number, required: true }, // monthly salary or agreed amount
  advances: [advanceSchema], // list of advances paid
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// virtual to compute balance
contractorSchema.methods.getBalance = function() {
  const totalAdvance = (this.advances || []).reduce((s, a) => s + Number(a.amount || 0), 0);
  return Number(this.salary) - totalAdvance;
};

module.exports = mongoose.model('Contractor', contractorSchema);
