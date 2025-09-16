import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MeetingsPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const { data } = await api.get('/meetings', { params: { limit: 10 } });
        setMeetings(data.data || []);
      } catch (e) {
        setError('Failed to load meetings');
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert error">{error}</div>;

  return (
    <div>
      <h1>Meetings</h1>
      <div style={{ margin: '0.5rem 0' }}>
        <Link className="btn" to="/meetings/new">+ Schedule a meeting</Link>
      </div>
      {meetings.length === 0 ? (
        <p>No meetings found.</p>
      ) : (
        <div className="card">
          <ul className="list">
            {meetings.map((m) => (
              <li key={m.meeting_id} className="list-item">
                <div className="item-title">
                  <Link to={`/meetings/${m.meeting_id}`} className="link"><strong>{m.title}</strong></Link>
                </div>
                <div className="item-meta">
                  <span>{new Date(m.scheduled_at).toLocaleString()}</span>
                  <span className={`badge ${m.status === 'confirmed' ? 'success' : m.status === 'pending' ? 'warning' : m.status === 'cancelled' ? 'danger' : ''}`}>{m.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MeetingsPage;


