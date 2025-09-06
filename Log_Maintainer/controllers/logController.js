const Log = require('../models/log');

// Get all logs
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get log by ID
exports.getLogById = async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);
    if (!log) return res.status(404).json({ error: 'Log not found' });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new log
exports.createLog = async (req, res) => {
  try {
    const { message, level, meta } = req.body;
    const log = new Log({ message, level, meta });
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update log
exports.updateLog = async (req, res) => {
  try {
    const { message, level, meta } = req.body;
    const log = await Log.findByIdAndUpdate(
      req.params.id,
      { message, level, meta },
      { new: true }
    );
    if (!log) return res.status(404).json({ error: 'Log not found' });
    res.json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete log
exports.deleteLog = async (req, res) => {
  try {
    const log = await Log.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ error: 'Log not found' });
    res.json({ message: 'Log deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
