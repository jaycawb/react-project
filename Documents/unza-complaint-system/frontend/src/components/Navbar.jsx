import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="nav">
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/dashboard">Dashboard</Link>
        {user?.role === 'student' && <Link to="/student">Student</Link>}
        <Link to="/complaints">Complaints</Link>
        <Link to="/meetings">Meetings</Link>
        {user?.role === 'admin' && (
          <>
            <Link to="/admin">Admin</Link>
            <Link to="/admin/complaints">Manage Complaints</Link>
            <Link to="/admin/meetings">Manage Meetings</Link>
            <Link to="/admin/reports">Reports</Link>
          </>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user && <NotificationBell />}
          {user ? (
            <>
              <Link to="/profile">{user.first_name || 'Profile'}</Link>
              <button className="btn secondary" onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn secondary">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;


