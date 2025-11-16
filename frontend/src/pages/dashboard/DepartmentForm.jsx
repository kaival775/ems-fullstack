import { useForm } from 'react-hook-form';

const DepartmentForm = ({ department, onSubmit, onCancel, isSubmitting }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: department || { name: '', description: '' }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="form-label">Department Name *</label>
        <input
          {...register('name', { required: 'Department name is required' })}
          className="form-input"
        />
        {errors.name && <p className="form-error">{errors.name.message}</p>}
      </div>

      <div>
        <label className="form-label">Description</label>
        <textarea
          {...register('description')}
          className="form-input"
          rows="3"
        />
      </div>

      <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 Manager is automatically assigned when an employee with position "Manager" is added to this department.
        </p>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Saving...' : department ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default DepartmentForm;
