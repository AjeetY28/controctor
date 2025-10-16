const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/contractorController');

// all endpoints protected
router.post('/', auth, ctrl.createContractor);
router.get('/', auth, ctrl.getContractors);
router.get('/:id', auth, ctrl.getContractor);
router.put('/:id', auth, ctrl.updateContractor);
router.delete('/:id', auth, ctrl.deleteContractor);

router.patch('/:id/active', auth, ctrl.toggleActive); // body: { isActive: true/false }
router.post('/:id/advance', auth, ctrl.addAdvance);   // body: { amount: 1000, note: 'partial payment' }

module.exports = router;
