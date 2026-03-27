import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SidebarDocuments({ expanded, onUploadClick, refresh }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (expanded) fetchDocuments();
    // eslint-disable-next-line
  }, [expanded, refresh]);

  const fetchDocuments = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get('/api/documents', { headers: { Authorization: `Bearer ${token}` } });
      setDocuments(res.data.documents || []);
    } catch (err) {
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`/api/documents?id=${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setDocuments(docs => docs.filter(d => d.id !== id));
    } catch {
      setError('Delete failed');
    }
  };

  return expanded ? (
    <div data-testid="sidebar-documents" style={{ marginTop: 8 }}>
      {loading && <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading...</div>}
      {error && <div style={{ color: '#f88', fontSize: 13 }}>{error}</div>}
      {documents.map(doc => (
        <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border-glass)' }}>
          <span role="img" aria-label="file" style={{ fontSize: 18 }}>📄</span>
          <span style={{ flex: 1, color: 'var(--text-primary)', fontSize: 14 }}>{doc.filename || doc.name || doc.id}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{doc.file_size ? (doc.file_size / 1024).toFixed(1) + ' KB' : ''}</span>
          <button aria-label="Delete document" style={{ background: 'none', border: 'none', color: '#f88', cursor: 'pointer', fontSize: 16 }} onClick={() => handleDelete(doc.id)}>&times;</button>
        </div>
      ))}
      <button
        data-testid="inline-upload-panel"
        onClick={onUploadClick}
        style={{ marginTop: 12, width: '100%', background: 'var(--bg-glass-hover)', color: 'var(--gold)', border: '1px solid var(--gold)', borderRadius: 8, padding: '10px 0', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}
        aria-label="Add Document"
      >
        + Add Document
      </button>
    </div>
  ) : null;
}
