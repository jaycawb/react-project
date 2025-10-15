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
    <div className="container">
      <h1 className="mb-lg">Manage Complaints</h1>
      {error && <div className="alert error mb-md">{error}</div>}
      {loading ? <div className="card">Loading...</div> : (
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c.complaint_id}>
                    <td style={{ maxWidth: '200px', wordWrap: 'break-word' }}>{c.title}</td>
                    <td><span className="badge">{c.category}</span></td>
                    <td>
                      <select className="input" value={c.priority} onChange={e => updateComplaint(c.complaint_id, { priority: e.target.value })}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </td>
                    <td>
                      <select className={`input ${c.status === 'pending' ? 'warning' : c.status === 'resolved' ? 'success' : c.status === 'rejected' ? 'danger' : ''}`}
                        value={c.status} onChange={e => updateComplaint(c.complaint_id, { status: e.target.value })}>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td>
                      <div className="mb-sm">
                        {c.assigned_to ? <span className="badge">{c.assigned_to}</span> : <span className="badge secondary">Unassigned</span>}
                      </div>
                      <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                        <button className="btn small secondary" onClick={() => setAssigningId(c.complaint_id)}>Assign</button>
                        {c.assigned_to && (
                          <button className="btn small secondary" onClick={() => updateComplaint(c.complaint_id, { assigned_to: null })}>Clear</button>
                        )}
                      </div>
                      {assigningId === c.complaint_id && (
                        <div className="mt-sm">
                          <UserSearch
                            label={null}
                            placeholder="Search user to assign..."
                            onSelect={(u) => {
                              updateComplaint(c.complaint_id, { assigned_to: u.computer_number });
                              setAssigningId(null);
                            }}
                          />
                          <div className="mt-sm">
                            <button className="btn small secondary" onClick={() => setAssigningId(null)}>Cancel</button>
                          </div>
                        </div>
                      )}
                    </td>
                    <td>
                      <button className="btn small success" onClick={() => updateComplaint(c.complaint_id, { status: 'resolved' })}>
                        Resolve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};


export default AdminComplaintsPage;