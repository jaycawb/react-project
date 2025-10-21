import React, { useEffect, useState } from 'react';
import api from '../services/api';

const NotificationsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState({});
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [unreadCount, setUnreadCount] = useState(0);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { limit: 50 };
      if (filter === 'unread') params.unread_only = 'true';

      const { data } = await api.get('/notifications', { params });
      setItems(data.data || []);

      // Get unread count
      const { data: countData } = await api.get('/notifications/unread-count');
      setUnreadCount(countData?.data?.unread_count || 0);
    } catch (e) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const markSelectedRead = async () => {
    const ids = Object.entries(selected).filter(([, v]) => v).map(([k]) => parseInt(k));
    if (ids.length === 0) return;
    try {
      await api.put('/notifications/mark-read', { notification_ids: ids });
      setSelected({});
      await load();
    } catch (e) {
      setError('Failed to mark notifications as read');
    }
  };

  const markAllRead = async () => {
    try {
      const unreadIds = items.filter(n => n.status === 'sent').map(n => n.notification_id);
      if (unreadIds.length === 0) return;
      await api.put('/notifications/mark-read', { notification_ids: unreadIds });
      await load();
    } catch (e) {
      setError('Failed to mark all notifications as read');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'meeting': return '📅';
      case 'complaint': return '⚠️';
      case 'system': return 'ℹ️';
      default: return '●';
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) return (
    <div className="container">
      <div className="card">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Loading notifications...</div>
          <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="container">
      <div className="alert error" style={{ marginBottom: '1rem' }}>{error}</div>
    </div>
  );

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ fontSize: '1.5rem' }}>🔔</div>
            <h1 style={{ margin: 0 }}>Notifications</h1>
          </div>
          {unreadCount > 0 && (
            <div className="badge warning" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
              {unreadCount} unread
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="tabs" style={{ marginBottom: '1rem' }}>
          <button
            className={`tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({items.length + (filter === 'all' ? 0 : unreadCount)})
          </button>
          <button
            className={`tab ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-md wrap">
          <button className="btn secondary" onClick={load} disabled={loading}>
            ⟳ Refresh
          </button>
          <button
            className="btn secondary"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            ☑ Mark All Read
          </button>
          <button
            className="btn"
            onClick={markSelectedRead}
            disabled={Object.values(selected).every(v => !v)}
          >
            ✓ Mark Selected Read ({Object.values(selected).filter(Boolean).length})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="card">
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text)' }}>No notifications</h3>
            <p style={{ margin: 0 }}>
              {filter === 'unread' ? 'You have no unread notifications.' : 'You have no notifications yet.'}
            </p>
          </div>
        ) : (
          <div>
            {/* Bulk Select Header */}
            <div style={{
              padding: '1rem',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-elev)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <input
                type="checkbox"
                id="select-all"
                checked={items.length > 0 && Object.values(selected).filter(Boolean).length === items.length}
                onChange={(e) => {
                  const newSelected = {};
                  if (e.target.checked) {
                    items.forEach(n => { newSelected[n.notification_id] = true; });
                  }
                  setSelected(newSelected);
                }}
              />
              <label htmlFor="select-all" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                Select All
              </label>
            </div>

            {/* Notifications */}
            <ul className="list" style={{ margin: 0 }}>
              {items.map((n) => (
                <li key={n.notification_id} className={`list-item ${n.status === 'sent' ? 'unread' : ''}`} style={{
                  borderBottom: '1px solid var(--border)',
                  padding: '1rem',
                  transition: 'background-color 0.2s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      style={{ marginTop: '0.25rem' }}
                      checked={!!selected[n.notification_id]}
                      onChange={(e) => setSelected((prev) => ({
                        ...prev,
                        [n.notification_id]: e.target.checked
                      }))}
                    />

                    {/* Icon */}
                    <div style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>
                      {getNotificationIcon(n.type)}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                        flexWrap: 'wrap'
                      }}>
                        <span className={`badge ${n.status === 'sent' ? 'warning' : 'success'}`}>
                          {n.status === 'sent' ? 'Unread' : 'Read'}
                        </span>
                        <span className="badge secondary">{n.type}</span>
                        <span style={{
                          fontSize: '0.85rem',
                          color: 'var(--muted)',
                          whiteSpace: 'nowrap'
                        }}>
                          {getTimeAgo(n.created_at)}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '0.95rem',
                        lineHeight: '1.4',
                        wordBreak: 'break-word'
                      }}>
                        {n.message}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Load More or Pagination could go here */}
      {items.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            Showing {items.length} notifications
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;




