import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const NotificationBell = () => {
  const [unread, setUnread] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchUnread = async () => {
    try {
      const { data } = await api.get('/notifications/unread-count');
      setUnread(data?.data?.unread_count || 0);
    } catch (e) {
      // silent
    }
  };

  const fetchRecentNotifications = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await api.get('/notifications', { params: { limit: 5 } });
      setRecentNotifications(data?.data || []);
    } catch (e) {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnread();
    const id = setInterval(fetchUnread, 30000); // Check every 30 seconds
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      fetchRecentNotifications();
    }
  };

  const markAsRead = async (notificationIds) => {
    try {
      await api.put('/notifications/mark-read', { notification_ids: notificationIds });
      fetchUnread(); // Refresh count
      fetchRecentNotifications(); // Refresh list
    } catch (e) {
      // silent
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'complaint': return '📋';
      case 'meeting': return '📅';
      default: return '🔔';
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={handleBellClick}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          padding: '8px',
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'var(--border)';
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.transform = 'scale(1)';
        }}
        title="Notifications"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            color: unread > 0 ? 'var(--primary)' : 'var(--muted)',
            transition: 'color 0.2s ease'
          }}
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          {unread > 0 && (
            <circle cx="18" cy="4" r="3" fill="var(--danger)" stroke="none"></circle>
          )}
        </svg>
        {unread > 0 && (
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            backgroundColor: 'var(--danger)',
            color: 'white',
            borderRadius: '10px',
            fontSize: '10px',
            minWidth: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px',
            fontWeight: '600',
            border: '2px solid white',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
          }}>
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '0',
          width: '350px',
          maxHeight: '400px',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Notifications</h4>
            <Link
              to="/notifications"
              style={{
                fontSize: '12px',
                color: '#2563eb',
                textDecoration: 'none',
                fontWeight: '500'
              }}
              onClick={() => setShowDropdown(false)}
            >
              View All
            </Link>
          </div>

          <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                Loading...
              </div>
            ) : recentNotifications.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                No notifications
              </div>
            ) : (
              recentNotifications.map((notification) => (
                <div
                  key={notification.notification_id}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #f3f4f6',
                    backgroundColor: notification.status === 'sent' ? '#fef3c7' : 'white',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onClick={() => {
                    if (notification.status === 'sent') {
                      markAsRead([notification.notification_id]);
                    }
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = notification.status === 'sent' ? '#fef3c7' : 'white'}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ fontSize: '16px', marginTop: '2px' }}>
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '13px',
                        color: '#374151',
                        lineHeight: '1.4',
                        wordWrap: 'break-word'
                      }}>
                        {notification.message}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#6b7280',
                        marginTop: '4px'
                      }}>
                        {new Date(notification.created_at).toLocaleString()}
                      </div>
                    </div>
                    {notification.status === 'sent' && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#2563eb',
                        borderRadius: '50%',
                        flexShrink: 0,
                        marginTop: '6px'
                      }} />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {recentNotifications.length > 0 && (
            <div style={{
              padding: '8px 16px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              textAlign: 'center'
            }}>
              <button
                onClick={() => markAsRead(recentNotifications.filter(n => n.status === 'sent').map(n => n.notification_id))}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;




