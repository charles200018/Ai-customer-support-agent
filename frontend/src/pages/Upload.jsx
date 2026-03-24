
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
