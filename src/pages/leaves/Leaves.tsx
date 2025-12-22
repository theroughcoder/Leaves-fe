import React, { useState, useEffect } from 'react';
import './Leaves.css';
import { useAuth } from '../../contexts/AuthContext';
import LeaveRequestModal, {type LeaveFormData } from '../../components/LeaveRequestModal';
import { createLeave, getUserLeaves, type Leave } from '../../services/leaveService';
import { toast } from 'react-toastify';

const Leaves: React.FC = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user leaves on component mount
  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const data = await getUserLeaves();
      setLeaves(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leaves');
      console.error('Error fetching leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveRequest = async (data: LeaveFormData) => {
    try {
      await createLeave(data);
      setShowModal(false);
      // Refresh the leaves list
      await fetchLeaves();
      toast.success('Leave request submitted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      console.error('Error creating leave request:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to submit leave request', {
        position: 'top-right',
        autoClose: 4000,
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'status approved';
      case 'rejected':
        return 'status rejected';
      case 'pending':
        return 'status pending';
      default:
        return 'status';
    }
  };

  const calculateDuration = (fromDate: string, toDate: string) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  // Calculate leave statistics
  const totalLeavesAllowed = 24; // You can make this configurable
  const approvedLeaves = leaves.filter(l => l.status === 'approved');
  const usedDays = approvedLeaves.reduce((sum, leave) => {
    const from = new Date(leave.fromDate);
    const to = new Date(leave.toDate);
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return sum + days;
  }, 0);
  const remainingDays = totalLeavesAllowed - usedDays;

  return (
    <div className="leaves-page">
      <div className="page-header">
        <h1>Leave Management</h1>
        <p>Request and track your leave applications</p>
      </div>
      
      <div className="leaves-container">
        <div className="leaves-header">
          <h3>My Leaves</h3>
          {/* Only show the button to users with manager_id */}
          {user && user.managerId && (
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              Request Leave
            </button>
          )}
          <LeaveRequestModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onSubmit={handleLeaveRequest}
            existingLeaves={leaves}
          />
        </div>
        <div className="leaves-stats">
          <div className="stat-card">
            <h4>Total Allowance</h4>
            <span className="stat-value">{totalLeavesAllowed}</span>
          </div>
          <div className="stat-card">
            <h4>Used Days</h4>
            <span className="stat-value" style={{ color: usedDays > 0 ? '#2563eb' : '#64748b' }}>
              {usedDays}
            </span>
          </div>
          <div className="stat-card">
            <h4>Remaining</h4>
            <span className="stat-value" style={{ color: remainingDays > 5 ? '#15803d' : '#dc2626' }}>
              {remainingDays}
            </span>
          </div>
        </div>
        <div className="leaves-table">
          {loading ? (
            <p>⏳ Loading your leave requests...</p>
          ) : error ? (
            <p className="error-message">❌ {error}</p>
          ) : leaves.length === 0 ? (
            <p>📋 No leave requests yet. Click "Request Leave" to get started!</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Leave Type</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td style={{ fontWeight: 500 }}>{formatDate(leave.fromDate)}</td>
                    <td style={{ fontWeight: 500 }}>{formatDate(leave.toDate)}</td>
                    <td>{leave.leaveType}</td>
                    <td style={{ maxWidth: '250px' }} title={leave.reason}>
                      {leave.reason.length > 50 ? `${leave.reason.substring(0, 50)}...` : leave.reason}
                    </td>
                    <td>
                      <span className={getStatusClass(leave.status)}>
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: '#1e293b' }}>
                      {calculateDuration(leave.fromDate, leave.toDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaves;
