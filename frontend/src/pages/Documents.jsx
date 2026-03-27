import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get('/api/documents', { headers: { Authorization: `Bearer ${token}` } });
        setDocuments(res.data.documents || []);
      } catch (err) {
        setError('Failed to load documents');
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <div className="axiom-page" data-testid="documents-page" style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: 900, width: '100%', margin: '0 auto', padding: '2.5rem 1.5rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0 }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 52, color: 'var(--gold-pure)', fontWeight: 400, letterSpacing: 2, marginBottom: 0, marginTop: 0 }}>Documents</h1>
          <button style={{ border: '1px solid var(--border-gold)', padding: '9px 20px', borderRadius: 4, background: 'transparent', fontFamily: 'var(--font-body)', fontSize: 13, letterSpacing: '0.04em', color: 'var(--gold-pure)', cursor: 'pointer', transition: 'background var(--duration-fast)' }} data-testid="upload-documents-btn">+ Upload Document</button>
        </div>
        <div style={{ height: 1, background: 'var(--border-subtle)', margin: '24px 0 24px 0' }} />
        {loading ? (
          <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: 15 }}>Loading documents...</div>
        ) : error ? (
          <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: 15 }}>{error}</div>
        ) : documents.length === 0 ? (
          <div style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)', fontSize: 14, marginTop: 32 }}>
            No documents indexed.<br />Upload a PDF or TXT file to get started.
          </div>
        ) : (
          <div>
            {documents.map(doc => (
              <div key={doc.id} data-testid="document-row" style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '16px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase', width: 32 }}>PDF</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-primary)', flex: 1 }}>{doc.filename}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-tertiary)' }}>{doc.size} · {doc.date}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: doc.status === 'READY' ? '#4ecb71' : 'var(--gold-pure)', textTransform: 'uppercase', marginLeft: 12 }}>{doc.status}</span>
                <button style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', marginLeft: 16 }} data-testid="delete-document-btn">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
