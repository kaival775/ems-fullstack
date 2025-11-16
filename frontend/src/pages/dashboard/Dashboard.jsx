/**
 * Dashboard Page Component
 * Main dashboard with statistics and overview
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { employeeService } from '@/services/employeeService';
import { attendanceService } from '@/services/attendanceService';
import { leaveService } from '@/services/leaveService';
import { departmentService } from '@/services/departmentService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [attendanceTrend, setAttendanceTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      if (user?.role === 'Admin') {
        const [empStats, attStats, attResponse, leaveResponse] = await Promise.all([
          employeeService.getStats(),
          attendanceService.getStats(),
          attendanceService.getAll(),
          leaveService.getAll()
        ]);
        
        // Generate attendance trend for last 7 days
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          const dayAttendance = attResponse.data.filter(a => 
            new Date(a.date).toDateString() === date.toDateString()
          );
          last7Days.push({
            day: dayName,
            present: dayAttendance.filter(a => a.status === 'Present').length,
            late: dayAttendance.filter(a => a.status === 'Late').length,
            absent: empStats.data.totalEmployees - dayAttendance.length
          });
        }
        setAttendanceTrend(last7Days);
        
        const pendingLeaves = leaveResponse.data.filter(l => l.status === 'Pending').length;
        
        setStats({
          totalEmployees: empStats.data.totalEmployees,
          presentToday: attStats.data.presentToday,
          activeEmployees: empStats.data.activeEmployees,
          pendingLeaves,
          totalDepartments: 10,
          attendanceRate: attStats.data.attendanceRate || 0
        });
      } else {
        const [attResponse, leaveResponse] = await Promise.all([
          attendanceService.getAll(),
          leaveService.getAll()
        ]);
        const myAttendance = attResponse.data.filter(a => a.user._id === user._id || a.user === user._id);
        const myLeaves = leaveResponse.data;
        
        // My attendance trend
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          const dayAtt = myAttendance.find(a => 
            new Date(a.date).toDateString() === date.toDateString()
          );
          last7Days.push({
            day: dayName,
            status: dayAtt ? 1 : 0
          });
        }
        setAttendanceTrend(last7Days);
        
        setStats({
          attendance: myAttendance.length,
          leaveBalance: myLeaves.length,
          approved: myLeaves.filter(l => l.status === 'Approved').length,
          pending: myLeaves.filter(l => l.status === 'Pending').length
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
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

  const StatCard = ({ icon: Icon, title, value, color = 'primary' }) => (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          </div>
          <div className={`h-12 w-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 ">
      <div>
        <h1 className="text-2xl dark:text-white font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of your employee management system
        </p>
      </div>
      {user?.role === "Employee" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <button
                onClick={() => navigate("/dashboard/attendance")}
                className="w-full btn-secondary text-left flex items-center space-x-3 py-4"
              >
                <Clock className="h-5 w-5" />
                <span>Mark Attendance</span>
              </button>
              <button
                onClick={() => navigate("/dashboard/leaves")}
                className="w-full btn-secondary text-left flex items-center space-x-3 py-4"
              >
                <Calendar className="h-5 w-5" />
                <span>Apply for Leave</span>
              </button>
              <button
                onClick={() => navigate("/dashboard/salaries")}
                className="w-full btn-secondary text-left flex items-center space-x-3 py-4"
              >
                <TrendingUp className="h-5 w-5" />
                <span>View Salary</span>
              </button>
            </div>
      )}

      {user?.role === "Admin" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <button
            onClick={() => navigate("/dashboard/employees")}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="card-body text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-primary-600" />
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                Employees
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage team
              </p>
            </div>
          </button>
          <button
            onClick={() => navigate("/dashboard/departments")}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="card-body text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 text-success-600" />
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                Departments
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View all
              </p>
            </div>
          </button>
          <button
            onClick={() => navigate("/dashboard/leaves")}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="card-body text-center">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-warning-600" />
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                Leaves
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Approve requests
              </p>
            </div>
          </button>
          <button
            onClick={() => navigate("/dashboard/salaries")}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="card-body text-center">
              <Clock className="h-12 w-12 mx-auto mb-3 text-danger-600" />
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                Salaries
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Process payroll
              </p>
            </div>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {user?.role === "Admin"
                ? "Attendance Trend (Last 7 Days)"
                : "My Attendance (Last 7 Days)"}
            </h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              {user?.role === "Admin" ? (
                <AreaChart
                  data={attendanceTrend}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorPresent"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorLate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="dark:opacity-20"
                  />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="present"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorPresent)"
                    name="Present"
                  />
                  <Area
                    type="monotone"
                    dataKey="late"
                    stroke="#f59e0b"
                    fillOpacity={1}
                    fill="url(#colorLate)"
                    name="Late"
                  />
                </AreaChart>
              ) : (
                <LineChart
                  data={attendanceTrend}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="dark:opacity-20"
                  />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 1]} ticks={[0, 1]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="status"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Attendance"
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {user?.role === "Admin" ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <StatCard
              icon={Users}
              title="Total Employees"
              value={stats?.totalEmployees}
              color="primary"
            />
            <StatCard
              icon={Clock}
              title="Present Today"
              value={stats?.presentToday}
              color="success"
            />
            <StatCard
              icon={Calendar}
              title="Pending Leaves"
              value={stats?.pendingLeaves}
              color="warning"
            />
            <StatCard
              icon={TrendingUp}
              title="Attendance Rate"
              value={`${stats?.attendanceRate}%`}
              color="primary"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <StatCard
              icon={Clock}
              title="Total Attendance"
              value={stats?.attendance}
              color="success"
            />
            <StatCard
              icon={Calendar}
              title="Total Leaves"
              value={stats?.leaveBalance}
              color="primary"
            />
            <StatCard
              icon={TrendingUp}
              title="Approved Leaves"
              value={stats?.approved}
              color="success"
            />
            <StatCard
              icon={Users}
              title="Pending Leaves"
              value={stats?.pending}
              color="warning"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;