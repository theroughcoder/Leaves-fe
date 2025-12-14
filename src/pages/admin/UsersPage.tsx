import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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

const UsersPage: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setUsers(response.data.users);
        } else {
          setError('Failed to fetch users');
        }
      } catch (err: any) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    if (user && user.role === 'admin') {
      fetchUsers();
    }
  }, [token, user]);

  if (!user || user.role !== 'admin') {
    return <div>Access denied. Admins only.</div>;
  }

  return (
    <div className="admin-users-page">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>All Users</h2>
        <button onClick={()=>navigate('/register')}>Create New User</button>
      </div>
      {loading && <div>Loading users...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table style={{width:'100%', marginTop:'1rem', borderCollapse:'collapse'}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Role</th>
            <th>Employee ID</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.firstName} {u.lastName}</td>
              <td>{u.email}</td>
              <td>{u.department}</td>
              <td>{u.role}</td>
              <td>{u.employeeId}</td>
              <td>{new Date(u.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;

