import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import Salary from '../models/Salary.js';
import Department from '../models/Department.js';

dotenv.config();

const generateAttendance = (userId) => {
  const attendance = [];
  const today = new Date();
  
  // Generate attendance for last 15 days only
  for (let i = 15; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    const checkIn = `09:${String(Math.floor(Math.random() * 30)).padStart(2, '0')}`;
    const checkOut = `18:${String(Math.floor(Math.random() * 30)).padStart(2, '0')}`;
    
    attendance.push({
      user: userId,
      date: date,
      checkIn: checkIn,
      checkOut: checkOut,
      status: Math.random() > 0.1 ? 'Present' : 'Late'
    });
  }
  
  return attendance;
};

const generateLeaves = (userId) => {
  const leaves = [];
  const leaveTypes = ['Sick Leave', 'Casual Leave', 'Annual Leave'];
  const statuses = ['Approved', 'Pending', 'Rejected'];
  
  // Generate 1-2 leave requests only
  const numLeaves = Math.floor(Math.random() * 2) + 1;
  
  for (let i = 0; i < numLeaves; i++) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - Math.floor(Math.random() * 30));
    
    const toDate = new Date(fromDate);
    const daysToAdd = Math.floor(Math.random() * 3) + 1;
    toDate.setDate(toDate.getDate() + daysToAdd);
    
    const totalDays = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)) + 1;
    
    leaves.push({
      user: userId,
      leaveType: leaveTypes[Math.floor(Math.random() * leaveTypes.length)],
      fromDate: fromDate,
      toDate: toDate,
      totalDays: totalDays.toString(),
      reason: 'Personal work',
      status: statuses[Math.floor(Math.random() * statuses.length)]
    });
  }
  
  return leaves;
};

const generateSalaries = (userId, baseSalary) => {
  const salaries = [];
  const months = ['January', 'February', 'March', 'April', 'May'];
  const year = 2025;
  
  // Generate salary records for first 5 months of 2025
  for (let i = 0; i < 5; i++) {
    const allowances = Math.floor(baseSalary * 0.1);
    const deductions = Math.floor(baseSalary * 0.05);
    const bonus = i % 3 === 0 ? Math.floor(baseSalary * 0.1) : 0;
    
    salaries.push({
      user: userId,
      month: months[i],
      year: year,
      basicSalary: baseSalary,
      allowances: allowances,
      deductions: deductions,
      bonus: bonus,
      netSalary: baseSalary + allowances + bonus - deductions,
      status: i < 3 ? 'Paid' : 'Pending',
      paidDate: i < 3 ? new Date(year, i, 28) : null
    });
  }
  
  return salaries;
};

