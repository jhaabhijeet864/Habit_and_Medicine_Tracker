const Habit = require('../models/habit');

// @desc    Get all habits for user
// @route   GET /api/habits
// @access  Private
const getHabits = async (req, res, next) => {
  try {
    const { isActive } = req.query;
    const filter = { user: req.user.id };
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const habits = await Habit.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: habits.length,
      data: habits
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single habit
// @route   GET /api/habits/:id
// @access  Private
const getHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ 
        success: false,
        message: 'Habit not found' 
      });
    }

    // Check ownership
    if (habit.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to access this habit' 
      });
    }

    res.status(200).json({
      success: true,
      data: habit
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new habit
// @route   POST /api/habits
// @access  Private
const createHabit = async (req, res, next) => {
  try {
    const habitData = {
      ...req.body,
      user: req.user.id
    };

    const habit = await Habit.create(habitData);

    res.status(201).json({
      success: true,
      data: habit
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update habit
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = async (req, res, next) => {
  try {
    let habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ 
        success: false,
        message: 'Habit not found' 
      });
    }

    // Check ownership
    if (habit.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this habit' 
      });
    }

    habit = await Habit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: habit
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete habit
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ 
        success: false,
        message: 'Habit not found' 
      });
    }

    // Check ownership
    if (habit.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this habit' 
      });
    }

    await habit.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Habit deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log habit completion
// @route   POST /api/habits/:id/log
// @access  Private
const logHabitCompletion = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ 
        success: false,
        message: 'Habit not found' 
      });
    }

    // Check ownership
    if (habit.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to log this habit' 
      });
    }

    const { date, completed, note } = req.body;

    // Check if already logged for this date
    const existingLog = habit.completions.find(
      log => new Date(log.date).toDateString() === new Date(date).toDateString()
    );

    if (existingLog) {
      existingLog.completed = completed;
      existingLog.note = note || existingLog.note;
    } else {
      habit.completions.push({ date, completed, note });
    }

    // Update streak
    if (completed) {
      habit.streak.current += 1;
      if (habit.streak.current > habit.streak.longest) {
        habit.streak.longest = habit.streak.current;
      }
    } else {
      habit.streak.current = 0;
    }

    await habit.save();

    res.status(200).json({
      success: true,
      data: habit
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get habit statistics
// @route   GET /api/habits/:id/stats
// @access  Private
const getHabitStats = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ 
        success: false,
        message: 'Habit not found' 
      });
    }

    // Check ownership
    if (habit.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to view this habit' 
      });
    }

    const totalDays = habit.completions.length;
    const completedDays = habit.completions.filter(c => c.completed).length;
    const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        totalDays,
        completedDays,
        completionRate: completionRate.toFixed(2),
        currentStreak: habit.streak.current,
        longestStreak: habit.streak.longest
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHabits,
  getHabit,
  createHabit,
  updateHabit,
  deleteHabit,
  logHabitCompletion,
  getHabitStats
};