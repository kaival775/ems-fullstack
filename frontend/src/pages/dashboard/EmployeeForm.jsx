import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { departmentService } from '@/services/departmentService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const EmployeeForm = ({ employee, onSubmit, onCancel, isSubmitting }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: employee ? {
      ...employee,
      department: employee.department?._id || employee.department
    } : {
      name: '',
      email: '',
      password: '',
      role: 'Employee',
      department: '',
      position: '',
      salary: '',
      phone: '',
      address: { street: '', city: '', state: '', zipCode: '', country: '' }
    }
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (employee) {
      reset({
        ...employee,
        department: employee.department?._id || employee.department,
        isManager: employee.position === 'Manager'
      });
    }
  }, [employee, reset]);

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAll();
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Full Name *</label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="form-input"
          />
          {errors.name && <p className="form-error">{errors.name.message}</p>}
        </div>

        <div>
          <label className="form-label">Email *</label>
          <input
            {...register('email', { 
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
            })}
            type="email"
            className="form-input"
          />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>

        {!employee && (
          <div>
            <label className="form-label">Password *</label>
            <input
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Min 6 characters' }
              })}
              type="password"
              className="form-input"
            />
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>
        )}

        <div>
          <label className="form-label">Role *</label>
          <select {...register('role')} className="form-input">
            <option value="Employee">Employee</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div>
          <label className="form-label">Department *</label>
          <select 
            {...register('department', { required: 'Department is required' })}
            className="form-input"
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept._id} value={dept._id}>{dept.name}</option>
            ))}
          </select>
          {errors.department && <p className="form-error">{errors.department.message}</p>}
        </div>

        <div>
          <label className="form-label">Position *</label>
          <input
            {...register('position', { required: 'Position is required' })}
            className="form-input"
            disabled={watch('isManager')}
          />
          {errors.position && <p className="form-error">{errors.position.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register('isManager')}
              onChange={(e) => {
                if (e.target.checked) {
                  setValue('position', 'Manager');
                } else {
                  setValue('position', '');
                }
              }}
              className="form-checkbox h-4 w-4 text-primary-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Set as Department Manager</span>
          </label>
        </div>

        <div>
          <label className="form-label">Salary *</label>
          <input
            {...register('salary', { required: 'Salary is required' })}
            type="number"
            className="form-input"
          />
          {errors.salary && <p className="form-error">{errors.salary.message}</p>}
        </div>

        <div>
          <label className="form-label">Phone *</label>
          <input
            {...register('phone', { required: 'Phone is required' })}
            className="form-input"
          />
          {errors.phone && <p className="form-error">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className="form-label">Street Address</label>
        <input {...register('address.street')} className="form-input" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="form-label">City</label>
          <input {...register('address.city')} className="form-input" />
        </div>
        <div>
          <label className="form-label">State</label>
          <input {...register('address.state')} className="form-input" />
        </div>
        <div>
          <label className="form-label">Zip Code</label>
          <input {...register('address.zipCode')} className="form-input" />
        </div>
        <div>
          <label className="form-label">Country</label>
          <input {...register('address.country')} className="form-input" />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Saving...' : employee ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;