import Salary from '../models/Salary.js';

export const getAllSalaries = async (req, res) => {
  try {
    const query = req.user.role === 'Admin' ? {} : { user: req.user._id };
    const salaries = await Salary.find(query)
      .populate('user', 'name email')
      .sort({ year: -1, month: -1 });
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSalary = async (req, res) => {
  try {
    const{basicSalary,
  allowances,
  deductions,
  bonus} = req.body;
    const netSalary = (basicSalary + allowances + bonus) - deductions;
    const salary = await Salary.create({...req.body, netSalary:netSalary});
    res.status(201).json(salary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSalaryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const salary = await Salary.findByIdAndUpdate(
      req.params.id,
      { status, paidDate: status === 'Paid' ? Date.now() : null },
      { new: true }
    );
    if (!salary) return res.status(404).json({ message: 'Salary not found' });
    res.json(salary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSalary = async (req, res) => {
  try {
    const salary = await Salary.findByIdAndDelete(req.params.id);
    if (!salary) return res.status(404).json({ message: 'Salary not found' });
    res.json({ message: 'Salary deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
