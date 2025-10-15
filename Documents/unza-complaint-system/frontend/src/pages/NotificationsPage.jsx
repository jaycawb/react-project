import React, { useEffect, useState } from 'react';
import api from '../services/api';

const NotificationsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState({});

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/notifications', { params: { limit: 50 } });
      setItems(data.data || []);
    } catch (e) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const markSelectedRead = async () => {
    const ids = Object.entries(selected).filter(([, v]) => v).map(([k]) => parseInt(k));
    if (ids.length === 0) return;
    await api.put('/notifications/mark-read', { notification_ids: ids });
    setSelected({});
    await load();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert error">{error}</div>;

  return (
    <div>
      <h1>Notifications</h1>
      <div className="grid" style={{ gridTemplateColumns: 'max-content max-content', gap: 8, margin: '8px 0' }}>
        <button className="btn secondary" onClick={load}>Refresh</button>
        <button className="btn" onClick={markSelectedRead} disabled={Object.values(selected).every(v => !v)}>Mark Read</button>
      </div>
      <div className="card">
        {items.length === 0 ? (
          <p>No notifications.</p>
        ) : (
          <ul className="list">
            {items.map((n) => (
              <li key={n.notification_id} className="list-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input type="checkbox" checked={!!selected[n.notification_id]} onChange={(e) => setSelected((prev) => ({ ...prev, [n.notification_id]: e.target.checked }))} />
                  <div>
                    <div className="item-meta" style={{ gap: 8 }}>
                      <span className={`badge ${n.status === 'sent' ? 'warning' : ''}`}>{n.status}</span>
                      <span className="badge">{n.type}</span>
                      <span>{new Date(n.created_at).toLocaleString()}</span>
                    </div>
                    <div style={{ marginTop: 6 }}>{n.message}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;




