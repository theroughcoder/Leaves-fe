import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Card,
  IconButton,
  Tooltip,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  AdminPanelSettings as AdminIcon,
  PersonOutline as UserIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  employeeId: string;
  createdAt: string;
}

interface Manager {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
}

interface CreateUserFormData {
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

// Yup validation schema for user creation
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

const UsersPage: React.FC = () => {
  const { user, token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(false);

  // Formik form management
  const formik = useFormik<CreateUserFormData>({
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
      setCreateLoading(true);
      setGeneralError(null);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/admin/register`,
          {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
            department: values.department,
            role: values.role,
            employeeId: values.employeeId,
            managerId: values.managerId || null
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.success) {
          handleCloseDialog();
          fetchUsers(); // Refresh the users list
        } else {
          setGeneralError(response.data.message || 'Failed to create user');
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to create user';
        setGeneralError(errorMessage);
      } finally {
        setCreateLoading(false);
      }
    },
  });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err: any) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchManagers = async () => {
    setLoadingManagers(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/managers`);
      if (response.data.success) {
        setManagers(response.data.managers);
      }
    } catch (err) {
      console.error('Error fetching managers:', err);
    } finally {
      setLoadingManagers(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
      fetchManagers();
    }
  }, [token, user]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter((u) =>
        u.firstName.toLowerCase().includes(query) ||
        u.lastName.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.department.toLowerCase().includes(query) ||
        u.employeeId.toLowerCase().includes(query) ||
        u.role.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'error' : 'default';
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setGeneralError(null);
    formik.resetForm();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setGeneralError(null);
    formik.resetForm();
  };

  if (!user || user.role !== 'admin') {
    return <div>Access denied. Admins only.</div>;
  }

  return (
    <Box className="admin-users-page" sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 700, color: '#1e293b' }}>
          All Users
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Refresh">
            <IconButton
              onClick={fetchUsers}
              sx={{
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': { bgcolor: 'action.hover', boxShadow: 2 }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{
              bgcolor: '#a9271c',
              '&:hover': { bgcolor: '#8d1f16' },
              boxShadow: 2,
              textTransform: 'none',
              px: 3
            }}
          >
            Create New User
          </Button>
        </Box>
      </Box>

      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 2, bgcolor: alpha('#a9271c', 0.05) }}>
          <TextField
            fullWidth
            placeholder="Search users by name, email, department, role, or employee ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper',
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#a9271c',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#a9271c',
                },
              },
            }}
          />
        </Box>
      </Card>
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress sx={{ color: '#a9271c' }} />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      
      {!loading && !error && (
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}
        >
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="users table">
              <TableHead>
                <TableRow sx={{ bgcolor: alpha('#a9271c', 0.08) }}>
                  <TableCell sx={{ fontWeight: 700, color: '#1e293b', py: 2 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1e293b', py: 2 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1e293b', py: 2 }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1e293b', py: 2 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1e293b', py: 2 }}>Employee ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1e293b', py: 2 }}>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        {searchQuery ? 'No users found matching your search.' : 'No users found.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((u) => (
                    <TableRow
                      key={u.id}
                      sx={{
                        '&:hover': {
                          bgcolor: alpha('#a9271c', 0.04),
                          cursor: 'pointer',
                        },
                        transition: 'background-color 0.2s',
                        '&:last-child td': { border: 0 }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              bgcolor: u.role === 'admin' ? '#a9271c' : '#64748b',
                              width: 40,
                              height: 40,
                              fontSize: '0.875rem',
                              fontWeight: 600
                            }}
                          >
                            {getInitials(u.firstName, u.lastName)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                              {u.firstName} {u.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {u.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{u.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={u.department}
                          size="small"
                          sx={{
                            bgcolor: alpha('#64748b', 0.1),
                            color: '#475569',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={u.role === 'admin' ? <AdminIcon /> : <UserIcon />}
                          label={u.role}
                          color={getRoleColor(u.role)}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            textTransform: 'capitalize'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {u.employeeId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(u.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(u.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Create User Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: alpha('#a9271c', 0.08), 
          color: '#1e293b',
          fontWeight: 700,
          pb: 2
        }}>
          Create New User
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {generalError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {generalError}
            </Alert>
          )}
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
                required
                disabled={createLoading}
              />
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
                required
                disabled={createLoading}
              />
            </Box>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              required
              disabled={createLoading}
            />
            <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password ? formik.errors.password : 'Must be at least 8 characters'}
                required
                disabled={createLoading}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                required
                disabled={createLoading}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
              <TextField
                fullWidth
                select
                label="Department"
                name="department"
                value={formik.values.department}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.department && Boolean(formik.errors.department)}
                helperText={formik.touched.department && formik.errors.department}
                required
                disabled={createLoading}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">Select Department</option>
                <option value="hr">Human Resources</option>
                <option value="it">Information Technology</option>
                <option value="finance">Finance</option>
                <option value="marketing">Marketing</option>
                <option value="operations">Operations</option>
                <option value="sales">Sales</option>
              </TextField>
              <TextField
                fullWidth
                select
                label="Role"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.role && Boolean(formik.errors.role)}
                helperText={formik.touched.role && formik.errors.role}
                required
                disabled={createLoading}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </TextField>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
              <TextField
                fullWidth
                label="Employee ID"
                name="employeeId"
                value={formik.values.employeeId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.employeeId && Boolean(formik.errors.employeeId)}
                helperText={formik.touched.employeeId && formik.errors.employeeId}
                required
                disabled={createLoading}
              />
              <TextField
                fullWidth
                select
                label={`Manager${formik.values.role === 'employee' ? ' *' : ' (Optional)'}`}
                name="managerId"
                value={formik.values.managerId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.managerId && Boolean(formik.errors.managerId)}
                helperText={
                  formik.touched.managerId && formik.errors.managerId 
                    ? formik.errors.managerId
                    : formik.values.role === 'employee' 
                      ? 'Required for employees' 
                      : 'Optional for admin/manager'
                }
                required={formik.values.role === 'employee'}
                disabled={createLoading || loadingManagers}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">
                  {loadingManagers ? 'Loading managers...' : 'Select Manager'}
                </option>
                {managers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.firstName} {manager.lastName} - {manager.department} ({manager.role})
                  </option>
                ))}
              </TextField>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleCloseDialog}
            disabled={createLoading}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => formik.handleSubmit()}
            variant="contained"
            disabled={createLoading || formik.isSubmitting}
            sx={{
              bgcolor: '#a9271c',
              '&:hover': { bgcolor: '#8d1f16' },
              textTransform: 'none',
              px: 3
            }}
          >
            {createLoading || formik.isSubmitting ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />
                Creating...
              </>
            ) : (
              'Create User'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;

