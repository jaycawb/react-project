import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: ''
  });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;

      const { data } = await api.get('/users', { params });
      setUsers(data.data || []);
    } catch (e) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    loadUsers();
  }, [search, roleFilter, loadUsers]);

  const handleEdit = (user) => {
    setEditingUser(user.computer_number);
    setEditForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      role: user.role
    });
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/users/${editingUser}`, editForm);
      setEditingUser(null);
      await loadUsers();
    } catch (e) {
      setError('Failed to update user');
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      role: ''
    });
  };

  const handleDelete = async (computerNumber) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/users/${computerNumber}`);
      await loadUsers();
    } catch (e) {
      setError('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !search ||
      user.first_name.toLowerCase().includes(search.toLowerCase()) ||
      user.last_name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.computer_number.includes(search);

    const matchesRole = !roleFilter || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="container" style={{ maxWidth: '1200px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ margin: 0 }}>User Management</h1>
          <Link className="btn" to="/register" style={{ textDecoration: 'none' }}>
            ➕ Add New User
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-md wrap" style={{ marginBottom: '1rem' }}>
          <div className="form-group" style={{ margin: 0, minWidth: '200px' }}>
            <input
              type="text"
              className="input"
              placeholder="Search by name, email, or computer number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ margin: 0, minWidth: '150px' }}>
            <select
              className="select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="student">Students</option>
              <option value="lecturer">Lecturers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          <button className="btn secondary" onClick={() => { setSearch(''); setRoleFilter(''); }}>
            Clear Filters
          </button>
        </div>
      </div>

      {error && <div className="alert error" style={{ marginBottom: '1rem' }}>{error}</div>}

      {loading ? (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Loading users...</div>
            <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Computer Number</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                      {users.length === 0 ? 'No users found.' : 'No users match your filters.'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.computer_number}>
                      <td style={{ fontWeight: '600' }}>{user.computer_number}</td>
                      <td>
                        {editingUser === user.computer_number ? (
                          <div className="flex gap-sm">
                            <input
                              type="text"
                              className="input"
                              value={editForm.first_name}
                              onChange={(e) => setEditForm(prev => ({ ...prev, first_name: e.target.value }))}
                              placeholder="First name"
                              style={{ width: '80px' }}
                            />
                            <input
                              type="text"
                              className="input"
                              value={editForm.last_name}
                              onChange={(e) => setEditForm(prev => ({ ...prev, last_name: e.target.value }))}
                              placeholder="Last name"
                              style={{ width: '80px' }}
                            />
                          </div>
                        ) : (
                          `${user.first_name} ${user.last_name}`
                        )}
                      </td>
                      <td>
                        {editingUser === user.computer_number ? (
                          <input
                            type="email"
                            className="input"
                            value={editForm.email}
                            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Email"
                          />
                        ) : (
                          user.email
                        )}
                      </td>
                      <td>
                        {editingUser === user.computer_number ? (
                          <input
                            type="tel"
                            className="input"
                            value={editForm.phone}
                            onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="Phone"
                          />
                        ) : (
                          user.phone
                        )}
                      </td>
                      <td>
                        {editingUser === user.computer_number ? (
                          <select
                            className="select"
                            value={editForm.role}
                            onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                          >
                            <option value="student">Student</option>
                            <option value="lecturer">Lecturer</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span className={`badge ${user.role === 'admin' ? 'danger' : user.role === 'lecturer' ? 'success' : ''}`}>
                            {user.role}
                          </span>
                        )}
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="flex gap-sm">
                          {editingUser === user.computer_number ? (
                            <>
                              <button className="btn small" onClick={handleSaveEdit}>
                                ✓ Save
                              </button>
                              <button className="btn small secondary" onClick={handleCancelEdit}>
                                ✕ Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button className="btn small secondary" onClick={() => handleEdit(user)}>
                                ✏️ Edit
                              </button>
                              <button
                                className="btn small danger"
                                onClick={() => handleDelete(user.computer_number)}
                              >
                                🗑️ Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary */}
      {!loading && (
        <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
          Showing {filteredUsers.length} of {users.length} users
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;