import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/de';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { type Dayjs } from 'dayjs';

interface Leave {
  id: number;
  fromDate: string;
  toDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface LeaveRequestModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: LeaveFormData) => void;
  existingLeaves?: Leave[];
}

export interface LeaveFormData {
  fromDate: string;
  toDate: string;
  leaveType: string;
  reason: string;
  note?: string;
}

const leaveTypes = [
  'Annual Leave',
  'Sick Leave',
  'Casual Leave',
  'Work From Home',
  'Other',
];

const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({ show, onClose, onSubmit, existingLeaves = [] }) => {
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  const [leaveType, setLeaveType] = useState(leaveTypes[0]);
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');

  // Function to check if a date is within any pending/approved leave
  const shouldDisableDate = (date: Dayjs) => {
    const pendingOrApprovedLeaves = existingLeaves.filter(
      leave => leave.status === 'pending' || leave.status === 'approved'
    );

    return pendingOrApprovedLeaves.some(leave => {
      const leaveStart = dayjs(leave.fromDate).startOf('day');
      const leaveEnd = dayjs(leave.toDate).startOf('day');
      const checkDate = date.startOf('day');
      
      // Check if date is within the leave range (inclusive)
      return (checkDate.isAfter(leaveStart) || checkDate.isSame(leaveStart)) && 
             (checkDate.isBefore(leaveEnd) || checkDate.isSame(leaveEnd));
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromDate || !toDate || !leaveType || !reason) return;
    onSubmit({ 
      fromDate: fromDate.format('YYYY-MM-DD'), 
      toDate: toDate.format('YYYY-MM-DD'), 
      leaveType, 
      reason, 
      note 
    });
    // Reset form
    setFromDate(null);
    setToDate(null);
    setLeaveType(leaveTypes[0]);
    setReason('');
    setNote('');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={show} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            Request Leave
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <DatePicker
              label="From Date *"
              value={fromDate}
              onChange={(newValue: Dayjs | null) => setFromDate(newValue)}
              format="DD/MM/YYYY"
              shouldDisableDate={shouldDisableDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: 'normal',
                  required: true,
                },
              }}
            />
            <DatePicker
              label="To Date *"
              value={toDate}
              onChange={(newValue: Dayjs | null) => setToDate(newValue)}
              minDate={fromDate || undefined}
              format="DD/MM/YYYY"
              shouldDisableDate={shouldDisableDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: 'normal',
                  required: true,
                },
              }}
            />
          <TextField
            select
            label="Leave Type"
            fullWidth
            margin="normal"
            required
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
          >
            {leaveTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Reason"
            fullWidth
            margin="normal"
            required
            multiline
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <TextField
            label="Note (optional)"
            fullWidth
            margin="normal"
            multiline
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Submit Request
          </Button>
        </DialogActions>
      </form>
    </Dialog>
    </LocalizationProvider>
  );
};

export default LeaveRequestModal;
