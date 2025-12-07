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
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, {
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
    <div className="modern-profile-container">
      <div className="profile-banner" />
      <div className="profile-card modern-profile-card">
        <div className="profile-main-row avatar-inline-row">
          <div className="profile-avatar-wrapper large-avatar-wrapper">
            <div className="avatar-circle avatar-overlap large-avatar">
              {profile.firstName.charAt(0).toUpperCase()}
              {profile.lastName.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="profile-basic-info avatar-next-info">
            <h1 className="profile-user-name">{profile.firstName} {profile.lastName}</h1>
            <div className="profile-position">
              {profile.position}
            </div>
            <div className="profile-location">
              <span role="img" aria-label="Location">📍</span> {profile.department}
            </div>
          </div>
        </div>
        <div className="modern-profile-actions-row">
          {!isEditing ? (
            <button onClick={handleEdit} className="edit-btn">
              ✏️ Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button 
                onClick={updateProfile} 
                disabled={isSaving}
                className="save-btn"
              >
                {isSaving ? 'Saving...' : '💾 Save Changes'}
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
        {error && (
          <div className="alert alert-error">
            <span role="img" aria-label="Error" style={{marginRight:8}}>❌</span>
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            <span role="img" aria-label="Success" style={{marginRight:8}}>✅</span>
            {success}
          </div>
        )}
        <div className="modern-profile-content">
          {/* All extra info sections below */}
          <div className="profile-info-grid">
            <div>
              <label>Email</label>
              <div className="info-value">{profile.email}</div>
            </div>
            <div>
              <label>Employee ID</label>
              <div className="info-value">{profile.employeeId}</div>
            </div>
            <div>
              <label>Member Since</label>
              <div className="info-value">{formatDate(profile.createdAt)}</div>
            </div>
            <div>
              <label>Last Updated</label>
              <div className="info-value">{formatDate(profile.updatedAt)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
