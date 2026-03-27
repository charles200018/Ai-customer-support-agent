import React, { useRef, useState } from 'react';
import axios from 'axios';

export default function InlineUploadPanel({ open, onClose, onUploaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const inputRef = useRef();

  if (!open) return null;

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
    setError('');
    setSuccess('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) { setFile(dropped); setError(''); setSuccess(''); }
  };

  const handleUpload = async () => {
    if (!file) { setError('Please select a file first'); return; }
    setUploading(true); setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post('/api/upload', formData, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess(`"${res.data.document?.filename}" uploaded!`);
      setFile(null);
      if (onUploaded) onUploaded();
    } catch (err) {
      setError(err?.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div data-testid="inline-upload-panel" style={{
      position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 2000,
      background: 'rgba(10,10,11,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-deep)', padding: 32, minWidth: 340, maxWidth: 420, position: 'relative',
      }} onClick={e => e.stopPropagation()}>
        <button aria-label="Close upload panel" onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'var(--gold)', fontSize: 22, cursor: 'pointer' }}>&times;</button>
        <h2 style={{ color: 'var(--gold)', fontSize: 22, marginBottom: 18 }}>Upload Document</h2>
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          style={{ border: '2px dashed var(--gold)', borderRadius: 12, padding: 24, textAlign: 'center', marginBottom: 18, background: 'var(--bg-glass-hover)', cursor: 'pointer' }}
          onClick={() => inputRef.current?.click()}
        >
          {file ? (
            <span style={{ color: 'var(--text-primary)' }}>{file.name}</span>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>Drag & drop or click to select PDF/TXT</span>
          )}
          <input ref={inputRef} type="file" accept=".pdf,.txt" style={{ display: 'none' }} onChange={handleFileChange} />
        </div>
        <button
          onClick={handleUpload}
          disabled={uploading}
          style={{ width: '100%', background: 'var(--gold)', color: '#1a1408', border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 700, fontSize: 16, cursor: uploading ? 'not-allowed' : 'pointer', marginBottom: 10 }}
          aria-label="Upload document"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        {error && <div style={{ color: '#f88', fontSize: 14, marginTop: 8 }}>{error}</div>}
        {success && <div style={{ color: 'var(--gold)', fontSize: 14, marginTop: 8 }}>{success}</div>}
      </div>
    </div>
  );
}
