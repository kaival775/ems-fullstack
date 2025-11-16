import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { employeeService } from '@/services/employeeService';
import { departmentService } from '@/services/departmentService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';
import DepartmentForm from './DepartmentForm';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Departments = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departmentData, setDepartmentData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDepartments();
    fetchStats();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAll();
      setDepartments(response.data);
    } catch (error) {
      toast.error('Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const empResponse = await employeeService.getAll();
      const deptCounts = {};
      empResponse.data.forEach((emp) => {
        const deptName = emp.department?.name || 'Unassigned';
        deptCounts[deptName] = (deptCounts[deptName] || 0) + 1;
      });

      const chartData = Object.entries(deptCounts).map(([name, value]) => ({
        name,
        value,
      }));

      setDepartmentData(chartData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreate = () => {
    setSelectedDepartment(null);
    setShowModal(true);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    try {
      await departmentService.delete(id);
      toast.success('Department deleted successfully');
      fetchDepartments();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete department');
    }
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (selectedDepartment) {
        await departmentService.update(selectedDepartment._id, data);
        toast.success('Department updated successfully');
      } else {
        await departmentService.create(data);
        toast.success('Department created successfully');
      }
      setShowModal(false);
      fetchDepartments();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
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
            Departments
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage departments</p>
        </div>
        {user?.role === "Admin" && (
          <button
            onClick={handleCreate}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Department</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Department Distribution
            </h3>
          </div>
          <div className="card-body h-[470px]">
            {departmentData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height={departmentData.length * 40 + 60}
              >
                <BarChart
                  data={departmentData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="dark:opacity-20"
                  />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={110}
                    tick={{ fontSize: 12 }}
                    interval={0}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgb(24 24 27 / 0.8)",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {departmentData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          [
                            "#3b82f6",
                            "#10b981",
                            "#f59e0b",
                            "#ef4444",
                            "#8b5cf6",
                            "#ec4899",
                            "#06b6d4",
                            "#84cc16",
                            "#f97316",
                            "#a855f7",
                          ][index % 10]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No department data available
              </p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              All Departments
            </h3>
          </div>
          <div className="card-body h-[470px] overflow-y-scroll ">
            <div className="space-y-3">
              {departments.map((dept) => (
                <div key={dept._id}>
                  <Link to={`/dashboard/department/${dept._id}`}>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800/70 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Building2 className="h-5 w-5 text-primary-600" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {dept.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {dept.description || "No description"}
                          </p>
                          {dept.manager && (
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              Manager: {dept.manager.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                  {user?.role === "Admin" && (
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleEdit(dept);
                        }}
                        className="btn-secondary text-xs px-2 py-1"
                      >
                        <Edit className="h-3 w-3 inline mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(dept._id);
                        }}
                        className="btn-danger text-xs px-2 py-1"
                      >
                        <Trash2 className="h-3 w-3 inline mr-1" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedDepartment ? "Edit Department" : "Add New Department"}
      >
        <DepartmentForm
          department={selectedDepartment}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default Departments;