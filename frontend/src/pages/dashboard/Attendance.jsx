/**
 * Attendance Page Component
 * Attendance tracking and management
 */

import { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { attendanceService } from '@/services/attendanceService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const Attendance = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [marking, setMarking] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAttendance();
    checkTodayAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await attendanceService.getAll();
      // console.log(response.data)
      // const data = user?.role === 'Admin' 
      //   ? response.data 
      //   : response.data.filter(a => a.user._id === user._id || a.user === user._id);
        setAttendance(response.data);
        // console.log(attendance)
    } catch (error) {
      toast.error('Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  const checkTodayAttendance = async () => {
    try {
      const response = await attendanceService.getToday();
      const today = response.data.find(a => 
        a.user._id === user._id || a.user === user._id
      );
      if (today) {
        setTodayAttendance(today);
      }
    } catch (error) {
      console.error('Error checking today attendance:', error);
    }
  };

  const markAttendance = async (type) => {
    setMarking(true);
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    try {
      const data = type === 'checkin' 
        ? { checkIn: time, date: new Date().toISOString() }
        : { checkOut: time };
      
      await attendanceService.mark(data);
      toast.success(`${type === 'checkin' ? 'Check-in' : 'Check-out'} successful`);
      checkTodayAttendance();
      fetchAttendance();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setMarking(false);
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
      <div>
        <h1 className="text-3xl dark:text-white font-bold text-gray-900">
          {user?.role === 'Admin' ? 'Attendance Management' : 'My Attendance'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Track and manage attendance records</p>
      </div>

      {/* Today's Attendance */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Today's Attendance
          </h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Check In</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {todayAttendance?.checkIn || '--:--'}
              </p>
              {!todayAttendance?.checkIn && (
                <button 
                  onClick={() => markAttendance('checkin')}
                  disabled={marking}
                  className="btn-primary mt-2"
                >
                  {marking ? 'Marking...' : 'Check In'}
                </button>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Check Out</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {todayAttendance?.checkOut || '--:--'}
              </p>
              {todayAttendance?.checkIn && !todayAttendance?.checkOut && (
                <button 
                  onClick={() => markAttendance('checkout')}
                  disabled={marking}
                  className="btn-secondary mt-2"
                >
                  {marking ? 'Marking...' : 'Check Out'}
                </button>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {todayAttendance?.checkIn ? 'Present' : 'Not Marked'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Attendance History
          </h3>
        </div>
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th>Date</th>
                  {user?.role === 'Admin' && <th>Employee</th>}
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Working Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {attendance.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((record) => (
                  <tr key={record._id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    {user?.role === 'Admin' && <td>{record.user?.name || 'N/A'}</td>}
                    <td>{record.checkIn}</td>
                    <td>{record.checkOut}</td>
                    <td>{record.workingHours}h</td>
                    <td>
                      <span className={`badge ${
                        record.status === 'Present' ? 'badge-success' :
                        record.status === 'Late' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {attendance.length > itemsPerPage && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, attendance.length)} of {attendance.length} entries
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
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(attendance.length / itemsPerPage), p + 1))}
                  disabled={currentPage >= Math.ceil(attendance.length / itemsPerPage)}
                  className="btn-secondary px-3 py-1 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;