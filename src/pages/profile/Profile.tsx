import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Profile.css';

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  employeeId: string;
  createdAt: string;
  updatedAt: string;
}

const Profile: React.FC = () => {
  const { user, token, updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    department: '',
    position: ''
  });

  // Fetch user profile from backend
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      if (data.success) {
        setProfile(data.user);
        setEditForm({
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          department: data.user.department,
          position: data.user.position
        });
      } else {
        throw new Error(data.message || 'Failed to fetch profile');
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      if (data.success) {
        setProfile(data.user);
        updateUser(data.user);
        setIsEditing(false);
        setSuccess('Profile updated successfully!');
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    if (profile) {
      setEditForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        department: profile.department,
        position: profile.position
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    if (user && token) {
      fetchProfile();
    }
  }, [user, token]);

  if (isLoading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <h2>Profile Not Found</h2>
          <p>Unable to load your profile information.</p>
          <button onClick={fetchProfile} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <div className="profile-actions">
          {!isEditing ? (
            <button onClick={handleEdit} className="edit-btn">
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button 
                onClick={updateProfile} 
                disabled={isSaving}
                className="save-btn"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                onClick={handleCancel} 
                disabled={isSaving}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {profile.firstName.charAt(0).toUpperCase()}
              {profile.lastName.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="profile-info">
            <div className="info-section">
              <h3>Personal Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={editForm.firstName}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <span className="info-value">{profile.firstName}</span>
                  )}
                </div>

                <div className="info-item">
                  <label>Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={editForm.lastName}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <span className="info-value">{profile.lastName}</span>
                  )}
                </div>

                <div className="info-item">
                  <label>Email</label>
                  <span className="info-value">{profile.email}</span>
                </div>

                <div className="info-item">
                  <label>Employee ID</label>
                  <span className="info-value">{profile.employeeId}</span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>Work Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Department</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="department"
                      value={editForm.department}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <span className="info-value">{profile.department}</span>
                  )}
                </div>

                <div className="info-item">
                  <label>Position</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="position"
                      value={editForm.position}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <span className="info-value">{profile.position}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>Account Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Member Since</label>
                  <span className="info-value">{formatDate(profile.createdAt)}</span>
                </div>

                <div className="info-item">
                  <label>Last Updated</label>
                  <span className="info-value">{formatDate(profile.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
