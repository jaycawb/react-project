import React, { useEffect, useState } from 'react';
import api from '../services/api';
import UserSearch from '../components/UserSearch';

const AdminMeetingsPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [participant, setParticipant] = useState('');
  const [participantUser, setParticipantUser] = useState(null);
  const [creating, setCreating] = useState(false);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/meetings');
      setMeetings(data.meetings || data.data || []);
    } catch (e) {
      setError('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/admin/meetings', {
        title,
        description,
        scheduled_at: scheduledAt,
        participant_computer_number: participantUser?.computer_number || participant
      });
      setTitle('');
      setDescription('');
      setScheduledAt('');
      setParticipant('');
      fetchMeetings();
    } catch (e) {
      setError('Failed to create meeting');
    } finally {
      setCreating(false);
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm('Delete this meeting?')) return;
    try {
      await api.delete(`/admin/meetings/${id}`);
      fetchMeetings();
    } catch (e) {
      setError('Failed to delete meeting');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/meetings/${id}`, { status: newStatus });
      fetchMeetings();
    } catch (e) {
      setError('Failed to update status');
    }
  };

  return (
    <div>
      <h1>Admin Meetings</h1>
      <form onSubmit={handleCreate} className="form" style={{ marginBottom: 24 }}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input id="title" className="input" type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input id="description" className="input" type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="grid two">
          <div>
            <UserSearch label="Participant" onSelect={u => setParticipantUser(u)} placeholder="Search user by name, email, or number" />
            {!participantUser && (
              <div className="helper">Or enter a computer number manually.</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="scheduledAt">Scheduled At</label>
            <input id="scheduledAt" className="input" type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} required />
          </div>
        </div>
        {!participantUser && (
          <div className="form-group">
            <label htmlFor="participantManual">Participant Computer Number (manual)</label>
            <input id="participantManual" className="input" type="text" placeholder="e.g. 2021483525" value={participant} onChange={e => setParticipant(e.target.value)} />
          </div>
        )}
        <div>
          <button className="btn" type="submit" disabled={creating}>Create Meeting</button>
        </div>
      </form>
      {loading ? (
        <div>Loading meetings...</div>
      ) : error ? (
        <div className="alert error">{error}</div>
      ) : (
        <div className="card" style={{ marginTop: 16 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Organizer</th>
              <th>Participant</th>
              <th>Status</th>
              <th>Scheduled At</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {meetings.length === 0 ? (
              <tr><td colSpan="8">No meetings found.</td></tr>
            ) : meetings.map(m => (
              <tr key={m.meeting_id}>
                <td>{m.title}</td>
                <td>{m.description}</td>
                <td>{m.organizer_computer_number}</td>
                <td>{m.participant_computer_number}</td>
                <td>
                  <select className="input"
                    value={m.status}
                    onChange={e => handleStatusChange(m.meeting_id, e.target.value)}
                  >
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </td>
                <td>{m.scheduled_at ? new Date(m.scheduled_at).toLocaleString() : ''}</td>
                <td>{m.created_at ? new Date(m.created_at).toLocaleString() : ''}</td>
                <td>
                  <button className="btn secondary" onClick={() => handleDelete(m.meeting_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default AdminMeetingsPage;
