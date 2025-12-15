import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

interface CreateUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  department: string;
  role: string;
  employeeId: string;
}

const UsersPage: React.FC = () => {
  const { user, token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateUserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    role: '',
    employeeId: ''
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

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
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
    setCreateError(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      department: '',
      role: '',
      employeeId: ''
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCreateError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (createError) setCreateError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      setCreateError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setCreateError('Last name is required');
      return false;
    }
    if (!formData.email) {
      setCreateError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setCreateError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setCreateError('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      setCreateError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setCreateError('Passwords do not match');
      return false;
    }
    if (!formData.department) {
      setCreateError('Department is required');
      return false;
    }
    if (!formData.role) {
      setCreateError('Role is required');
      return false;
    }
    if (!formData.employeeId.trim()) {
      setCreateError('Employee ID is required');
      return false;
    }
    return true;
  };

  const handleCreateUser = async () => {
    if (!validateForm()) {
      return;
    }

    setCreateLoading(true);
    setCreateError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/admin/register`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          department: formData.department,
          role: formData.role,
          employeeId: formData.employeeId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        handleCloseDialog();
        fetchUsers(); // Refresh the users list
      } else {
        setCreateError(response.data.message || 'Failed to create user');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create user';
      setCreateError(errorMessage);
    } finally {
      setCreateLoading(false);
    }
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
          {createError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {createError}
            </Alert>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                disabled={createLoading}
              />
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                disabled={createLoading}
              />
            </Box>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={createLoading}
            />
            <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={createLoading}
                helperText="Must be at least 8 characters"
              />
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
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
                value={formData.department}
                onChange={handleInputChange}
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
                value={formData.role}
                onChange={handleInputChange}
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
            <TextField
              fullWidth
              label="Employee ID"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleInputChange}
              required
              disabled={createLoading}
            />
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
            onClick={handleCreateUser}
            variant="contained"
            disabled={createLoading}
            sx={{
              bgcolor: '#a9271c',
              '&:hover': { bgcolor: '#8d1f16' },
              textTransform: 'none',
              px: 3
            }}
          >
            {createLoading ? (
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

