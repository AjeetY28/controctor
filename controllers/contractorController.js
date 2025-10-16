const Contractor = require('../models/Contractor');

const createContractor = async (req, res) => {
  try {
    const { name, email, phone, salary } = req.body;
    if (!name || salary == null) return res.status(400).json({ message: 'name and salary required' });

    const c = new Contractor({ name, email, phone, salary });
    await c.save();
    res.status(201).json(c);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getContractors = async (req, res) => {
  try {
    const list = await Contractor.find();
    // compute balance for each
    const result = list.map(c => ({
      id: c._id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      salary: c.salary,
      isActive: c.isActive,
      advances: c.advances,
      balance: c.getBalance()
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getContractor = async (req, res) => {
  try {
    const c = await Contractor.findById(req.params.id);
    if (!c) return res.status(404).json({ message: 'Not found' });
    res.json({ ...c.toObject(), balance: c.getBalance() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateContractor = async (req, res) => {
  try {
    const c = await Contractor.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!c) return res.status(404).json({ message: 'Not found' });
    res.json({ ...c.toObject(), balance: c.getBalance() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteContractor = async (req, res) => {
  try {
    const c = await Contractor.findByIdAndDelete(req.params.id);
    if (!c) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const toggleActive = async (req, res) => {
  try {
    const c = await Contractor.findById(req.params.id);
    if (!c) return res.status(404).json({ message: 'Not found' });
    c.isActive = !!req.body.isActive; // expect { isActive: true/false }
    await c.save();
    res.json({ message: 'Updated', isActive: c.isActive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addAdvance = async (req, res) => {
  try {
    const { amount, note } = req.body;
    if (amount == null || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    const c = await Contractor.findById(req.params.id);
    if (!c) return res.status(404).json({ message: 'Not found' });

    c.advances.push({ amount, note });
    await c.save();
    res.json({ message: 'Advance added', balance: c.getBalance(), advances: c.advances });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createContractor,
  getContractors,
  getContractor,
  updateContractor,
  deleteContractor,
  toggleActive,
  addAdvance
};
