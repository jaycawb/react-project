import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const ComplaintsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAssigned, setShowAssigned] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!user) return;
      try {
        const params = showAssigned
          ? { limit: 10, assigned_to: user.computer_number }
          : { limit: 10, computer_number: user.computer_number };
        const { data } = await api.get('/complaints', { params });
        setComplaints(data.data || []);
      } catch (e) {
        setError('Failed to load complaints');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [user, showAssigned]);

  if (loading || authLoading) return <div>Loading...</div>;
  if (error) return <div className="alert error">{error}</div>;

  return (
    <div>
      <h1>Complaints</h1>
      <div style={{ margin: '0.5rem 0' }}>
        <Link className="btn" to="/complaints/new">+ Submit new complaint</Link>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(2, max-content)', gap: 8, margin: '8px 0' }}>
        <button className={`btn ${showAssigned ? 'secondary' : ''}`} onClick={() => setShowAssigned(false)}>My Complaints</button>
        <button className={`btn ${showAssigned ? '' : 'secondary'}`} onClick={() => setShowAssigned(true)}>Assigned To Me</button>
      </div>
      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <div className="card">
          <ul className="list">
            {complaints.map((c) => (
              <li key={c.complaint_id} className="list-item">
                <div className="item-title">
                  <Link to={`/complaints/${c.complaint_id}`}>{c.title}</Link>
                </div>
                <div className="item-meta">
                  <span className="badge">{c.category}</span>
                  <span className={`badge ${c.status === 'resolved' ? 'success' : c.status === 'pending' ? 'warning' : c.status === 'rejected' ? 'danger' : ''}`}>{c.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ComplaintsPage;


