import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import UserSearch from '../components/UserSearch';

const MeetingFormPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', participant_computer_number: '', scheduled_at: '' });
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { ...form };
      if (participant?.computer_number) {
        payload.participant_computer_number = participant.computer_number;
      }
      await api.post('/meetings', payload);
      navigate('/meetings');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Schedule Meeting</h1>
      {error && <div className="alert error">{error}</div>}
      <form onSubmit={onSubmit} className="form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input id="title" className="input" name="title" placeholder="Title" value={form.title} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" className="textarea" name="description" placeholder="Agenda or notes" value={form.description} onChange={onChange} rows={4} />
        </div>
        <UserSearch
          label="Participant"
          role={undefined}
          onSelect={(u) => setParticipant(u)}
          placeholder="Search by name, email, or computer number..."
        />
        {!participant && (
          <div className="helper">Select a participant above. You can still type a computer number manually if needed.</div>
        )}
        <div className="form-group">
          <label htmlFor="scheduled_at">Scheduled At</label>
          <input id="scheduled_at" className="input" type="datetime-local" name="scheduled_at" value={form.scheduled_at} onChange={onChange} required />
        </div>
        <div>
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Scheduling...' : 'Schedule'}</button>
        </div>
      </form>
    </div>
  );
};

export default MeetingFormPage;



