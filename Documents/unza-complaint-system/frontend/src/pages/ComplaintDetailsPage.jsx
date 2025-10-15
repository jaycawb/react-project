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
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

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

  const handleStatusUpdate = async () => {
    setUpdating(true);
    setUpdateError('');
    setUpdateSuccess('');

    try {
      const { data } = await api.put(`/complaints/${id}/status`, { status: complaint.status });
      setComplaint(data.data);
      setUpdateSuccess('Status updated successfully!');
      // Clear success message after 3 seconds
      setTimeout(() => setUpdateSuccess(''), 3000);
    } catch (e) {
      const errorMessage = e.response?.data?.message || 'Failed to update status';
      setUpdateError(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in_progress': return '';
      case 'resolved': return 'success';
      case 'rejected': return 'danger';
      case 'closed': return 'secondary';
      default: return '';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'urgent': return 'danger';
      case 'high': return 'warning';
      case 'medium': return '';
      case 'low': return 'secondary';
      default: return '';
    }
  };

  if (loading) return (
    <div className="card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
      <div>Loading complaint details...</div>
    </div>
  );

  if (error) return (
    <div className="card">
      <div className="alert error">{error}</div>
    </div>
  );

  if (!complaint) return (
    <div className="card">
      <div className="alert error">Complaint not found</div>
    </div>
  );

  const canUpdateStatus = complaint.assigned_to === user?.computer_number;
  const isOwner = complaint.computer_number === user?.computer_number;

  return (
    <div className="container">
      <div className="card">
        <div className="mb-lg">
          <h1 className="mb-sm">{complaint.title}</h1>
          <div className="flex gap-sm" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
            <span className={`badge ${getStatusBadgeClass(complaint.status)}`}>
              {complaint.status.replace('_', ' ').toUpperCase()}
            </span>
            <span className={`badge ${getPriorityBadgeClass(complaint.priority)}`}>
              {complaint.priority.toUpperCase()} PRIORITY
            </span>
            <span className="badge">{complaint.category.replace('_', ' ').toUpperCase()}</span>
          </div>
        </div>

        <div className="grid responsive md-2" style={{ marginBottom: '24px' }}>
          <div>
            <h3 style={{ marginBottom: '16px', color: 'var(--text)' }}>Complaint Details</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <strong>Submitted:</strong> {new Date(complaint.created_at).toLocaleString()}
              </div>
              {complaint.updated_at && (
                <div>
                  <strong>Last Updated:</strong> {new Date(complaint.updated_at).toLocaleString()}
                </div>
              )}
              <div>
                <strong>Priority:</strong> {complaint.priority}
              </div>
              <div>
                <strong>Category:</strong> {complaint.category.replace('_', ' ')}
              </div>
              {complaint.assigned_to && (
                <div>
                  <strong>Assigned To:</strong> {complaint.assigned_to}
                </div>
              )}
              {complaint.anonymous && (
                <div>
                  <strong>Submitted:</strong> <span className="badge secondary">ANONYMOUSLY</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '16px', color: 'var(--text)' }}>Description</h3>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.5'
            }}>
              {complaint.description}
            </div>
          </div>
        </div>

        {/* Admin Response */}
        {(complaint.admin_response || complaint.admin_notes) && (
          <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
            <h3 style={{ marginBottom: '12px', color: 'var(--text)' }}>Admin Response</h3>
            {complaint.admin_response && (
              <div style={{ marginBottom: '12px' }}>
                <strong>Response:</strong>
                <div style={{ marginTop: '4px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                  {complaint.admin_response}
                </div>
              </div>
            )}
            {complaint.admin_notes && (
              <div>
                <strong>Internal Notes:</strong>
                <div style={{ marginTop: '4px', fontSize: '14px', color: 'var(--muted)', fontStyle: 'italic' }}>
                  {complaint.admin_notes}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Status Update Section for Assigned Users */}
        {canUpdateStatus && (
          <div style={{
            marginTop: '24px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--text)' }}>Update Complaint Status</h3>
            <p style={{ marginBottom: '16px', color: 'var(--muted)' }}>
              As the assigned handler for this complaint, you can update its status to reflect progress.
            </p>

            {updateError && <div className="alert error" style={{ marginBottom: '16px' }}>{updateError}</div>}
            {updateSuccess && <div className="alert success" style={{ marginBottom: '16px' }}>{updateSuccess}</div>}

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                className="select"
                value={complaint.status}
                onChange={(e) => setComplaint(prev => ({ ...prev, status: e.target.value }))}
                disabled={updating}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div style={{ marginTop: '16px' }}>
              <button
                className="btn"
                onClick={handleStatusUpdate}
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        )}

        {/* Owner Information */}
        {isOwner && !complaint.anonymous && (
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#fff3cd',
            borderRadius: '8px',
            border: '1px solid #ffeaa7'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>ℹ️</span>
              <strong>This is your complaint.</strong>
            </div>
            <p style={{ margin: '8px 0 0 0', color: 'var(--muted)' }}>
              You submitted this complaint. If you need to make changes or have questions, please contact an administrator.
            </p>
          </div>
        )}

        {/* Contact Information (if available and user has permission) */}
        {(complaint.contact_email || complaint.contact_phone) && (canUpdateStatus || user?.role === 'admin') && (
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <h3 style={{ marginBottom: '12px', color: 'var(--text)' }}>Contact Information</h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              {complaint.contact_email && (
                <div><strong>Email:</strong> {complaint.contact_email}</div>
              )}
              {complaint.contact_phone && (
                <div><strong>Phone:</strong> {complaint.contact_phone}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetailsPage;




