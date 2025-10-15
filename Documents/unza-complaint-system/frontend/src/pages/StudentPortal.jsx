import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const StudentPortal = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, mRes] = await Promise.all([
          api.get('/complaints', { params: { limit: 5, computer_number: user?.computer_number } }),
          api.get('/meetings', { params: { limit: 5 } })
        ]);
        setComplaints(cRes.data?.data || []);
        setMeetings(mRes.data?.data || []);
      } catch (e) {
        setError('Failed to load portal data');
      } finally {
        setLoading(false);
      }
    };
    if (user) load();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert error">{error}</div>;

  return (
    <div className="container">
      {/* Welcome Header */}
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-600))', color: 'white', marginBottom: 'var(--space-lg)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 style={{ color: 'white', marginBottom: 'var(--space-xs)' }}>Welcome to Student Portal</h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: 'var(--font-size-base)' }}>
              Hello {user?.first_name || 'Student'}! Manage your complaints and meetings here.
            </p>
          </div>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mb-lg">
        <h2 style={{ marginBottom: 'var(--space-md)', color: 'var(--text)' }}>Quick Actions</h2>
        <div className="grid responsive md-2 lg-4" style={{ gap: 'var(--space-md)' }}>
          <Link className="btn success" to="/complaints/new" style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-sm)'
            }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
              </svg>
            </div>
            <div>Submit Complaint</div>
          </Link>
          <Link className="btn" to="/meetings/new" style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-sm)'
            }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div>Book Meeting</div>
          </Link>
          <Link className="btn secondary" to="/complaints" style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-sm)'
            }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 12l2 2 4-4"></path>
                <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path>
                <path d="M3 21h18c.552 0 1-.448 1-1v-6c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1z"></path>
              </svg>
            </div>
            <div>My Complaints</div>
          </Link>
          <Link className="btn secondary" to="/meetings" style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-sm)'
            }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div>My Meetings</div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid responsive md-2" style={{ gap: 'var(--space-lg)' }}>
        <div className="card">
          <div className="flex items-center justify-between mb-md">
            <h2 style={{ margin: 0, color: 'var(--text)' }}>Recent Complaints</h2>
            <Link className="btn small secondary" to="/complaints">View All</Link>
          </div>
          {complaints.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--muted)' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: 'var(--border)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-lg)'
              }}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--muted)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10,9 9,9 8,9"></polyline>
                </svg>
              </div>
              <p style={{ marginBottom: 'var(--space-lg)', color: 'var(--muted)' }}>No complaints submitted yet</p>
              <Link className="btn small" to="/complaints/new">Submit Your First Complaint</Link>
            </div>
          ) : (
            <div className="list">
              {complaints.map(c => (
                <div key={c.complaint_id} className="list-item">
                  <div className="item-title">
                    <Link to={`/complaints/${c.complaint_id}`} style={{ color: 'var(--text)', textDecoration: 'none' }}>
                      {c.title}
                    </Link>
                  </div>
                  <div className="item-meta">
                    <span className={`badge ${c.status === 'resolved' ? 'success' : c.status === 'pending' ? 'warning' : c.status === 'rejected' ? 'danger' : ''}`}>
                      {c.status.replace('_', ' ')}
                    </span>
                    <span>{c.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-md">
            <h2 style={{ margin: 0, color: 'var(--text)' }}>Upcoming Meetings</h2>
            <Link className="btn small secondary" to="/meetings">View All</Link>
          </div>
          {meetings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--muted)' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: 'var(--border)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-lg)'
              }}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--muted)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <p style={{ marginBottom: 'var(--space-lg)', color: 'var(--muted)' }}>No meetings scheduled</p>
              <Link className="btn small" to="/meetings/new">Schedule Your First Meeting</Link>
            </div>
          ) : (
            <div className="list">
              {meetings.map(m => (
                <div key={m.meeting_id} className="list-item">
                  <div className="item-title">
                    <strong>{m.title}</strong>
                  </div>
                  <div className="item-meta">
                    <span className={`badge ${m.status === 'confirmed' ? 'success' : m.status === 'pending' ? 'warning' : m.status === 'cancelled' ? 'danger' : ''}`}>
                      {m.status}
                    </span>
                    <span>{new Date(m.scheduled_at).toLocaleDateString()}</span>
                    <span>{new Date(m.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
        <h2 style={{ marginBottom: 'var(--space-md)', color: 'var(--text)' }}>Your Activity Summary</h2>
        <div className="grid responsive md-3 lg-4" style={{ gap: 'var(--space-md)' }}>
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-lg)', boxShadow: 'none', border: '2px solid var(--border)' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--border)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-sm)'
            }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--muted)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 12l2 2 4-4"></path>
                <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path>
                <path d="M3 21h18c.552 0 1-.448 1-1v-6c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1z"></path>
              </svg>
            </div>
            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', color: 'var(--text)' }}>{complaints.length}</div>
            <div style={{ color: 'var(--muted)', fontSize: 'var(--font-size-sm)' }}>Total Complaints</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-lg)', boxShadow: 'none', border: '2px solid var(--border)' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--border)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-sm)'
            }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--muted)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', color: 'var(--text)' }}>{meetings.length}</div>
            <div style={{ color: 'var(--muted)', fontSize: 'var(--font-size-sm)' }}>Total Meetings</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-lg)', boxShadow: 'none', border: '2px solid var(--border)' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--success)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-sm)'
            }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
            </div>
            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', color: 'var(--success)' }}>
              {complaints.filter(c => c.status === 'resolved').length}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 'var(--font-size-sm)' }}>Resolved</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-lg)', boxShadow: 'none', border: '2px solid var(--border)' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--warning)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-sm)'
            }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12,6 12,12 16,14"></polyline>
              </svg>
            </div>
            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', color: 'var(--warning)' }}>
              {complaints.filter(c => c.status === 'pending' || c.status === 'in_progress').length}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 'var(--font-size-sm)' }}>Pending</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;




