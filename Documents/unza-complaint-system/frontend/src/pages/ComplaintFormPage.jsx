import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const ComplaintFormPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    anonymous: false,
    contact_email: '',
    contact_phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await api.get('/complaints/categories');
        setCategories(data.data || []);
      } catch (e) {
        // no-op
      }
    };
    loadCategories();
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        priority: form.priority,
        anonymous: form.anonymous,
        contact_email: form.contact_email || undefined,
        contact_phone: form.contact_phone || undefined
      };
      if (!form.anonymous && user?.computer_number) {
        payload.computer_number = user.computer_number;
      }
      const { data } = await api.post('/complaints', payload);
      if (data?.data?.complaint_id) {
        navigate(`/complaints/${data.data.complaint_id}`);
      } else {
        navigate('/complaints');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Submit Complaint</h1>
      {error && <div className="alert error">{error}</div>}
      <form onSubmit={onSubmit} className="form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input id="title" className="input" name="title" placeholder="Title" value={form.title} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" className="textarea" name="description" placeholder="Describe your issue" value={form.description} onChange={onChange} required rows={5} />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" className="select" name="category" value={form.category} onChange={onChange} required>
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select id="priority" className="select" name="priority" value={form.priority} onChange={onChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <label className="form-check">
          <input type="checkbox" name="anonymous" checked={form.anonymous} onChange={onChange} />
          Submit anonymously
        </label>
        <div className="grid two">
          <div className="form-group">
            <label htmlFor="contact_email">Contact Email (optional)</label>
            <input id="contact_email" className="input" name="contact_email" placeholder="your.name@unza.zm" value={form.contact_email} onChange={onChange} />
            <span className="helper">Provide email if you want updates.</span>
          </div>
          <div className="form-group">
            <label htmlFor="contact_phone">Contact Phone (optional)</label>
            <input id="contact_phone" className="input" name="contact_phone" placeholder="+260977123456" value={form.contact_phone} onChange={onChange} />
          </div>
        </div>
        <div>
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Complaint'}</button>
        </div>
      </form>
    </div>
  );
};

export default ComplaintFormPage;


