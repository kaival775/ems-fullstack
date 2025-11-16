import { useState, useEffect } from 'react';
import { Plus, DollarSign } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';
import SalaryForm from './SalaryForm';
import { salaryService } from '@/services/salaryService';
import toast from 'react-hot-toast';

const Salaries = () => {
  const { user } = useAuth();
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      const response = await salaryService.getAll();
      setSalaries(response.data);
    } catch (error) {
      toast.error('Failed to fetch salaries');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await salaryService.create(data);
      toast.success('Salary record created successfully');
      setShowModal(false);
      fetchSalaries();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create salary');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await salaryService.updateStatus(id, { status });
      toast.success(`Salary marked as ${status.toLowerCase()}`);
      fetchSalaries();
    } catch (error) {
      toast.error('Failed to update salary status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl dark:text-white font-bold text-gray-900">
            {user?.role === "Admin" ? "Salary Management" : "My Salary"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage salary records
          </p>
        </div>
        {user?.role === "Admin" && (
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Salary</span>
          </button>
        )}
      </div>

      {user?.role === "Employee" && salaries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="card-body text-center">
              <DollarSign className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Paid
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ₹
                {salaries
                  .filter((s) => s.status === "Paid")
                  .reduce((sum, s) => sum + s.netSalary, 0)}
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <DollarSign className="h-8 w-8 text-warning-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pending
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ₹
                {salaries
                  .filter((s) => s.status === "Pending")
                  .reduce((sum, s) => sum + s.netSalary, 0)}
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <DollarSign className="h-8 w-8 text-success-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last Month
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ₹{salaries[0]?.netSalary || 0}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {user?.role === "Admin"
              ? "All Salary Records"
              : "My Salary History"}
          </h3>
        </div>
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  {user?.role === "Admin" && <th>Employee</th>}
                  <th>Month/Year</th>
                  <th>Basic</th>
                  <th>Allowances</th>
                  <th>Deductions</th>
                  <th>Bonus</th>
                  <th>Net Salary</th>
                  <th>Status</th>
                  {user?.role === "Admin" && <th>Paid Date</th>}
                  {user?.role === "Admin" && salaries.status !== "paid" && <th>Actions</th>}
                </tr>
              </thead>
              <tbody className="table-body">
                {salaries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((salary) => (
                  <tr key={salary._id}>
                    {user?.role === "Admin" && <td>{salary.user?.name}</td>}
                    <td>
                      {salary.month} / {salary.year}
                    </td>
                    <td>₹{salary.basicSalary}</td>
                    <td>₹{salary.allowances}</td>
                    <td>₹{salary.deductions}</td>
                    <td>₹{salary.bonus}</td>
                    <td className="font-bold">₹{salary.netSalary}</td>
                    <td>
                      <span
                        className={`badge ${
                          salary.status === "Paid"
                            ? "badge-success"
                            : salary.status === "Cancelled"
                            ? "badge-danger"
                            : "badge-warning"
                        }`}
                      >
                        {salary.status}
                      </span>
                    </td>
                    {user?.role === "Admin" && (
                      <td>
                        {salary.status === "Paid" && salary.paidDate
                          ? new Date(salary.paidDate).toLocaleDateString()
                          : "-"}
                      </td>
                    )}
                    {user?.role === "Admin" && (
                      <td>
                        {salary.status === "Pending" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(salary._id, "Paid")
                            }
                            className="btn-primary text-xs px-2 py-1"
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {salaries.length > itemsPerPage && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, salaries.length)} of {salaries.length} entries
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="btn-secondary px-3 py-1 text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(salaries.length / itemsPerPage), p + 1))}
                  disabled={currentPage >= Math.ceil(salaries.length / itemsPerPage)}
                  className="btn-secondary px-3 py-1 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Salary Record"
      >
        <SalaryForm
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default Salaries;
