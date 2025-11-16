/**
 * Leaves Page Component
 * Leave management for employees and admins
 */

import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';
import ApplyLeaveForm from './ApplyLeaveForm';
import { leaveService } from '@/services/leaveService';
import toast from 'react-hot-toast';

const Leaves = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await leaveService.getAll();
      setLeaves(response.data);
    } catch (error) {
      toast.error('Failed to fetch leaves');
    } finally {
      setLoading(false);
    }
  };

  const totalLeaves = leaves.length;
  const approvedCount = leaves.filter(l => l.status === 'Approved').length;
  const pendingCount = leaves.filter(l => l.status === 'Pending').length;

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await leaveService.create(data);
      toast.success('Leave request submitted successfully');
      setShowModal(false);
      fetchLeaves();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit leave');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await leaveService.updateStatus(id, { status });
      toast.success(`Leave ${status.toLowerCase()} successfully`);
      fetchLeaves();
    } catch (error) {
      toast.error('Failed to update leave status');
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
            {user?.role === "Admin" ? "Leave Requests" : "My Leaves"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage leave applications and requests
          </p>
        </div>
        {user?.role === "Employee" && (
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Apply for Leave</span>
          </button>
        )}
      </div>

      {/* Leave Balance (for employees) */}
      {user?.role === "Employee" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="card-body text-center">
              <Calendar className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Leaves
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {totalLeaves}
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <Clock className="h-8 w-8 text-success-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Approved
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {approvedCount}
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <Calendar className="h-8 w-8 text-warning-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pending
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {pendingCount}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Leave Requests Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {user?.role === "Admin" ? "All Leave Requests" : "My Leave History"}
          </h3>
        </div>
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  {user?.role === "Admin" && <th>Employee</th>}
                  <th>Type</th>
                  <th>From Date</th>
                  <th>To Date</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Applied Date</th>
                  {user?.role === "Admin" && <th>Actions</th>}
                </tr>
              </thead>
              <tbody className="table-body">
                {leaves.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((leave) => (
                  <tr key={leave._id}>
                    {user?.role === "Admin" && <td>{leave.user?.name || 'N/A'}</td>}
                    <td>{leave.leaveType}</td>
                    <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                    <td>{leave.totalDays}</td>
                    <td className="max-w-xs truncate">{leave.reason}</td>
                    <td>
                      <span
                        className={`badge ${
                          leave.status === "Approved"
                            ? "badge-success"
                            : leave.status === "Rejected"
                            ? "badge-danger"
                            : "badge-warning"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td>{new Date(leave.createdAt).toLocaleDateString()}</td>
                    {user?.role === "Admin" && (
                      <td>
                        {leave.status === "Pending" && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleStatusUpdate(leave._id, "Approved")
                              }
                              className="btn-primary text-xs px-2 py-1"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(leave._id, "Rejected")
                              }
                              className="btn-danger text-xs px-2 py-1"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {leaves.length > itemsPerPage && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, leaves.length)} of {leaves.length} entries
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
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(leaves.length / itemsPerPage), p + 1))}
                  disabled={currentPage >= Math.ceil(leaves.length / itemsPerPage)}
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
        title="Apply for Leave"
      >
        <ApplyLeaveForm
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default Leaves;