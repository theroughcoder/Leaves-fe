import React, { useState, useEffect } from 'react';
import './Tasks.css';
import { useAuth } from '../../contexts/AuthContext';
import { getManagerLeaves, updateLeaveStatus, type Leave } from '../../services/leaveService';
import { toast } from 'react-toastify';

interface LeaveWithUser extends Leave {
  userFirstName?: string;
  userLastName?: string;
  userEmail?: string;
  userEmployeeId?: string;
}

const Tasks: React.FC = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<LeaveWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    fetchManagerLeaves();
  }, []);

  const fetchManagerLeaves = async () => {
    try {
      setLoading(true);
      const data = await getManagerLeaves();
      setLeaves(data as LeaveWithUser[]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leave requests');
      console.error('Error fetching manager leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (leaveId: number) => {
    try {
      setProcessingId(leaveId);
      await updateLeaveStatus(leaveId, 'approved');
      await fetchManagerLeaves(); // Refresh the list
      toast.success('Leave request approved successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      console.error('Error approving leave:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to approve leave request', {
        position: 'top-right',
        autoClose: 4000,
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (leaveId: number) => {
    try {
      setProcessingId(leaveId);
      await updateLeaveStatus(leaveId, 'rejected');
      await fetchManagerLeaves(); // Refresh the list
      toast.info('Leave request rejected.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      console.error('Error rejecting leave:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to reject leave request', {
        position: 'top-right',
        autoClose: 4000,
      });
    } finally {
      setProcessingId(null);
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

  const pendingLeaves = leaves.filter(l => l.status === 'pending');
  const processedLeaves = leaves.filter(l => l.status !== 'pending');

  return (
    <div className="tasks-page">
      <div className="page-header">
        <h1>Task Management</h1>
        <p>Review and manage leave requests from your team</p>
      </div>
      
      <div className="tasks-container">
        {/* Pending Requests Section */}
        <div className="section">
          <div className="section-header">
            <h3>Pending Requests</h3>
            <span className="badge">{pendingLeaves.length}</span>
          </div>
          
          <div className="tasks-table">
            {loading ? (
              <p>⏳ Loading leave requests...</p>
            ) : error ? (
              <p className="error-message">❌ {error}</p>
            ) : pendingLeaves.length === 0 ? (
              <p>✅ No pending leave requests. All caught up!</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Type</th>
                    <th>Reason</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLeaves.map((leave) => (
                    <tr key={leave.id}>
                      <td>
                        <div className="employee-info">
                          <div className="employee-name">
                            {leave.userFirstName} {leave.userLastName}
                          </div>
                          <div className="employee-id">{leave.userEmployeeId}</div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 500 }}>{formatDate(leave.fromDate)}</td>
                      <td style={{ fontWeight: 500 }}>{formatDate(leave.toDate)}</td>
                      <td>{leave.leaveType}</td>
                      <td style={{ maxWidth: '250px' }} title={leave.reason}>
                        {leave.reason.length > 40 ? `${leave.reason.substring(0, 40)}...` : leave.reason}
                      </td>
                      <td style={{ fontWeight: 600, color: '#1e293b' }}>
                        {calculateDuration(leave.fromDate, leave.toDate)}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-approve"
                            onClick={() => handleApprove(leave.id)}
                            disabled={processingId === leave.id}
                          >
                            ✓ Approve
                          </button>
                          <button 
                            className="btn-reject"
                            onClick={() => handleReject(leave.id)}
                            disabled={processingId === leave.id}
                          >
                            ✕ Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Processed Requests Section */}
        {processedLeaves.length > 0 && (
          <div className="section">
            <div className="section-header">
              <h3>Processed Requests</h3>
              <span className="badge">{processedLeaves.length}</span>
            </div>
            
            <div className="tasks-table">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {processedLeaves.map((leave) => (
                    <tr key={leave.id}>
                      <td>
                        <div className="employee-info">
                          <div className="employee-name">
                            {leave.userFirstName} {leave.userLastName}
                          </div>
                          <div className="employee-id">{leave.userEmployeeId}</div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 500 }}>{formatDate(leave.fromDate)}</td>
                      <td style={{ fontWeight: 500 }}>{formatDate(leave.toDate)}</td>
                      <td>{leave.leaveType}</td>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;

