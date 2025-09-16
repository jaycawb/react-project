import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const ComplaintDetailsPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const { data } = await api.get(`/complaints/${id}`);
        setComplaint(data.data);
      } catch (e) {
        setError('Failed to load complaint');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert error">{error}</div>;
  if (!complaint) return <div>Not found</div>;

  return (
    <div>
      <h1>{complaint.title}</h1>
      <div><strong>Category:</strong> {complaint.category}</div>
      <div><strong>Status:</strong> {complaint.status}</div>
      <div><strong>Priority:</strong> {complaint.priority}</div>
      <div style={{ marginTop: '1rem' }}>{complaint.description}</div>
    </div>
  );
};

export default ComplaintDetailsPage;




