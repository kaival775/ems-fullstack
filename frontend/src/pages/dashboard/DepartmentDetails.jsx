import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, DollarSign, TrendingUp, Mail, Phone } from 'lucide-react';
import { departmentService } from '@/services/departmentService';
import { employeeService } from '@/services/employeeService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const DepartmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartmentDetails();
  }, [id]);

  const fetchDepartmentDetails = async () => {
    try {
      const deptId = id.replace(':', '');
      const [deptResponse, empResponse] = await Promise.all([
        departmentService.getById(deptId),
        employeeService.getAll()
      ]);
      
      setDepartment(deptResponse.data);
      console.log('Department ID from URL:', deptId);
      console.log('Total employees fetched:', empResponse.data.length);
      empResponse.data.forEach(e => {
        const deptId = typeof e.department === 'object' ? e.department._id : e.department;
        console.log('Employee:', e.name, 'Dept ID:', deptId);
      });
      const deptEmployees = empResponse.data.filter(emp => {
        const empDept = typeof emp.department === 'object' ? emp.department?._id : emp.department;
        const match = empDept === deptId;
        if (match) console.log('MATCH:', emp.name, empDept);
        return match;
      });
      console.log('Filtered employees for this dept:', deptEmployees.length);
      setEmployees(deptEmployees);

      const totalSalary = deptEmployees.reduce((sum, emp) => sum + emp.salary, 0);
      const avgSalary = deptEmployees.length > 0 ? totalSalary / deptEmployees.length : 0;
      const highestSalary = deptEmployees.length > 0 ? Math.max(...deptEmployees.map(e => e.salary)) : 0;
      const lowestSalary = deptEmployees.length > 0 ? Math.min(...deptEmployees.map(e => e.salary)) : 0;

      setStats({
        totalEmployees: deptEmployees.length,
        totalSalary,
        avgSalary,
        highestSalary,
        lowestSalary
      });
    } catch (error) {
      toast.error('Failed to fetch department details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!department) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Department not found</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/dashboard/departments')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl dark:text-white font-bold text-gray-900">{department.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">{department.description}</p>
        </div>
      </div>

      {department.manager && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Department Manager</h3>
          </div>
          <div className="card-body">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{department.manager.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{department.manager.position}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center">
                    <Mail className="h-3 w-3 mr-1" />
                    {department.manager.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body text-center">
            <Users className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Employees</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalEmployees}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <DollarSign className="h-8 w-8 text-success-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Salary</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">₹{stats.avgSalary.toFixed(0)}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <TrendingUp className="h-8 w-8 text-warning-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Highest Salary</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">₹{stats.highestSalary}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <DollarSign className="h-8 w-8 text-danger-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Lowest Salary</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">₹{stats.lowestSalary}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Department Employees</h3>
        </div>
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Salary</th>
                  <th>Join Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td className="font-medium">{emp.name}</td>
                    <td>{emp.position}</td>
                    <td>{emp.email}</td>
                    <td>{emp.phone}</td>
                    <td>₹{emp.salary}</td>
                    <td>{new Date(emp.joinDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${emp.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetails;
