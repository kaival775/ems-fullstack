import { useForm } from 'react-hook-form';

const ApplyLeaveForm = ({ onSubmit, onCancel, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm();

 function daysBetweenDates(date1, date2) {
   if (!date1 || !date2) return ""; // prevent crash

   date1 = new Date(date1);
   date2 = new Date(date2);

   const oneDayInMs = 1000 * 60 * 60 * 24;

   const utcDate1 = Date.UTC(
     date1.getFullYear(),
     date1.getMonth(),
     date1.getDate()
   );
   const utcDate2 = Date.UTC(
     date2.getFullYear(),
     date2.getMonth(),
     date2.getDate()
   );

   const differenceMs = utcDate2 - utcDate1;
   setValue("totalDays", Math.floor(differenceMs / oneDayInMs) + 1);

   return Math.floor(differenceMs / oneDayInMs)+1;
 }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="form-label">Leave Type *</label>
        <select
          {...register("leaveType", { required: "Leave type is required" })}
          className="form-input"
        >
          <option value="">Select Type</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Casual Leave">Casual Leave</option>
          <option value="Annual Leave">Annual Leave</option>
          <option value="Maternity Leave">Maternity Leave</option>
          <option value="Paternity Leave">Paternity Leave</option>
          <option value="Emergency Leave">Emergency Leave</option>
        </select>
        {errors.leaveType && (
          <p className="form-error">{errors.leaveType.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">From Date *</label>
          <input
            {...register("fromDate", { required: "From date is required" })}
            type="date"
            className="form-input"
          />
          {errors.fromDate && (
            <p className="form-error">{errors.fromDate.message}</p>
          )}
        </div>
        <div>
          <label className="form-label">To Date *</label>
          <input
            {...register("toDate", { required: "To date is required" })}
            type="date"
            className="form-input"
          />
          {errors.toDate && (
            <p className="form-error">{errors.toDate.message}</p>
          )}
        </div>
      </div>
      <div>
        <label className="form-label">Total Days</label>
        <input
          className="form-input"
          {...register("totalDays")}
          value={
            watch("fromDate") &&
            daysBetweenDates(watch("fromDate"), watch("toDate"))
          }
          disabled
        />
      {errors.reason && <p className="form-error">{errors.reason.message}</p>}
      </div>
      <div>
        <label className="form-label">Reason *</label>
        <textarea
          {...register("reason", { required: "Reason is required" })}
          className="form-input"
          rows="3"
        />
        {errors.reason && <p className="form-error">{errors.reason.message}</p>}
      </div>

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default ApplyLeaveForm;