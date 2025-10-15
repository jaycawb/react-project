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
    <div className="container">
      {/* Header */}
      <div className="flex justify-between items-center mb-lg">
        <div>
          <h1 style={{ margin: 0, color: 'var(--text)' }}>Reports & Analytics</h1>
          <p style={{ color: 'var(--muted)', margin: 'var(--space-xs) 0 0 0' }}>
            Comprehensive overview of system activity and complaint trends
          </p>
        </div>
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: 'var(--primary)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2z"></path>
            <path d="M13 19v-6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2z"></path>
            <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"></path>
            <line x1="9" y1="9" x2="15" y2="9"></line>
            <line x1="9" y1="13" x2="15" y2="13"></line>
          </svg>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="card mb-lg">
        <h2 style={{ marginBottom: 'var(--space-md)', color: 'var(--text)' }}>Key Metrics</h2>
        <div className="grid responsive md-2 lg-4" style={{ gap: 'var(--space-md)' }}>
          <div className="card" style={{
            textAlign: 'center',
            padding: 'var(--space-xl)',
            boxShadow: 'none',
            border: '2px solid var(--border)',
            background: 'linear-gradient(135deg, var(--bg-elev), rgba(255,255,255,0.8))'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: 'var(--primary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-md)'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2 4-4"></path>
                <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path>
                <path d="M3 21h18c.552 0 1-.448 1-1v-6c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1z"></path>
              </svg>
            </div>
            <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', color: 'var(--primary)', marginBottom: 'var(--space-xs)' }}>
              {stats?.total_complaints || 0}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 'var(--font-size-sm)', fontWeight: '500' }}>Total Complaints</div>
          </div>

          <div className="card" style={{
            textAlign: 'center',
            padding: 'var(--space-xl)',
            boxShadow: 'none',
            border: '2px solid var(--warning)',
            background: 'linear-gradient(135deg, var(--bg-elev), rgba(255,255,255,0.8))'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: 'var(--warning)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-md)'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12,6 12,12 16,14"></polyline>
              </svg>
            </div>
            <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', color: 'var(--warning)', marginBottom: 'var(--space-xs)' }}>
              {stats?.pending || 0}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 'var(--font-size-sm)', fontWeight: '500' }}>Pending</div>
          </div>

          <div className="card" style={{
            textAlign: 'center',
            padding: 'var(--space-xl)',
            boxShadow: 'none',
            border: '2px solid var(--success)',
            background: 'linear-gradient(135deg, var(--bg-elev), rgba(255,255,255,0.8))'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: 'var(--success)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-md)'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
            </div>
            <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', color: 'var(--success)', marginBottom: 'var(--space-xs)' }}>
              {stats?.resolved || 0}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 'var(--font-size-sm)', fontWeight: '500' }}>Resolved</div>
          </div>

          <div className="card" style={{
            textAlign: 'center',
            padding: 'var(--space-xl)',
            boxShadow: 'none',
            border: '2px solid var(--danger)',
            background: 'linear-gradient(135deg, var(--bg-elev), rgba(255,255,255,0.8))'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: 'var(--danger)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-md)'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', color: 'var(--danger)', marginBottom: 'var(--space-xs)' }}>
              {stats?.rejected || 0}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 'var(--font-size-sm)', fontWeight: '500' }}>Rejected</div>
          </div>
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="card">
        <div className="flex justify-between items-center mb-md">
          <h2 style={{ margin: 0, color: 'var(--text)' }}>30-Day Complaint Trends</h2>
          <div style={{
            padding: 'var(--space-xs) var(--space-sm)',
            backgroundColor: 'var(--primary)',
            color: 'white',
            borderRadius: '20px',
            fontSize: 'var(--font-size-xs)',
            fontWeight: '500'
          }}>
            Last 30 Days
          </div>
        </div>

        {trend.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-2xl)',
            color: 'var(--muted)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: 'var(--border)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-lg)'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"></path>
                <path d="M18.7 8l-5.1 5.1-2.8-2.8L7 14.2"></path>
                <path d="M13 6h5v5"></path>
              </svg>
            </div>
            <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-md)' }}>No trend data available</p>
            <p>Complaint trends will appear here as data becomes available.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${trend.length}, minmax(60px, 1fr))`,
              gap: 'var(--space-sm)',
              minWidth: '600px'
            }}>
              {trend.map((day, index) => (
                <div key={day.date} style={{ textAlign: 'center' }}>
                  <div style={{
                    height: `${Math.max(40, (day.daily_count || 0) * 8)}px`,
                    backgroundColor: index % 2 === 0 ? 'var(--primary)' : 'var(--success)',
                    borderRadius: '4px 4px 0 0',
                    marginBottom: 'var(--space-sm)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'end',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'bold',
                    minHeight: '40px'
                  }}>
                    {day.daily_count > 0 && day.daily_count}
                  </div>
                  <div style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--muted)',
                    fontWeight: '500'
                  }}>
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 'var(--space-lg)',
              padding: 'var(--space-md)',
              backgroundColor: 'var(--bg)',
              borderRadius: '8px',
              border: '1px solid var(--border)'
            }}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 style={{ margin: '0 0 var(--space-xs) 0', color: 'var(--text)' }}>Summary</h3>
                  <p style={{ margin: 0, color: 'var(--muted)', fontSize: 'var(--font-size-sm)' }}>
                    Total complaints in the last 30 days: <strong>{trend.reduce((sum, day) => sum + (day.daily_count || 0), 0)}</strong>
                  </p>
                </div>
                <div className="flex gap-sm">
                  <div className="flex items-center gap-xs">
                    <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--primary)', borderRadius: '2px' }}></div>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--muted)' }}>Even Days</span>
                  </div>
                  <div className="flex items-center gap-xs">
                    <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--success)', borderRadius: '2px' }}></div>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--muted)' }}>Odd Days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReportsPage;




