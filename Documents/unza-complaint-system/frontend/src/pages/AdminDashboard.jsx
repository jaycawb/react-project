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
    <div className="container">
      <div className="flex justify-between items-center mb-lg">
        <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
        <button className="btn" onClick={() => window.location.href = '/admin/users'}>
          Manage Users
        </button>
      </div>
      <div className="grid responsive md-2" style={{ gap: 'var(--space-lg)' }}>
        <div className="card">
          <div className="flex justify-between items-center mb-md">
            <h2 style={{ margin: 0, color: 'var(--text)' }}>Complaints Overview</h2>
            <button className="btn small secondary" onClick={() => window.location.href = '/admin/complaints'}>
              Manage Complaints
            </button>
          </div>
          <div className="grid responsive md-3" style={{ gap: 'var(--space-md)' }}>
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-lg)', boxShadow: 'none', border: '2px solid var(--border)' }}>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', color: 'var(--text)' }}>{overview.complaints?.total ?? 0}</div>
              <div style={{ color: 'var(--muted)', fontSize: 'var(--font-size-sm)' }}>Total Complaints</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-lg)', boxShadow: 'none', border: '2px solid var(--warning)' }}>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', color: 'var(--warning)' }}>{overview.complaints?.pending ?? 0}</div>
              <div style={{ color: 'var(--muted)', fontSize: 'var(--font-size-sm)' }}>Pending</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-lg)', boxShadow: 'none', border: '2px solid var(--success)' }}>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', color: 'var(--success)' }}>{overview.complaints?.resolved ?? 0}</div>
              <div style={{ color: 'var(--muted)', fontSize: 'var(--font-size-sm)' }}>Resolved</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-md">
            <h2 style={{ margin: 0, color: 'var(--text)' }}>User Management</h2>
            <button className="btn small" onClick={() => window.location.href = '/admin/users'}>
              Manage Users
            </button>
          </div>
          <div className="grid responsive md-2 lg-4" style={{ gap: 'var(--space-md)' }}>
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-lg)', boxShadow: 'none', border: '2px solid var(--border)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'var(--border)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-sm)'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', color: 'var(--text)' }}>{overview.users?.total ?? 0}</div>
              <div style={{ color: 'var(--muted)', fontSize: 'var(--font-size-sm)' }}>Total Users</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-lg)', boxShadow: 'none', border: '2px solid var(--primary)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'var(--primary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-sm)'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
              </div>
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', color: 'var(--primary)' }}>{overview.users?.students ?? 0}</div>
              <div style={{ color: 'var(--muted)', fontSize: 'var(--font-size-sm)' }}>Students</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-lg)', boxShadow: 'none', border: '2px solid var(--success)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'var(--success)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-sm)'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', color: 'var(--success)' }}>{overview.users?.lecturers ?? 0}</div>
              <div style={{ color: 'var(--muted)', fontSize: 'var(--font-size-sm)' }}>Lecturers</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-lg)', boxShadow: 'none', border: '2px solid var(--danger)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'var(--danger)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-sm)'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1l3 6 6 3-6 3-3 6-3-6-6-3 6-3z"></path>
                </svg>
              </div>
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', color: 'var(--danger)' }}>{overview.users?.admins ?? 0}</div>
              <div style={{ color: 'var(--muted)', fontSize: 'var(--font-size-sm)' }}>Admins</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
        <h2 style={{ marginBottom: 'var(--space-md)', color: 'var(--text)' }}>Quick Actions</h2>
        <div className="grid responsive md-2 lg-3" style={{ gap: 'var(--space-md)' }}>
          <button
            className="btn"
            onClick={() => window.location.href = '/admin/users'}
            style={{ textAlign: 'center', padding: 'var(--space-xl)', height: 'auto' }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-sm)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M19 8v6"></path>
                <path d="M22 11h-6"></path>
              </svg>
            </div>
            <div>Create New User</div>
          </button>

          <button
            className="btn secondary"
            onClick={() => window.location.href = '/admin/complaints'}
            style={{ textAlign: 'center', padding: 'var(--space-xl)', height: 'auto' }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--border)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-sm)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2 4-4"></path>
                <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path>
                <path d="M3 21h18c.552 0 1-.448 1-1v-6c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1z"></path>
              </svg>
            </div>
            <div>Manage Complaints</div>
          </button>

          <button
            className="btn secondary"
            onClick={() => window.location.href = '/admin/meetings'}
            style={{ textAlign: 'center', padding: 'var(--space-xl)', height: 'auto' }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--border)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-sm)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div>Manage Meetings</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


