import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const MeetingDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ title: '', description: '', scheduled_at: '' });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/meetings/${id}`);
        setMeeting(data.data);
        setEditData({
          title: data.data.title || '',
          description: data.data.description || '',
          scheduled_at: data.data.scheduled_at ? new Date(data.data.scheduled_at).toISOString().slice(0, 16) : ''
        });
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load meeting');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Check user permissions (only after meeting is loaded)
  const isOrganizer = user?.computer_number === meeting?.organizer_computer_number;
  const isParticipant = user?.computer_number === meeting?.participant_computer_number;
  const isAdmin = user?.role === 'admin';
  const canUpdateStatus = isAdmin || isParticipant;
  const canEditDetails = isAdmin || isOrganizer;
  const canReschedule = isAdmin || isOrganizer || isParticipant;

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    setError('');
    try {
      const response = await api.put(`/meetings/${id}`, { status: newStatus });
      if (response.data.success) {
        setMeeting(prev => ({ ...prev, status: newStatus }));
      } else {
        setError(response.data.message || 'Failed to update status');
      }
    } catch (e) {
      console.error('Status update error:', e);
      setError(e.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleReschedule = async () => {
    if (!editData.scheduled_at) return;
    setUpdating(true);
    setError('');
    try {
      const response = await api.put(`/meetings/${id}`, { scheduled_at: editData.scheduled_at });
      if (response.data.success) {
        setMeeting(prev => ({ ...prev, scheduled_at: editData.scheduled_at }));
        setEditMode(false);
      } else {
        setError(response.data.message || 'Failed to reschedule meeting');
      }
    } catch (e) {
      console.error('Reschedule error:', e);
      setError(e.response?.data?.message || 'Failed to reschedule meeting');
    } finally {
      setUpdating(false);
    }
  };

  const handleEditDetails = async () => {
    setUpdating(true);
    setError('');
    try {
      const response = await api.put(`/meetings/${id}`, {
        title: editData.title,
        description: editData.description
      });
      if (response.data.success) {
        setMeeting(prev => ({
          ...prev,
          title: editData.title,
          description: editData.description
        }));
        setEditMode(false);
      } else {
        setError(response.data.message || 'Failed to update meeting details');
      }
    } catch (e) {
      console.error('Edit details error:', e);
      setError(e.response?.data?.message || 'Failed to update meeting details');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="container"><div className="card">Loading meeting details...</div></div>;
  if (error) return <div className="container"><div className="alert error">{error}</div></div>;
  if (!meeting) return <div className="container"><div className="card">Meeting not found</div></div>;

  const statusClass = meeting.status === 'confirmed' ? 'success' : meeting.status === 'pending' ? 'warning' : meeting.status === 'cancelled' ? 'danger' : '';

  return (
    <div className="container">
      <div className="card">
        {/* Header with actions */}
        <div className="flex justify-between items-start mb-md">
          <div>
            {editMode && canEditDetails ? (
              <input
                type="text"
                className="input"
                value={editData.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}
              />
            ) : (
              <h1 style={{ marginBottom: 8 }}>{meeting.title}</h1>
            )}
            <div className="item-meta" style={{ marginBottom: 16 }}>
              <span className={`badge ${statusClass}`}>{meeting.status}</span>
              {editMode && canReschedule ? (
                <input
                  type="datetime-local"
                  className="input"
                  value={editData.scheduled_at}
                  onChange={(e) => setEditData(prev => ({ ...prev, scheduled_at: e.target.value }))}
                  style={{ marginLeft: '8px' }}
                />
              ) : (
                <span>{meeting.scheduled_at ? new Date(meeting.scheduled_at).toLocaleString() : ''}</span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-sm">
            {canEditDetails && (
              <button
                className="btn small secondary"
                onClick={() => setEditMode(!editMode)}
                disabled={updating}
              >
                {editMode ? 'Cancel' : 'Edit'}
              </button>
            )}
            {editMode && (
              <button
                className="btn small"
                onClick={canReschedule ? handleReschedule : handleEditDetails}
                disabled={updating}
              >
                Save Changes
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        {editMode && canEditDetails ? (
          <textarea
            className="textarea"
            value={editData.description}
            onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Meeting description"
            rows={3}
            style={{ marginBottom: 16 }}
          />
        ) : (
          meeting.description && <p style={{ marginBottom: 16 }}>{meeting.description}</p>
        )}

        {/* Status update buttons for participants */}
        {canUpdateStatus && meeting.status === 'pending' && (
          <div className="mb-lg">
            <h3>Update Meeting Status</h3>
            <div className="flex gap-sm">
              <button
                className="btn success"
                onClick={() => handleStatusUpdate('confirmed')}
                disabled={updating}
              >
                Confirm Meeting
              </button>
              <button
                className="btn danger"
                onClick={() => handleStatusUpdate('cancelled')}
                disabled={updating}
              >
                Decline Meeting
              </button>
            </div>
          </div>
        )}

        {/* Meeting details */}
        <div className="grid responsive md-2" style={{ gap: 'var(--space-lg)' }}>
          <div className="card" style={{ boxShadow: 'none', border: '2px solid var(--border)' }}>
            <h3>Organizer</h3>
            <div className="item-meta">
              <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                {meeting.organizer_first_name} {meeting.organizer_last_name}
              </div>
              {meeting.organizer_email && (
                <div style={{ color: 'var(--muted)', fontSize: 'var(--font-size-sm)' }}>
                  {meeting.organizer_email}
                </div>
              )}
            </div>
          </div>
          <div className="card" style={{ boxShadow: 'none', border: '2px solid var(--border)' }}>
            <h3>Participant</h3>
            <div className="item-meta">
              <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                {meeting.participant_first_name} {meeting.participant_last_name}
              </div>
              {meeting.participant_email && (
                <div style={{ color: 'var(--muted)', fontSize: 'var(--font-size-sm)' }}>
                  {meeting.participant_email}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div style={{ marginTop: 'var(--space-lg)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--border)' }}>
          <div className="flex justify-between items-center">
            <div style={{ color: 'var(--muted)', fontSize: 'var(--font-size-sm)' }}>
              Created {meeting.created_at ? new Date(meeting.created_at).toLocaleString() : ''}
            </div>
            {meeting.updated_at && meeting.updated_at !== meeting.created_at && (
              <div style={{ color: 'var(--muted)', fontSize: 'var(--font-size-sm)' }}>
                Updated {new Date(meeting.updated_at).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailsPage;




