import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the UNZA Complaint & Meeting System.</p>
      <div className="grid two" style={{ marginTop: '16px' }}>
        <div className="card">
          <h3>Quick Actions</h3>
          <p>Create a complaint or schedule a meeting.</p>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(2, max-content)', gap: '0.75rem', marginTop: 12 }}>
            <Link className="btn" to="/complaints/new">+ New Complaint</Link>
            <Link className="btn" to="/meetings/new">+ Schedule Meeting</Link>
          </div>
        </div>
        <div className="card">
          <h3>Recent Activity</h3>
          <p>Your latest updates will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;


