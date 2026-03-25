import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [documents, setDocuments] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { fetchDocuments() }, [])

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch('/api/documents', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setDocuments(data.documents || [])
    } catch (err) {
      console.error('Failed to fetch documents:', err)
    }
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null)
    setError(null)
    setSuccess(null)
  }

  const handleUpload = async () => {
    if (!file) { setError('Please select a file'); return }
    setUploading(true)
    setError(null)
    setSuccess(null)
    try {
      const token = localStorage.getItem('authToken')
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setSuccess(`"${data.document?.filename}" uploaded successfully!`)
      setFile(null)
      fetchDocuments()
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('authToken')
      await fetch(`/api/documents?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchDocuments()
    } catch (err) {
      setError('Failed to delete document')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0B', fontFamily: 'DM Sans, sans-serif' }}>
      <nav style={{ background: '#111114', borderBottom: '1px solid rgba(201,169,110,0.12)', padding: '1.25rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'serif', fontSize: '1.4rem', color: '#C9A96E', letterSpacing: 4 }}>AXIOM</span>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: '1px solid rgba(201,169,110,0.3)', color: '#C9A96E', padding: '8px 20px', cursor: 'pointer', fontSize: '11px', letterSpacing: 2 }}>DASHBOARD</button>
      </nav>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 2rem' }}>
        <p style={{ color: '#C9A96E', fontSize: '11px', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Knowledge Base</p>
        <h1 style={{ fontFamily: 'serif', fontSize: '2.5rem', fontWeight: 300, color: '#F4F2EC', marginBottom: '2rem' }}>Upload Documents</h1>

        <div style={{ border: '1px dashed rgba(201,169,110,0.3)', padding: '48px', textAlign: 'center', marginBottom: 32, background: 'rgba(201,169,110,0.02)', cursor: 'pointer' }}
          onClick={() => document.getElementById('fileInput').click()}>
          <div style={{ fontSize: '3rem', marginBottom: 16, opacity: 0.4, color: '#C9A96E' }}>⬆</div>
          <div style={{ fontFamily: 'serif', fontSize: '1.3rem', color: '#F4F2EC', marginBottom: 8 }}>Drop files here or click to browse</div>
          <div style={{ color: '#8A8A9A', fontSize: '13px' }}>PDF and TXT files supported · Max 10MB</div>
          <input id="fileInput" type="file" accept=".pdf,.txt" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>

        {file && (
          <div style={{ background: '#1A1A1F', border: '1px solid rgba(201,169,110,0.15)', padding: '16px 24px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#C8C8D8' }}>{file.name}</span>
            <button onClick={handleUpload} disabled={uploading}
              style={{ background: '#C9A96E', color: '#0A0A0B', border: 'none', padding: '10px 24px', cursor: 'pointer', fontSize: '11px', letterSpacing: 2, fontWeight: 600 }}>
              {uploading ? 'UPLOADING...' : 'UPLOAD & INDEX'}
            </button>
          </div>
        )}

        {error && <div style={{ padding: '12px 16px', background: 'rgba(180,50,50,0.1)', border: '1px solid rgba(180,50,50,0.3)', color: '#f88', marginBottom: 16 }}>{error}</div>}
        {success && <div style={{ padding: '12px 16px', background: 'rgba(50,180,100,0.1)', border: '1px solid rgba(50,180,100,0.3)', color: '#8f8', marginBottom: 16 }}>{success}</div>}

        <div style={{ marginTop: 32 }}>
          <div style={{ fontSize: '10px', letterSpacing: 3, textTransform: 'uppercase', color: '#C9A96E', marginBottom: 20 }}>Indexed Documents</div>
          {documents.length === 0 ? (
            <div style={{ color: '#8A8A9A', padding: '32px', textAlign: 'center', border: '1px solid rgba(201,169,110,0.06)' }}>No documents yet. Upload your first document above.</div>
          ) : documents.map(doc => (
            <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: '#1A1A1F', border: '1px solid rgba(201,169,110,0.06)', marginBottom: 2 }}>
              <div style={{ width: 36, height: 36, border: '1px solid rgba(201,169,110,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#C9A96E', fontWeight: 700 }}>
                {doc.file_type === 'application/pdf' ? 'PDF' : 'TXT'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#C8C8D8', fontSize: '14px' }}>{doc.filename}</div>
                <div style={{ color: '#8A8A9A', fontSize: '12px' }}>{doc.file_size ? `${Math.round(doc.file_size / 1024)}KB` : ''}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 16 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2D6B4A' }}></div>
                <span style={{ fontSize: '10px', color: '#2D6B4A', letterSpacing: 1.5 }}>READY</span>
              </div>
              <button onClick={() => handleDelete(doc.id)}
                style={{ background: 'transparent', border: '1px solid rgba(180,50,50,0.3)', color: '#f88', padding: '6px 14px', cursor: 'pointer', fontSize: '11px' }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => { fetchDocuments(); }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('/api/documents', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  const handleFileSelect = (e) => {
    setFile(e.target.files[0] || null);
    setError(null);
    setSuccess(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
      setSuccess(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleUpload = async () => {
    if (!file) { setError('Please select a file first'); return; }
    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setSuccess(`"${data.document?.filename}" uploaded successfully!`);
      setFile(null);
      fetchDocuments();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await fetch(`/api/documents?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchDocuments();
    } catch (err) {
      setError('Failed to delete document');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '3rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond', color: 'var(--color-accent)', fontSize: '2.2rem', margin: 0 }}>Upload Document</h1>
          <button className="btn" onClick={() => navigate('/dashboard')}>Dashboard</button>
        </div>

        {/* Drag-drop zone */}
        <div
          className={`dropzone${dragActive ? ' dragover' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          style={{ marginBottom: 24, cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.7 : 1 }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
            disabled={uploading}
          />
          {file ? (
            <span style={{ color: 'var(--color-pearl)' }}>Selected: <b>{file.name}</b></span>
          ) : (
            <span>Drag & drop PDF or TXT here, or <span style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>browse</span></span>
          )}
        </div>

        <button
          className="btn"
          onClick={handleUpload}
          disabled={uploading || !file}
          style={{ width: '100%', marginBottom: 24 }}
        >
          {uploading ? 'Uploading...' : 'Upload & Save'}
        </button>

        {error && <div style={{ background: '#2a1818', color: '#e6b8b8', borderRadius: 8, padding: '0.75em 1em', marginBottom: 18 }}>{error}</div>}
        {success && <div style={{ background: '#1a2a18', color: '#b8e6b8', borderRadius: 8, padding: '0.75em 1em', marginBottom: 18 }}>{success}</div>}

        <div className="card" style={{ marginTop: 32 }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond', color: 'var(--color-accent)', fontSize: '1.4rem', marginBottom: 18 }}>Stored Documents</h2>
          {documents.length === 0 ? (
            <p style={{ color: 'var(--color-pearl)', opacity: 0.7 }}>No documents yet. Upload one above.</p>
          ) : (
            <table className="table" style={{ marginTop: 0 }}>
              <thead>
                <tr>
                  <th>Filename</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {documents.map(doc => (
                  <tr key={doc.id}>
                    <td style={{ fontWeight: 600 }}>{doc.filename}</td>
                    <td>{doc.file_type}</td>
                    <td>{doc.file_size ? `${Math.round(doc.file_size/1024)} KB` : ''}</td>
                    <td>
                      <button
                        className="btn"
                        style={{ background: 'transparent', color: 'var(--color-accent)', border: '1px solid var(--color-accent)', padding: '0.4em 1.2em', fontSize: '0.95em' }}
                        onClick={() => handleDelete(doc.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
