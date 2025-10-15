import React, { useEffect, useMemo, useRef, useState } from 'react';
import api from '../services/api';

const DEBOUNCE_MS = 250;

const UserSearch = ({ label = 'Participant', placeholder = 'Search name, email, or number...', role, onSelect, defaultValue }) => {
  const [query, setQuery] = useState(defaultValue?.name || '');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const search = useMemo(() => {
    let timeout;
    return async (value) => {
      if (timeout) clearTimeout(timeout);
      if (!value || value.trim().length < 2) {
        setResults([]);
        return;
      }
      timeout = setTimeout(async () => {
        setLoading(true);
        try {
          const { data } = await api.get('/users/search', { params: { q: value.trim(), role } });
          setResults(data.data || []);
          setOpen(true);
        } catch (err) {
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, DEBOUNCE_MS);
    };
  }, [role]);

  return (
    <div className="form-group" ref={containerRef}>
      {label && <label>{label}</label>}
      <input
        className="input"
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          search(e.target.value);
        }}
        onFocus={() => { if (results.length > 0) setOpen(true); }}
      />
      {open && (results.length > 0 || loading) && (
        <div className="card" style={{ position: 'absolute', marginTop: 8, width: '100%', zIndex: 20 }}>
          {loading ? (
            <div>Searching...</div>
          ) : (
            <ul className="list">
              {results.map((u) => (
                <li key={u.computer_number} className="list-item" onClick={() => {
                  onSelect?.(u);
                  setQuery(u.name);
                  setOpen(false);
                }} style={{ cursor: 'pointer' }}>
                  <div className="item-title"><strong>{u.name}</strong> <span className="badge" style={{ marginLeft: 8 }}>{u.role}</span></div>
                  <div className="item-meta">{u.email} • {u.computer_number}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSearch;




