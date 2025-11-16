import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { employeeService } from '@/services/employeeService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const SalaryForm = ({ onSubmit, onCancel, isSubmitting }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="form-label">Employee *</label>
        <select {...register('user', { required: 'Employee is required' })} className="form-input">
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp._id} value={emp._id}>{emp.name}</option>
          ))}
        </select>
        {errors.user && <p className="form-error">{errors.user.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Month *</label>
          <select {...register('month', { required: 'Month is required' })} className="form-input">
            <option value="">Select Month</option>
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          {errors.month && <p className="form-error">{errors.month.message}</p>}
        </div>
        <div>
          <label className="form-label">Year *</label>
          <input
            {...register('year', { required: 'Year is required' })}
            type="number"
            className="form-input"
            defaultValue={new Date().getFullYear()}
          />
          {errors.year && <p className="form-error">{errors.year.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Basic Salary *</label>
          <input
            {...register('basicSalary', { required: 'Basic salary is required' })}
            type="number"
            className="form-input"
          />
          {errors.basicSalary && <p className="form-error">{errors.basicSalary.message}</p>}
        </div>
        <div>
          <label className="form-label">Allowances</label>
          <input {...register('allowances')} type="number" className="form-input" defaultValue={0} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Deductions</label>
          <input {...register('deductions')} type="number" className="form-input" defaultValue={0} />
        </div>
        <div>
          <label className="form-label">Bonus</label>
          <input {...register('bonus')} type="number" className="form-input" defaultValue={0} />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default SalaryForm;
