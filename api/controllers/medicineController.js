const Medicine = require('../models/medicine');

// @desc    Get all medicines for user
// @route   GET /api/medicines
// @access  Private
const getMedicines = async (req, res, next) => {
  try {
    const { isActive } = req.query;
    const filter = { user: req.user.id };
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const medicines = await Medicine.find(filter).sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single medicine
// @route   GET /api/medicines/:id
// @access  Private
const getMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ 
        success: false,
        message: 'Medicine not found' 
      });
    }

    // Check ownership
    if (medicine.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to access this medicine' 
      });
    }

    res.status(200).json({
      success: true,
      data: medicine
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new medicine
// @route   POST /api/medicines
// @access  Private
const createMedicine = async (req, res, next) => {
  try {
    const medicineData = {
      ...req.body,
      user: req.user.id
    };

    const medicine = await Medicine.create(medicineData);

    res.status(201).json({
      success: true,
      data: medicine
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update medicine
// @route   PUT /api/medicines/:id
// @access  Private
const updateMedicine = async (req, res, next) => {
  try {
    let medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ 
        success: false,
        message: 'Medicine not found' 
      });
    }

    // Check ownership
    if (medicine.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this medicine' 
      });
    }

    medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: medicine
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete medicine
// @route   DELETE /api/medicines/:id
// @access  Private
const deleteMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ 
        success: false,
        message: 'Medicine not found' 
      });
    }

    // Check ownership
    if (medicine.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this medicine' 
      });
    }

    await medicine.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Medicine deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log medicine intake
// @route   POST /api/medicines/:id/log
// @access  Private
const logMedicineIntake = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ 
        success: false,
        message: 'Medicine not found' 
      });
    }

    // Check ownership
    if (medicine.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to log this medicine' 
      });
    }

    const { date, time, taken, skipped, note } = req.body;

    medicine.logs.push({ date, time, taken, skipped, note });

    // Update inventory if taken
    if (taken && medicine.inventory.current > 0) {
      medicine.inventory.current -= 1;
    }

    await medicine.save();

    res.status(200).json({
      success: true,
      data: medicine
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update medicine inventory
// @route   PUT /api/medicines/:id/inventory
// @access  Private
const updateInventory = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ 
        success: false,
        message: 'Medicine not found' 
      });
    }

    // Check ownership
    if (medicine.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this medicine' 
      });
    }

    const { current, alertThreshold } = req.body;

    if (current !== undefined) {
      medicine.inventory.current = current;
    }
    if (alertThreshold !== undefined) {
      medicine.inventory.alertThreshold = alertThreshold;
    }

    await medicine.save();

    res.status(200).json({
      success: true,
      data: medicine
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get medicine statistics
// @route   GET /api/medicines/:id/stats
// @access  Private
const getMedicineStats = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ 
        success: false,
        message: 'Medicine not found' 
      });
    }

    // Check ownership
    if (medicine.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to view this medicine' 
      });
    }

    const totalLogs = medicine.logs.length;
    const takenCount = medicine.logs.filter(log => log.taken).length;
    const skippedCount = medicine.logs.filter(log => log.skipped).length;
    const adherenceRate = totalLogs > 0 ? (takenCount / totalLogs) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        totalLogs,
        takenCount,
        skippedCount,
        adherenceRate: adherenceRate.toFixed(2),
        currentInventory: medicine.inventory.current,
        inventoryAlert: medicine.inventory.current <= medicine.inventory.alertThreshold
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMedicines,
  getMedicine,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  logMedicineIntake,
  updateInventory,
  getMedicineStats
};