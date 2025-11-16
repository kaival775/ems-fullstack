# Employee Management System (EMS)

A comprehensive full-stack Employee Management System built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring role-based access control, attendance tracking, leave management, salary processing, and department management.

## 🚀 Features

### Admin Features
- **Dashboard**: Overview with attendance trends, key metrics, and quick action cards
- **Employee Management**: Complete CRUD operations for employee records
- **Department Management**: Manage departments with automatic manager assignment and employee distribution visualization
- **Attendance Management**: Track and monitor employee attendance with detailed reports
- **Leave Management**: Approve/reject leave requests with status tracking
- **Salary Management**: Process payroll, manage salary records, and track payment status
- **Analytics**: Visual charts and statistics for better decision making

### Employee Features
- **Personal Dashboard**: View personal stats and quick actions
- **Attendance Tracking**: Mark check-in/check-out with automatic time recording
- **Leave Application**: Apply for leaves with date range selection
- **Salary Records**: View personal salary history and payment status
- **Profile Management**: Update personal information

### General Features
- **Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Role-Based Access Control**: Separate interfaces for Admin and Employee roles
- **Dark Mode**: Toggle between light and dark themes with zinc/black color scheme
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Real-time Updates**: Instant data synchronization across the application
- **Data Visualization**: Interactive charts using Recharts library

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **React Router DOM** for navigation
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Hook Form** for form handling
- **Framer Motion** for animations
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt.js** for password hashing
- **Express Validator** for input validation
- **CORS** for cross-origin requests
- **Helmet** for security headers
- **Morgan** for logging

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd EmployeeManagementSystem/ems-fullstack
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ems_database
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Running the Application

### Start MongoDB
```bash
mongod
```

### Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

## 🌱 Seeding Database

### Create Departments (Run First)
```bash
cd backend
node src/utils/seedDepartments.js
```
This creates 10 departments:
- Human Resources
- Finance
- Sales
- Marketing
- Engineering
- Product Management
- IT & Infrastructure
- Operations
- Admin / Office Management
- Research & Development (R&D)

### Seed All Data (Run After Departments)
```bash
node src/utils/seedAllData.js
```
This creates:
- 32 employees across all departments
- 15 days of attendance records
- 1-2 leave requests per employee
- 5 months of salary records (Jan-May 2025)

### Default Admin Account
```
Email: admin@company.com
Password: admin123
```

### Sample Employee Account
```
Email: rajesh.kumar@company.com
Password: employee123
```

## 📁 Project Structure

