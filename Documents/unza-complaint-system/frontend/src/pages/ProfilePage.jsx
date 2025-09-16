import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/auth/profile');
        setProfile(data.data);
      } catch (e) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>My Profile</h1>
      <div>
        <div><strong>Name:</strong> {profile.first_name} {profile.last_name}</div>
        <div><strong>Computer #:</strong> {profile.computer_number}</div>
        <div><strong>Email:</strong> {profile.email}</div>
        <div><strong>Phone:</strong> {profile.phone}</div>
        <div><strong>Role:</strong> {profile.role}</div>
      </div>
    </div>
  );
};

export default ProfilePage;


