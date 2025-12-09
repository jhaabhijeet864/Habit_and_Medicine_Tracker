const express = require('express');
const router = express.Router();
const {
  getMedicines,
  getMedicine,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  logMedicineIntake,
  updateInventory,
  getMedicineStats
} = require('../controllers/medicineController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getMedicines)
  .post(createMedicine);

router.route('/:id')
  .get(getMedicine)
  .put(updateMedicine)
  .delete(deleteMedicine);

router.post('/:id/log', logMedicineIntake);
router.put('/:id/inventory', updateInventory);
router.get('/:id/stats', getMedicineStats);

module.exports = router;