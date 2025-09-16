import React, { useEffect, useState } from 'react';
import api from '../services/api';

const AdminReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/complaints/admin/stats');
        setStats(data.data?.overview || null);
        setTrend(data.data?.trends || []);
      } catch (e) {
        setError('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Reports</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div style={{ border: '1px solid #eee', padding: '1rem' }}>
          <h3>Total</h3>
          <div style={{ fontSize: 24 }}>{stats?.total_complaints}</div>
        </div>
        <div style={{ border: '1px solid #eee', padding: '1rem' }}>
          <h3>Pending</h3>
          <div style={{ fontSize: 24 }}>{stats?.pending}</div>
        </div>
        <div style={{ border: '1px solid #eee', padding: '1rem' }}>
          <h3>Resolved</h3>
          <div style={{ fontSize: 24 }}>{stats?.resolved}</div>
        </div>
      </div>
      <h2 style={{ marginTop: '1rem' }}>30-day Trend</h2>
      {trend.length === 0 ? <p>No data</p> : (
        <ul>
          {trend.map(t => (
            <li key={t.date}>{t.date}: {t.daily_count}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminReportsPage;




