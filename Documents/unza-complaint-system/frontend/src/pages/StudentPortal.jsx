import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const StudentPortal = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, mRes] = await Promise.all([
          api.get('/complaints', { params: { limit: 5, computer_number: user?.computer_number } }),
          api.get('/meetings', { params: { limit: 5 } })
        ]);
        setComplaints(cRes.data?.data || []);
        setMeetings(mRes.data?.data || []);
      } catch (e) {
        setError('Failed to load portal data');
      } finally {
        setLoading(false);
      }
    };
    if (user) load();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert error">{error}</div>;

  return (
    <div>
      <h1>Student Portal</h1>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, max-content)', gap: '0.75rem', margin: '0.75rem 0' }}>
        <Link className="btn" to="/complaints/new">Submit Complaint</Link>
        <Link className="btn" to="/meetings/new">Book Meeting</Link>
        <Link className="btn secondary" to="/complaints">View My Complaints</Link>
        <Link className="btn secondary" to="/meetings">View My Meetings</Link>
      </div>
      <div className="grid two">
        <div className="card">
          <h2>Recent Complaints</h2>
          {complaints.length === 0 ? <p>No complaints</p> : (
            <ul>
              {complaints.map(c => (
                <li key={c.complaint_id}>
                  <Link className="link" to={`/complaints/${c.complaint_id}`}><strong>{c.title}</strong></Link> — {c.status}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="card">
          <h2>Upcoming Meetings</h2>
          {meetings.length === 0 ? <p>No meetings</p> : (
            <ul>
              {meetings.map(m => (
                <li key={m.meeting_id}>
                  <strong>{m.title}</strong> — {new Date(m.scheduled_at).toLocaleString()} — {m.status}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;




