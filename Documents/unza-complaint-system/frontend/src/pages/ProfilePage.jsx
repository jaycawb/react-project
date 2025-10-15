import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Use the user from auth context if available, otherwise fetch
        if (user) {
          setProfile(user);
          setFormData({
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            email: user.email || '',
            phone: user.phone || ''
          });
        }
      } catch (e) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      email: profile?.email || '',
      phone: profile?.phone || ''
    });
    setError('');
  };

  const handleSave = async () => {
    setUpdating(true);
    setError('');

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setProfile(result.user);
        setIsEditing(false);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (e) {
      setError('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
      <div>Loading profile...</div>
    </div>
  );

  if (error && !profile) return (
    <div className="card">
      <div className="alert error">{error}</div>
    </div>
  );

  return (
    <div className="container">
      <div className="card">
        <div className="flex justify-between items-center mb-lg">
          <h1 style={{ margin: 0 }}>My Profile</h1>
          {!isEditing && (
            <button className="btn btn.small" onClick={handleEdit}>
              Edit Profile
            </button>
          )}
        </div>

        {error && <div className="alert error" style={{ marginBottom: '16px' }}>{error}</div>}

        <div className="grid two" style={{ gap: '24px' }}>
          {/* Profile Information */}
          <div>
            <h3 style={{ marginBottom: '16px', color: 'var(--text)' }}>Personal Information</h3>

            <div className="form-group">
              <label htmlFor="computer_number">Computer Number</label>
              <div className="input" style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}>
                {profile?.computer_number}
              </div>
              <small className="helper">Computer number cannot be changed</small>
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <div className="input" style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}>
                {profile?.role}
              </div>
              <small className="helper">Role is managed by administrators</small>
            </div>
          </div>

          {/* Editable Fields */}
          <div>
            <h3 style={{ marginBottom: '16px', color: 'var(--text)' }}>
              {isEditing ? 'Edit Information' : 'Contact Information'}
            </h3>

            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  className="input"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <div className="input" style={{ backgroundColor: '#f8f9fa' }}>
                  {profile?.first_name}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  className="input"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <div className="input" style={{ backgroundColor: '#f8f9fa' }}>
                  {profile?.last_name}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="input"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <div className="input" style={{ backgroundColor: '#f8f9fa' }}>
                  {profile?.email}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="input"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+260977123456"
                />
              ) : (
                <div className="input" style={{ backgroundColor: '#f8f9fa' }}>
                  {profile?.phone || 'Not provided'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Actions */}
        {isEditing && (
          <div style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              className="btn secondary"
              onClick={handleCancel}
              disabled={updating}
            >
              Cancel
            </button>
            <button
              className="btn"
              onClick={handleSave}
              disabled={updating}
            >
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        {/* Account Information */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '8px', color: 'var(--text)' }}>Account Information</h3>
          <div style={{ color: 'var(--muted)', fontSize: '14px' }}>
            <div>Member since: {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


