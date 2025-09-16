import React, { useEffect, useState } from 'react';
import api from '../services/api';
import UserSearch from '../components/UserSearch';

const AdminComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/complaints', { params: { limit: 20 } });
      setComplaints(data.data || []);
    } catch (e) {
      setError('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateComplaint = async (id, payload) => {
    await api.put(`/complaints/${id}`, payload);
    await load();
  };

  const [assigningId, setAssigningId] = useState(null);

  return (
    <div className="container" style={{ maxWidth: 1200 }}>
      <h1 style={{ marginBottom: 24 }}>Manage Complaints</h1>
      {error && <div className="alert error" style={{ marginBottom: 16 }}>{error}</div>}
      {loading ? <div className="card">Loading...</div> : (
        <div className="card">
          <table width="100%" cellPadding={8} style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th align="left">Title</th>
                <th align="left">Category</th>
                <th align="left">Priority</th>
                <th align="left">Status</th>
                <th align="left">Assigned To</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c.complaint_id} style={{ borderTop: '1px solid #eee' }}>
                  <td>{c.title}</td>
                  <td><span className={`badge`}>{c.category}</span></td>
                  <td>
                    <select className="input" value={c.priority} onChange={e => updateComplaint(c.complaint_id, { priority: e.target.value })}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </td>
                  <td>
                    <select className={`input badge ${c.status === 'pending' ? 'warning' : c.status === 'resolved' ? 'success' : c.status === 'rejected' ? 'danger' : ''}`}
                      value={c.status} onChange={e => updateComplaint(c.complaint_id, { status: e.target.value })}>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td style={{ position: 'relative' }}>
                    {c.assigned_to ? <span className="badge">{c.assigned_to}</span> : <span className="badge">Unassigned</span>}
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(2, max-content)', gap: 8, marginTop: 8 }}>
                      <button className="btn secondary" onClick={() => setAssigningId(c.complaint_id)}>Assign</button>
                      {c.assigned_to && (
                        <button className="btn secondary" onClick={() => updateComplaint(c.complaint_id, { assigned_to: null })}>Clear</button>
                      )}
                    </div>
                    {assigningId === c.complaint_id && (
                      <div style={{ marginTop: 8 }}>
                        <UserSearch
                          label={null}
                          placeholder="Search user to assign..."
                          onSelect={(u) => {
                            updateComplaint(c.complaint_id, { assigned_to: u.computer_number });
                            setAssigningId(null);
                          }}
                        />
                        <div className="grid" style={{ gridTemplateColumns: 'max-content', marginTop: 8 }}>
                          <button className="btn secondary" onClick={() => setAssigningId(null)}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </td>
                  <td>
                    <button className="btn secondary" onClick={() => updateComplaint(c.complaint_id, { status: 'resolved' })}>Mark Resolved</button>
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

export default AdminComplaintsPage;