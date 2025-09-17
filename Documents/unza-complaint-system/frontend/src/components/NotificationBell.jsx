import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const NotificationBell = () => {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { data } = await api.get('/notifications/unread-count');
        setUnread(data?.data?.unread_count || 0);
      } catch (e) {
        // silent
      }
    };
    fetchUnread();
    const id = setInterval(fetchUnread, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <Link to="/notifications" style={{ position: 'relative' }} title="Notifications">
      <span role="img" aria-label="bell">🔔</span>
      {unread > 0 && (
        <span style={{
          position: 'absolute', top: -6, right: -10, backgroundColor: 'red', color: 'white',
          borderRadius: '50%', fontSize: 12, minWidth: 18, height: 18, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '0 4px'
        }}>{unread}</span>
      )}
    </Link>
  );
};

export default NotificationBell;


