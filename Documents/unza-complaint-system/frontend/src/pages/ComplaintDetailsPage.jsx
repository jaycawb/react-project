import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const ComplaintDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

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
      {(complaint.assigned_to === user?.computer_number) && (
        <div style={{ marginTop: 16 }}>
          <div className="form-group">
            <label>Update Status</label>
            <select className="select" value={complaint.status} onChange={(e) => setComplaint(prev => ({ ...prev, status: e.target.value }))}>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button className="btn" disabled={updating} onClick={async () => {
            setUpdating(true);
            try {
              await api.put(`/complaints/${id}`, { status: complaint.status });
            } catch (e) {
              // no-op for now
            } finally {
              setUpdating(false);
            }
          }}>Save Status</button>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetailsPage;