const seedAllData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ems_database');
    console.log('MongoDB Connected...');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({ role: 'Employee' });
    await Attendance.deleteMany({});
    await Leave.deleteMany({});
    await Salary.deleteMany({});
    console.log('✅ Existing data cleared (Admin preserved)');

    // Fetch all departments
    console.log('Fetching departments...');
    const departments = await Department.find();
    const deptMap = {};
    departments.forEach(dept => {
      deptMap[dept.name] = dept._id.toString();
    });
    console.log(`✅ Found ${departments.length} departments`);

    // Create admin user first
    const adminData = {
      name: 'System Administrator',
      email: 'admin@company.com',
      password: 'admin123',
      role: 'Admin',
      phone: '+91 98765 00000',
      address: {
        street: 'Admin Office',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India'
      }
    };

    // Check if admin exists, if not create one
    let admin = await User.findOne({ email: 'admin@company.com' });
    if (!admin) {
      admin = await User.create(adminData);
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Create employees data
    const employeesData = [
     
      { name: 'Rajesh Kumar', email: 'rajesh.kumar@company.com', password: 'employee123', role: 'Employee', department: deptMap['Human Resources'], position: 'Manager', salary: 85000, phone: '+91 98765 43210', address: { street: 'MG Road', city: 'Mumbai', state: 'Maharashtra', zipCode: '400001', country: 'India' } },
      { name: 'Priya Sharma', email: 'priya.sharma@company.com', password: 'employee123', role: 'Employee', department: deptMap['Human Resources'], position: 'HR Executive', salary: 45000, phone: '+91 98765 43211', address: { street: 'Connaught Place', city: 'Delhi', state: 'Delhi', zipCode: '110001', country: 'India' } },
      { name: 'Amit Patel', email: 'amit.patel@company.com', password: 'employee123', role: 'Employee', department: deptMap['Human Resources'], position: 'Recruiter', salary: 42000, phone: '+91 98765 43212', address: { street: 'SG Highway', city: 'Ahmedabad', state: 'Gujarat', zipCode: '380015', country: 'India' } },
      { name: 'Vikram Singh', email: 'vikram.singh@company.com', password: 'employee123', role: 'Employee', department: deptMap['Finance'], position: 'Manager', salary: 95000, phone: '+91 98765 43214', address: { street: 'Civil Lines', city: 'Jaipur', state: 'Rajasthan', zipCode: '302006', country: 'India' } },
      { name: 'Ananya Iyer', email: 'ananya.iyer@company.com', password: 'employee123', role: 'Employee', department: deptMap['Finance'], position: 'Accountant', salary: 48000, phone: '+91 98765 43215', address: { street: 'Indiranagar', city: 'Bangalore', state: 'Karnataka', zipCode: '560038', country: 'India' } },
      { name: 'Karthik Menon', email: 'karthik.menon@company.com', password: 'employee123', role: 'Employee', department: deptMap['Finance'], position: 'Financial Analyst', salary: 52000, phone: '+91 98765 43216', address: { street: 'Marine Drive', city: 'Kochi', state: 'Kerala', zipCode: '682011', country: 'India' } },
      { name: 'Neha Gupta', email: 'neha.gupta@company.com', password: 'employee123', role: 'Employee', department: deptMap['Finance'], position: 'Payroll Specialist', salary: 46000, phone: '+91 98765 43217', address: { street: 'Park Street', city: 'Kolkata', state: 'West Bengal', zipCode: '700016', country: 'India' } },
      { name: 'Arjun Nair', email: 'arjun.nair@company.com', password: 'employee123', role: 'Employee', department: deptMap['Sales'], position: 'Manager', salary: 90000, phone: '+91 98765 43218', address: { street: 'Anna Salai', city: 'Chennai', state: 'Tamil Nadu', zipCode: '600002', country: 'India' } },
      { name: 'Pooja Desai', email: 'pooja.desai@company.com', password: 'employee123', role: 'Employee', department: deptMap['Sales'], position: 'Sales Executive', salary: 44000, phone: '+91 98765 43219', address: { street: 'FC Road', city: 'Pune', state: 'Maharashtra', zipCode: '411004', country: 'India' } },
      { name: 'Rahul Verma', email: 'rahul.verma@company.com', password: 'employee123', role: 'Employee', department: deptMap['Sales'], position: 'Business Development', salary: 40000, phone: '+91 98765 43220', address: { street: 'Hazratganj', city: 'Lucknow', state: 'Uttar Pradesh', zipCode: '226001', country: 'India' } },
      { name: 'Divya Krishnan', email: 'divya.krishnan@company.com', password: 'employee123', role: 'Employee', department: deptMap['Marketing'], position: 'Manager', salary: 88000, phone: '+91 98765 43221', address: { street: 'Whitefield', city: 'Bangalore', state: 'Karnataka', zipCode: '560066', country: 'India' } },
      { name: 'Sanjay Malhotra', email: 'sanjay.malhotra@company.com', password: 'employee123', role: 'Employee', department: deptMap['Marketing'], position: 'Digital Marketing Specialist', salary: 47000, phone: '+91 98765 43222', address: { street: 'Sector 18', city: 'Noida', state: 'Uttar Pradesh', zipCode: '201301', country: 'India' } },
      { name: 'Kavya Rao', email: 'kavya.rao@company.com', password: 'employee123', role: 'Employee', department: deptMap['Marketing'], position: 'Content Writer', salary: 35000, phone: '+91 98765 43223', address: { street: 'Koramangala', city: 'Bangalore', state: 'Karnataka', zipCode: '560034', country: 'India' } },
      { name: 'Rohan Kapoor', email: 'rohan.kapoor@company.com', password: 'employee123', role: 'Employee', department: deptMap['Engineering'], position: 'Manager', salary: 120000, phone: '+91 98765 43225', address: { street: 'Cyber City', city: 'Gurgaon', state: 'Haryana', zipCode: '122002', country: 'India' } },
      { name: 'Meera Joshi', email: 'meera.joshi@company.com', password: 'employee123', role: 'Employee', department: deptMap['Engineering'], position: 'Senior Software Engineer', salary: 85000, phone: '+91 98765 43226', address: { street: 'Hinjewadi', city: 'Pune', state: 'Maharashtra', zipCode: '411057', country: 'India' } },
      { name: 'Suresh Babu', email: 'suresh.babu@company.com', password: 'employee123', role: 'Employee', department: deptMap['Engineering'], position: 'Software Engineer', salary: 65000, phone: '+91 98765 43227', address: { street: 'OMR Road', city: 'Chennai', state: 'Tamil Nadu', zipCode: '600097', country: 'India' } },
      { name: 'Ishita Bansal', email: 'ishita.bansal@company.com', password: 'employee123', role: 'Employee', department: deptMap['Engineering'], position: 'QA Engineer', salary: 55000, phone: '+91 98765 43228', address: { street: 'Salt Lake', city: 'Kolkata', state: 'West Bengal', zipCode: '700091', country: 'India' } },
      { name: 'Tanvi Shah', email: 'tanvi.shah@company.com', password: 'employee123', role: 'Employee', department: deptMap['Product Management'], position: 'Manager', salary: 105000, phone: '+91 98765 43230', address: { street: 'Satellite', city: 'Ahmedabad', state: 'Gujarat', zipCode: '380015', country: 'India' } },
      { name: 'Varun Mehta', email: 'varun.mehta@company.com', password: 'employee123', role: 'Employee', department: deptMap['Product Management'], position: 'Product Manager', salary: 95000, phone: '+91 98765 43231', address: { street: 'Bandra West', city: 'Mumbai', state: 'Maharashtra', zipCode: '400050', country: 'India' } },
      { name: 'Ritu Saxena', email: 'ritu.saxena@company.com', password: 'employee123', role: 'Employee', department: deptMap['Product Management'], position: 'Product Analyst', salary: 70000, phone: '+91 98765 43232', address: { street: 'Gomti Nagar', city: 'Lucknow', state: 'Uttar Pradesh', zipCode: '226010', country: 'India' } },
      { name: 'Deepak Yadav', email: 'deepak.yadav@company.com', password: 'employee123', role: 'Employee', department: deptMap['IT & Infrastructure'], position: 'Manager', salary: 92000, phone: '+91 98765 43233', address: { street: 'Nehru Place', city: 'Delhi', state: 'Delhi', zipCode: '110019', country: 'India' } },
      { name: 'Swati Kulkarni', email: 'swati.kulkarni@company.com', password: 'employee123', role: 'Employee', department: deptMap['IT & Infrastructure'], position: 'IT Support Specialist', salary: 50000, phone: '+91 98765 43234', address: { street: 'Kothrud', city: 'Pune', state: 'Maharashtra', zipCode: '411038', country: 'India' } },
      { name: 'Nikhil Pandey', email: 'nikhil.pandey@company.com', password: 'employee123', role: 'Employee', department: deptMap['IT & Infrastructure'], position: 'Network Administrator', salary: 58000, phone: '+91 98765 43235', address: { street: 'Vastrapur', city: 'Ahmedabad', state: 'Gujarat', zipCode: '380015', country: 'India' } },
      { name: 'Gaurav Sinha', email: 'gaurav.sinha@company.com', password: 'employee123', role: 'Employee', department: deptMap['Operations'], position: 'Manager', salary: 87000, phone: '+91 98765 43237', address: { street: 'Rajarhat', city: 'Kolkata', state: 'West Bengal', zipCode: '700156', country: 'India' } },
      { name: 'Pallavi Bhatt', email: 'pallavi.bhatt@company.com', password: 'employee123', role: 'Employee', department: deptMap['Operations'], position: 'Operations Executive', salary: 46000, phone: '+91 98765 43238', address: { street: 'Malviya Nagar', city: 'Jaipur', state: 'Rajasthan', zipCode: '302017', country: 'India' } },
      { name: 'Akash Tiwari', email: 'akash.tiwari@company.com', password: 'employee123', role: 'Employee', department: deptMap['Operations'], position: 'Process Coordinator', salary: 42000, phone: '+91 98765 43239', address: { street: 'Indore Road', city: 'Indore', state: 'Madhya Pradesh', zipCode: '452001', country: 'India' } },
      { name: 'Simran Kaur', email: 'simran.kaur@company.com', password: 'employee123', role: 'Employee', department: deptMap['Admin / Office Management'], position: 'Manager', salary: 78000, phone: '+91 98765 43240', address: { street: 'Model Town', city: 'Chandigarh', state: 'Chandigarh', zipCode: '160022', country: 'India' } },
      { name: 'Vishal Dubey', email: 'vishal.dubey@company.com', password: 'employee123', role: 'Employee', department: deptMap['Admin / Office Management'], position: 'Office Administrator', salary: 38000, phone: '+91 98765 43241', address: { street: 'Alambagh', city: 'Lucknow', state: 'Uttar Pradesh', zipCode: '226005', country: 'India' } },
      { name: 'Anjali Mishra', email: 'anjali.mishra@company.com', password: 'employee123', role: 'Employee', department: deptMap['Admin / Office Management'], position: 'Facility Coordinator', salary: 36000, phone: '+91 98765 43242', address: { street: 'Aashiana', city: 'Lucknow', state: 'Uttar Pradesh', zipCode: '226012', country: 'India' } },
      { name: 'Harish Nambiar', email: 'harish.nambiar@company.com', password: 'employee123', role: 'Employee', department: deptMap['Research & Development (R&D)'], position: 'Manager', salary: 110000, phone: '+91 98765 43243', address: { street: 'Banjara Hills', city: 'Hyderabad', state: 'Telangana', zipCode: '500034', country: 'India' } },
      { name: 'Lakshmi Iyer', email: 'lakshmi.iyer@company.com', password: 'employee123', role: 'Employee', department: deptMap['Research & Development (R&D)'], position: 'Research Scientist', salary: 95000, phone: '+91 98765 43244', address: { street: 'Koramangala', city: 'Bangalore', state: 'Karnataka', zipCode: '560034', country: 'India' } },
      { name: 'Abhishek Rao', email: 'abhishek.rao@company.com', password: 'employee123', role: 'Employee', department: deptMap['Research & Development (R&D)'], position: 'Data Scientist', salary: 88000, phone: '+91 98765 43245', address: { street: 'Powai', city: 'Mumbai', state: 'Maharashtra', zipCode: '400076', country: 'India' } }
    ];

    // Insert employees
    console.log('Inserting employees...');
    const insertedEmployees = await User.insertMany(employeesData);
    console.log(`✅ ${insertedEmployees.length} employees inserted`);

    // Update department counts and managers
    console.log('Updating department counts...');
    for (const dept of departments) {
      const count = await User.countDocuments({ department: dept._id });
      const manager = await User.findOne({ department: dept._id, position: 'Manager' });
      await Department.findByIdAndUpdate(dept._id, { 
        employeeCount: count,
        manager: manager?._id || null
      });
    }
    console.log('✅ Department counts updated');

    // Generate and insert attendance
    console.log('Generating attendance records...');
    const allAttendance = [];
    insertedEmployees.forEach(emp => {
      allAttendance.push(...generateAttendance(emp._id));
    });
    await Attendance.insertMany(allAttendance);
    console.log(`✅ ${allAttendance.length} attendance records inserted`);

    // Generate and insert leaves
    console.log('Generating leave requests...');
    const allLeaves = [];
    insertedEmployees.forEach(emp => {
      allLeaves.push(...generateLeaves(emp._id));
    });
    await Leave.insertMany(allLeaves);
    console.log(`✅ ${allLeaves.length} leave requests inserted`);

    // Generate and insert salaries
    console.log('Generating salary records...');
    const allSalaries = [];
    insertedEmployees.forEach(emp => {
      allSalaries.push(...generateSalaries(emp._id, emp.salary));
    });
    await Salary.insertMany(allSalaries);
    console.log(`✅ ${allSalaries.length} salary records inserted`);

    console.log('\n🎉 All data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedAllData();
