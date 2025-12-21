import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import './Register.css';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  department: string;
  role: string;
  employeeId: string;
  managerId: string;
}

interface Manager {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
}

// Yup validation schema
const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must not exceed 50 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
  department: Yup.string()
    .required('Department is required'),
  role: Yup.string()
    .required('Role is required'),
  employeeId: Yup.string()
    .required('Employee ID is required'),
  managerId: Yup.string()
    .when('role', {
      is: 'employee',
      then: (schema) => schema.required('Manager is required for employee role'),
      otherwise: (schema) => schema.notRequired(),
    }),
});

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(false);

  // Fetch managers list
  useEffect(() => {
    const fetchManagers = async () => {
      setLoadingManagers(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/managers`);
        if (response.data.success) {
          setManagers(response.data.managers);
        }
      } catch (error) {
        console.error('Error fetching managers:', error);
      } finally {
        setLoadingManagers(false);
      }
    };
    fetchManagers();
  }, []);

  const formik = useFormik<RegisterFormData>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      department: '',
      role: '',
      employeeId: '',
      managerId: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setGeneralError('');
      
      try {
        // Make API call to register endpoint
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/admin/register`, {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          department: values.department,
          role: values.role,
          employeeId: values.employeeId,
          managerId: values.managerId || null,
        });
        
        // Handle successful registration
        if (response.data.success) {
          const { user, token } = response.data;
          
          // Store authentication data
          login({ user, token });
          
          // Show success message
          setSuccessMessage('Account created successfully! Redirecting to dashboard...');
          
          // Navigate to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }
      } catch (error: any) {
        console.error('Registration error:', error);
        
        // Handle different types of errors
        if (error.response) {
          // Server responded with error status
          const errorMessage = error.response.data?.message || 'Registration failed. Please try again.';
          setGeneralError(errorMessage);
        } else if (error.request) {
          // Request was made but no response received
          setGeneralError('Unable to connect to server. Please check your connection.');
        } else {
          // Something else happened
          setGeneralError('Registration failed. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">Join Our Team</h1>
          <p className="register-subtitle">Create your account to manage leaves</p>
        </div>
        
        <form onSubmit={formik.handleSubmit} className="register-form">
          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}
          
          {generalError && (
            <div className="error-message general-error">
              {generalError}
            </div>
          )}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`form-input ${formik.touched.firstName && formik.errors.firstName ? 'error' : ''}`}
                placeholder="Enter your first name"
                disabled={isLoading}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <span className="error-message">{formik.errors.firstName}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`form-input ${formik.touched.lastName && formik.errors.lastName ? 'error' : ''}`}
                placeholder="Enter your last name"
                disabled={isLoading}
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <span className="error-message">{formik.errors.lastName}</span>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`form-input ${formik.touched.email && formik.errors.email ? 'error' : ''}`}
              placeholder="Enter your email address"
              disabled={isLoading}
            />
            {formik.touched.email && formik.errors.email && (
              <span className="error-message">{formik.errors.email}</span>
            )}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`form-input ${formik.touched.password && formik.errors.password ? 'error' : ''}`}
                placeholder="Create a password"
                disabled={isLoading}
              />
              {formik.touched.password && formik.errors.password && (
                <span className="error-message">{formik.errors.password}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`form-input ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm your password"
                disabled={isLoading}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <span className="error-message">{formik.errors.confirmPassword}</span>
              )}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="department" className="form-label">
                Department
              </label>
              <select
                id="department"
                name="department"
                value={formik.values.department}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`form-input ${formik.touched.department && formik.errors.department ? 'error' : ''}`}
                disabled={isLoading}
              >
                <option value="">Select Department</option>
                <option value="hr">Human Resources</option>
                <option value="it">Information Technology</option>
                <option value="finance">Finance</option>
                <option value="marketing">Marketing</option>
                <option value="operations">Operations</option>
                <option value="sales">Sales</option>
              </select>
              {formik.touched.department && formik.errors.department && (
                <span className="error-message">{formik.errors.department}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="role" className="form-label">
                Role
              </label>
               <select
                id="role"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`form-input ${formik.touched.role && formik.errors.role ? 'error' : ''}`}
                disabled={isLoading}
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
              {formik.touched.role && formik.errors.role && (
                <span className="error-message">{formik.errors.role}</span>
              )}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="employeeId" className="form-label">
                Employee ID
              </label>
              <input
                type="text"
                id="employeeId"
                name="employeeId"
                value={formik.values.employeeId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`form-input ${formik.touched.employeeId && formik.errors.employeeId ? 'error' : ''}`}
                placeholder="Enter your employee ID"
                disabled={isLoading}
              />
              {formik.touched.employeeId && formik.errors.employeeId && (
                <span className="error-message">{formik.errors.employeeId}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="managerId" className="form-label">
                Manager {formik.values.role === 'employee' && <span style={{ color: 'red' }}>*</span>}
              </label>
              <select
                id="managerId"
                name="managerId"
                value={formik.values.managerId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`form-input ${formik.touched.managerId && formik.errors.managerId ? 'error' : ''}`}
                disabled={isLoading || loadingManagers}
              >
                <option value="">
                  {loadingManagers ? 'Loading managers...' : 'Select Manager (Optional for Admin/Manager)'}
                </option>
                {managers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.firstName} {manager.lastName} - {manager.department} ({manager.role})
                  </option>
                ))}
              </select>
              {formik.touched.managerId && formik.errors.managerId && (
                <span className="error-message">{formik.errors.managerId}</span>
              )}
            </div>
          </div>
          
          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" required />
              <span className="checkmark"></span>
              I agree to the <a href="#" className="terms-link">Terms of Service</a> and <a href="#" className="terms-link">Privacy Policy</a>
            </label>
          </div>
          
          <button 
            type="submit" 
            className={`register-button ${isLoading || formik.isSubmitting ? 'loading' : ''}`}
            disabled={isLoading || formik.isSubmitting}
          >
            {isLoading || formik.isSubmitting ? (
              <>
                <div className="spinner"></div>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        
        <div className="register-footer">
          <p>
            Already have an account?{' '}
            <a href="/login" className="login-link">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;