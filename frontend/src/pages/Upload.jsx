import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

  const handleUpload = async () => {
    if (!file) { setError('Please select a file first'); return }
    setUploading(true); setError(null); setSuccess(null)
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
      setSuccess(`"${data.document?.filename}" uploaded and indexed!`)
      setFile(null)
      fetchDocuments()
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch(`/api/documents?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Delete failed')
      fetchDocuments()
    } catch (err) {
      setError('Failed to delete document')
    }
  }

  const nv = { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: '#C9A96E', letterSpacing: 4 }
export default function Upload() {
  const [file, setFile] = useState(null)
  const [documents, setDocuments] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [dragActive, setDragActive] = useState(false)
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

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) { setFile(dropped); setError(null); setSuccess(null) }
  }

  const handleUpload = async () => {
    if (!file) { setError('Please select a file first'); return }
    setUploading(true); setError(null); setSuccess(null)
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
      setSuccess(`"${data.document?.filename}" uploaded and indexed!`)
      setFile(null)
      fetchDocuments()
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch(`/api/documents?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Delete failed')
      fetchDocuments()
    } catch (err) {
      setError('Failed to delete document')
    }
  }

  const nv = { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: '#C9A96E', letterSpacing: 4 }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0B', fontFamily: "'DM Sans', sans-serif" }}>
      <nav style={{ background: '#111114', borderBottom: '1px solid rgba(201,169,110,0.12)', padding: '1.25rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={nv}>AXIOM</span>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/chat')} style={{ background: 'transparent', border: '1px solid rgba(201,169,110,0.2)', color: '#8A8A9A', padding: '8px 20px', cursor: 'pointer', fontSize: '11px', letterSpacing: 2 }}>CHAT</button>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: '1px solid rgba(201,169,110,0.3)', color: '#C9A96E', padding: '8px 20px', cursor: 'pointer', fontSize: '11px', letterSpacing: 2 }}>DASHBOARD</button>
        </div>
      </nav>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 2rem' }}>
        <p style={{ color: '#C9A96E', fontSize: '11px', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Knowledge Base</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 300, color: '#F4F2EC', marginBottom: '2rem' }}>Upload Documents</h1>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
          onDragLeave={() => setDragActive(false)}
          onClick={() => document.getElementById('fileInput').click()}
          style={{
            border: `1px dashed ${dragActive ? 'rgba(201,169,110,0.6)' : 'rgba(201,169,110,0.3)'}`,
            padding: '48px', textAlign: 'center', marginBottom: 24,
            background: dragActive ? 'rgba(201,169,110,0.05)' : 'rgba(201,169,110,0.02)',
            cursor: 'pointer', transition: 'all 0.3s'
          }}>
          <div style={{ fontSize: '3rem', marginBottom: 16, opacity: 0.4, color: '#C9A96E' }}>⬆</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: '#F4F2EC', marginBottom: 8 }}>
            {file ? `Selected: ${file.name}` : 'Drag & drop or click to browse'}
          </div>
          <div style={{ color: '#8A8A9A', fontSize: '13px' }}>PDF and TXT files supported · Max 10MB</div>
          <input id="fileInput" type="file" accept=".pdf,.txt" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>

        {file && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button onClick={handleUpload} disabled={uploading}
              style={{ background: '#C9A96E', color: '#0A0A0B', border: 'none', padding: '12px 32px', cursor: uploading ? 'not-allowed' : 'pointer', fontSize: '11px', letterSpacing: 2, fontWeight: 700, opacity: uploading ? 0.7 : 1 }}>
              {uploading ? 'INDEXING...' : 'UPLOAD & INDEX'}
            </button>
          </div>
        )}

        {error && <div style={{ padding: '12px 16px', background: 'rgba(180,50,50,0.1)', border: '1px solid rgba(180,50,50,0.3)', color: '#f99', marginBottom: 16 }}>{error}</div>}
        {success && <div style={{ padding: '12px 16px', background: 'rgba(50,180,100,0.1)', border: '1px solid rgba(50,180,100,0.3)', color: '#9f9', marginBottom: 16 }}>{success}</div>}

        <div style={{ marginTop: 32 }}>
          <div style={{ fontSize: '10px', letterSpacing: 3, textTransform: 'uppercase', color: '#C9A96E', marginBottom: 20 }}>Indexed Documents ({documents.length})</div>
          {documents.length === 0 ? (
            <div style={{ color: '#8A8A9A', padding: '40px', textAlign: 'center', border: '1px solid rgba(201,169,110,0.06)', background: '#111114' }}>
              No documents yet. Upload your first document above to get started.
            </div>
          ) : documents.map(doc => (
            <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: '#1A1A1F', border: '1px solid rgba(201,169,110,0.06)', marginBottom: 2 }}>
              <div style={{ width: 40, height: 40, border: '1px solid rgba(201,169,110,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#C9A96E', fontWeight: 700, flexShrink: 0 }}>
                {doc.file_type === 'application/pdf' ? 'PDF' : 'TXT'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#C8C8D8', fontSize: '14px', marginBottom: 3 }}>{doc.filename}</div>
                <div style={{ color: '#8A8A9A', fontSize: '12px' }}>
                  {doc.file_size ? `${Math.round(doc.file_size / 1024)}KB` : ''}
                  {doc.created_at ? ` · ${new Date(doc.created_at).toLocaleDateString()}` : ''}
                </div>
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
