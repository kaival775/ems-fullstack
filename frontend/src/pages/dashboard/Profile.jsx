/**
 * Profile Page Component
 * User profile management
 */

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Building } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address?.street || ''
    }
  });

  const onSubmit = async (data) => {
    // Simulate API call
    setTimeout(() => {
      setIsEditing(false);
      // Update user context here
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold dark:text-white text-gray-900">
          Profile
        </h1>
        <p className="text-gray-600">Manage your personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card">
          <div className="card-body text-center">
            <div className="h-24 w-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-xl font-semibold dark:text-white text-gray-900">
              {user?.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{user?.position}</p>
            <p className="text-sm text-gray-500">{user?.department?.name}</p>
            <span
              className={`badge ${
                user?.status === "Active" ? "badge-success" : "badge-danger"
              } mt-2`}
            >
              {user?.status}
            </span>
          </div>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h3 className="text-lg font-semibold dark:text-white text-gray-900">
                Personal Information
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn-secondary"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>
            <div className="card-body">
              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="form-label">Full Name</label>
                    <input
                      {...register("name", { required: "Name is required" })}
                      className="form-input"
                    />
                    {errors.name && (
                      <p className="form-error">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Email</label>
                    <input
                      {...register("email")}
                      type="email"
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Phone</label>
                    <input {...register("phone")} className="form-input" />
                  </div>

                  <div>
                    <label className="form-label">Address</label>
                    <textarea
                      {...register("address")}
                      className="form-input"
                      rows="3"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary"
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm dark:text-gray-400 text-gray-600">
                        Full Name
                      </p>
                      <p className="font-medium">{user?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5  text-gray-400" />
                    <div>
                      <p className="text-sm dark:text-gray-400 text-gray-600">
                        Email
                      </p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex  items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm dark:text-gray-400 text-gray-600">
                        Phone
                      </p>
                      <p className="font-medium">
                        {user?.phone || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm dark:text-gray-400 text-gray-600">
                        Department
                      </p>
                      <p className="font-medium">{user?.department?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm dark:text-gray-400 text-gray-600">
                        Join Date
                      </p>
                      <p className="font-medium">
                        {user?.joinDate
                          ? new Date(user.joinDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm dark:text-gray-400 text-gray-600">
                        Address
                      </p>
                      <p className="font-medium">
                        {user?.address?.street || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;