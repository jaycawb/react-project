import React, { useEffect, useState } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const { data } = await api.get('/admin/overview');
        setOverview(data.data);
      } catch (e) {
        setError('Failed to load admin overview');
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) return <div className="card">Loading...</div>;
  if (error) return <div className="card">{error}</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div className="grid two" style={{ marginTop: '16px' }}>
        <div className="card">
          <h3>Complaints</h3>
          <div className="grid three" style={{ marginTop: '12px' }}>
            <div className="card" style={{ padding: '12px' }}>
              <div className="badge">Total</div>
              <h2>{overview.complaints?.total ?? 0}</h2>
            </div>
            <div className="card" style={{ padding: '12px' }}>
              <div className="badge warning">Pending</div>
              <h2>{overview.complaints?.pending ?? 0}</h2>
            </div>
            <div className="card" style={{ padding: '12px' }}>
              <div className="badge">In Progress</div>
              <h2>{overview.complaints?.in_progress ?? 0}</h2>
            </div>
            <div className="card" style={{ padding: '12px' }}>
              <div className="badge success">Resolved</div>
              <h2>{overview.complaints?.resolved ?? 0}</h2>
            </div>
            <div className="card" style={{ padding: '12px' }}>
              <div className="badge danger">Rejected</div>
              <h2>{overview.complaints?.rejected ?? 0}</h2>
            </div>
            <div className="card" style={{ padding: '12px' }}>
              <div className="badge danger">Urgent</div>
              <h2>{overview.complaints?.urgent ?? 0}</h2>
            </div>
          </div>
        </div>
        <div className="card">
          <h3>Users</h3>
          <div className="grid three" style={{ marginTop: '12px' }}>
            <div className="card" style={{ padding: '12px' }}>
              <div className="badge">Total</div>
              <h2>{overview.users?.total ?? 0}</h2>
            </div>
            <div className="card" style={{ padding: '12px' }}>
              <div className="badge">Students</div>
              <h2>{overview.users?.students ?? 0}</h2>
            </div>
            <div className="card" style={{ padding: '12px' }}>
              <div className="badge">Lecturers</div>
              <h2>{overview.users?.lecturers ?? 0}</h2>
            </div>
            <div className="card" style={{ padding: '12px' }}>
              <div className="badge">Admins</div>
              <h2>{overview.users?.admins ?? 0}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


