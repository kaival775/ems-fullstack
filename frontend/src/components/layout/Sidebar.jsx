/**
 * Sidebar Component
 * Navigation sidebar for dashboard
 */

import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  Calendar, 
  User,
  DollarSign,
  Building2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const adminNavItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/dashboard/employees', icon: Users, label: 'Employees' },
    { to: '/dashboard/attendance', icon: Clock, label: 'Attendance' },
    { to: '/dashboard/leaves', icon: Calendar, label: 'Leave Requests' },
    { to: '/dashboard/salaries', icon: DollarSign, label: 'Salaries' },
    { to: '/dashboard/departments', icon: Building2, label: 'Departments'},
    { to: '/dashboard/profile', icon: User, label: 'Profile' },
  ];

  const employeeNavItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/dashboard/attendance', icon: Clock, label: 'My Attendance' },
    { to: '/dashboard/leaves', icon: Calendar, label: 'My Leaves' },
    { to: '/dashboard/salaries', icon: DollarSign, label: 'My Salary' },
    { to: '/dashboard/profile', icon: User, label: 'Profile' },
  ];

  const navItems = user?.role === 'Admin' ? adminNavItems : employeeNavItems;

  return (
    <div className="w-64 bg-white dark:bg-zinc-900 shadow-lg border-r border-gray-200 dark:border-zinc-800">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 flex items-center justify-center">
            <img src="/logo.png" alt="" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-zinc-100">EMS</h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400">Employee Management</p>
          </div>
        </div>
      </div>

      <nav className="px-4 pb-4">
        <ul className="space-y-2 dark:text-white">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
                }
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;