```
ems-fullstack/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js     # Authentication logic
│   │   │   ├── employeeController.js # Employee CRUD
│   │   │   ├── attendanceController.js
│   │   │   ├── leaveController.js
│   │   │   ├── salaryController.js
│   │   │   └── departmentController.js
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT verification
│   │   │   └── errorHandler.js       # Error handling
│   │   ├── models/
│   │   │   ├── User.js               # User/Employee model
│   │   │   ├── Attendance.js
│   │   │   ├── Leave.js
│   │   │   ├── Salary.js
│   │   │   └── Department.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── employees.js
│   │   │   ├── attendance.js
│   │   │   ├── leaves.js
│   │   │   ├── salaries.js
│   │   │   └── departments.js
│   │   ├── utils/
│   │   │   ├── seedDepartments.js    # Department seeder
│   │   │   └── seedAllData.js        # Complete data seeder
│   │   └── server.js                 # Express app entry
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   └── ui/
│   │   │       ├── LoadingSpinner.jsx
│   │   │       └── Modal.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Auth state management
│   │   │   └── ThemeContext.jsx      # Dark mode state
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   └── LoginPage.jsx
│   │   │   └── dashboard/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Employees.jsx
│   │   │       ├── Attendance.jsx
│   │   │       ├── Leaves.jsx
│   │   │       ├── Salaries.jsx
│   │   │       ├── Departments.jsx
│   │   │       └── DepartmentDetails.jsx
│   │   ├── services/
│   │   │   ├── api.js                # Axios instance
│   │   │   ├── authService.js
│   │   │   ├── employeeService.js
│   │   │   ├── attendanceService.js
│   │   │   ├── leaveService.js
│   │   │   ├── salaryService.js
│   │   │   └── departmentService.js
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Global styles
│   ├── public/
│   └── package.json
│
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (Admin only)
- `GET /api/auth/me` - Get current user

### Employees
- `GET /api/employees` - Get all employees (with pagination, search, filters)
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee (Admin only)
- `PUT /api/employees/:id` - Update employee (Admin only)
- `DELETE /api/employees/:id` - Delete employee (Admin only)
- `GET /api/employees/stats` - Get employee statistics

### Attendance
- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance/today` - Get today's attendance
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance/stats` - Get attendance statistics

### Leaves
- `GET /api/leaves` - Get all leave requests
- `POST /api/leaves` - Apply for leave
- `PUT /api/leaves/:id` - Update leave status (Admin only)
- `DELETE /api/leaves/:id` - Delete leave request

### Salaries
- `GET /api/salaries` - Get all salary records
- `POST /api/salaries` - Create salary record (Admin only)
- `PUT /api/salaries/:id` - Update salary record (Admin only)
- `DELETE /api/salaries/:id` - Delete salary record (Admin only)

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID
- `POST /api/departments` - Create department (Admin only)
- `PUT /api/departments/:id` - Update department (Admin only)
- `DELETE /api/departments/:id` - Delete department (Admin only)

## 🎨 Key Features Explained

### Automatic Manager Assignment
When an employee's position is set to "Manager", they are automatically assigned as their department's manager through Mongoose hooks in the User model.

### Department Employee Count
Employee counts are automatically updated via User model hooks when employees are added, removed, or transferred.

### Salary Calculation
Net salary is automatically calculated using a pre-save hook: `netSalary = basicSalary + allowances + bonus - deductions`

### Leave Days Calculation
Total leave days are automatically calculated from the date range using a pre-save hook.

### Pagination
All list pages (Employees, Attendance, Leaves, Salaries) support pagination with 10 items per page.

### Dark Mode
Uses Tailwind's class strategy with zinc/black color scheme for a modern dark theme.

## 🔒 Security Features

- JWT-based authentication with HTTP-only cookies
- Password hashing with bcrypt (10 salt rounds)
- Protected routes with middleware
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Helmet for security headers
- XSS protection

## 📊 Data Models

### User/Employee
- Personal information (name, email, phone, address)
- Employment details (department, position, salary, join date)
- Authentication (password, role)
- Status tracking

### Attendance
- User reference
- Date, check-in, check-out times
- Working hours calculation
- Status (Present, Late, Absent)

### Leave
- User reference
- Leave type, date range, total days
- Reason and status (Pending, Approved, Rejected)

### Salary
- User reference
- Month, year
- Basic salary, allowances, deductions, bonus
- Net salary (auto-calculated)
- Payment status and date

### Department
- Name, description
- Manager reference
- Employee count (auto-updated)
- Status

## 🎯 Future Enhancements

- Email notifications for leave approvals
- Performance review module
- Document management
- Payslip generation (PDF)
- Advanced reporting and analytics
- Employee self-service portal
- Mobile application
- Biometric integration
- Multi-language support

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### CORS Errors
- Verify frontend URL in backend CORS configuration
- Check API URL in frontend `.env`

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET in backend `.env`
- Verify token expiration settings

### Seed Script Issues
- Run department seeder before data seeder
- Ensure MongoDB is running
- Check for existing data conflicts

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributors

- Your Name - Initial work

## 📧 Contact

For questions or support, please contact: your.email@example.com

---

**Note**: This is a demonstration project. For production use, implement additional security measures, error handling, and testing.
