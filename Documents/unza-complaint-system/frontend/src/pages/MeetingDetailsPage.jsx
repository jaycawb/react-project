import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const MeetingDetailsPage = () => {
  const { id } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/meetings/${id}`);
        setMeeting(data.data);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load meeting');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert error">{error}</div>;
  if (!meeting) return <div>Not found</div>;

  const statusClass = meeting.status === 'confirmed' ? 'success' : meeting.status === 'pending' ? 'warning' : meeting.status === 'cancelled' ? 'danger' : '';

  return (
    <div className="card">
      <h1 style={{ marginBottom: 8 }}>{meeting.title}</h1>
      <div className="item-meta" style={{ marginBottom: 16 }}>
        <span className={`badge ${statusClass}`}>{meeting.status}</span>
        <span>{meeting.scheduled_at ? new Date(meeting.scheduled_at).toLocaleString() : ''}</span>
      </div>
      {meeting.description && <p style={{ marginBottom: 16 }}>{meeting.description}</p>}
      <div className="grid two">
        <div className="card" style={{ boxShadow: 'none' }}>
          <h3>Organizer</h3>
          <div className="item-meta">
            <span>{meeting.organizer_first_name} {meeting.organizer_last_name}</span>
            {meeting.organizer_email && <span>{meeting.organizer_email}</span>}
          </div>
        </div>
        <div className="card" style={{ boxShadow: 'none' }}>
          <h3>Participant</h3>
          <div className="item-meta">
            <span>{meeting.participant_first_name} {meeting.participant_last_name}</span>
            {meeting.participant_email && <span>{meeting.participant_email}</span>}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 16, color: 'var(--muted)' }}>Created {meeting.created_at ? new Date(meeting.created_at).toLocaleString() : ''}</div>
    </div>
  );
};

export default MeetingDetailsPage;




