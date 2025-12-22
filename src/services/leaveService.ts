import { getAuthHeader } from '../utils/auth';

const API_BASE_URL = 'http://localhost:5000/api/leaves';

export interface LeaveRequest {
  fromDate: string;
  toDate: string;
  leaveType: string;
  reason: string;
  note?: string;
}

export interface Leave {
  id: number;
  userId: number;
  managerId: number;
  fromDate: string;
  toDate: string;
  leaveType: string;
  reason: string;
  note?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// Create a new leave request
export const createLeave = async (leaveData: LeaveRequest): Promise<Leave> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(leaveData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create leave request');
  }

  const data = await response.json();
  return data.leave;
};

// Get all leaves for the current user
export const getUserLeaves = async (): Promise<Leave[]> => {
  const response = await fetch(`${API_BASE_URL}/my-leaves`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch leaves');
  }

  const data = await response.json();
  return data.leaves;
};

// Get all leaves where the current user is the manager
export const getManagerLeaves = async (): Promise<Leave[]> => {
  const response = await fetch(`${API_BASE_URL}/manager-leaves`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch manager leaves');
  }

  const data = await response.json();
  return data.leaves;
};

// Update leave status (approve/reject)
export const updateLeaveStatus = async (
  leaveId: number,
  status: 'approved' | 'rejected'
): Promise<Leave> => {
  const response = await fetch(`${API_BASE_URL}/${leaveId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update leave status');
  }

  const data = await response.json();
  return data.leave;
};

// Get leave by ID
export const getLeaveById = async (leaveId: number): Promise<Leave> => {
  const response = await fetch(`${API_BASE_URL}/${leaveId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch leave');
  }

  const data = await response.json();
  return data.leave;
};

