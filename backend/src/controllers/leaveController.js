import Leave from '../models/Leave.js';

// Get all leaves (admin) or user's leaves
export const getAllLeaves = async (req, res) => {
  try {
    const query = req.user.role === 'Admin' ? {} : { user: req.user._id };
    const leaves = await Leave.find(query)
      .populate('user', 'name email')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create leave request
export const createLeave = async (req, res) => {
  try {
    const leave = await Leave.create({
      ...req.body,
      user: req.user._id
    });
    res.status(201).json(leave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update leave status (admin only)
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        status,
        approvedBy: req.user._id,
        approvedDate: Date.now(),
        rejectionReason
      },
      { new: true }
    );
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    res.json(leave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete leave
export const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    res.json({ message: 'Leave deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
