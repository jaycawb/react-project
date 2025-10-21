import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminUserForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    computer_number: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'student',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/users', form);
      navigate('/admin/users');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <button
          className="btn secondary"
          onClick={() => navigate('/admin/users')}
          style={{ marginBottom: '1rem' }}
        >
          ← Back to Users
        </button>
        <h1>Add New User</h1>
      </div>

      {error && <div className="alert error" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div className="card">
        <form onSubmit={onSubmit} className="form">
          <div className="form-group">
            <label htmlFor="computer_number">Computer Number *</label>
            <input
              id="computer_number"
              className="input"
              name="computer_number"
              type="text"
              placeholder="e.g. 2021483525"
              value={form.computer_number}
              onChange={onChange}
              pattern="[0-9]{10}"
              title="Computer number must be 10 digits"
              required
            />
          </div>

          <div className="grid two">
            <div className="form-group">
              <label htmlFor="first_name">First Name *</label>
              <input
                id="first_name"
                className="input"
                name="first_name"
                type="text"
                placeholder="Enter first name"
                value={form.first_name}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Last Name *</label>
              <input
                id="last_name"
                className="input"
                name="last_name"
                type="text"
                placeholder="Enter last name"
                value={form.last_name}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              className="input"
              name="email"
              type="email"
              placeholder="your.name@unza.zm"
              value={form.email}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              className="input"
              name="phone"
              type="tel"
              placeholder="+260977123456"
              value={form.phone}
              onChange={onChange}
              pattern="\+260[0-9]{9}"
              title="Phone number format: +260XXXXXXXXX"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role *</label>
            <select
              id="role"
              className="select"
              name="role"
              value={form.role}
              onChange={onChange}
              required
            >
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              className="input"
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={onChange}
              minLength="6"
              required
            />
            <small style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
              Password must be at least 6 characters long
            </small>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button className="btn" type="submit" disabled={loading} style={{ marginRight: '1rem' }}>
              {loading ? 'Creating User...' : 'Create User'}
            </button>
            <button
              className="btn secondary"
              type="button"
              onClick={() => navigate('/admin/users')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUserForm;