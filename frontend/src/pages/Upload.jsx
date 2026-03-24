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
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setDocuments(data.documents || [])
    } catch (err) {
      console.error('Failed to fetch documents:', err)
    }
  }

  const handleFileSelect = (e) => {
    setFile(e.target.files[0] || null)
    setError(null)
    setSuccess(null)
  }

  const handleUpload = async () => {
    if (!file) { setError('Please select a file first'); return }
    setUploading(true)
    setError(null)
    setSuccess(null)
    try {
      const token = localStorage.getItem('authToken')
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
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
        headers: { 'Authorization': `Bearer ${token}` }
      })
      fetchDocuments()
    } catch (err) {
      setError('Failed to delete document')
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Upload Document</h1>
        <button onClick={() => navigate('/dashboard')}>Dashboard</button>
      </div>

      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
        <p style={{ marginBottom: '10px' }}>Allowed: PDF, TXT (max 10MB)</p>
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileSelect}
          disabled={uploading}
          style={{ marginBottom: '10px', display: 'block' }}
        />
        {file && <p style={{ color: '#555', marginBottom: '10px' }}>Selected: {file.name}</p>}
        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {uploading ? 'Uploading...' : 'Upload & Save'}
        </button>
      </div>

      {error && <div style={{ padding: '10px', background: '#fee', color: '#900', borderRadius: '4px', marginBottom: '10px' }}>{error}</div>}
      {success && <div style={{ padding: '10px', background: '#efe', color: '#060', borderRadius: '4px', marginBottom: '10px' }}>{success}</div>}

      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
        <h2>Stored Documents</h2>
        {documents.length === 0 ? (
          <p style={{ color: '#888' }}>No documents yet. Upload one above.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {documents.map(doc => (
              <li key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                <div>
                  <strong>{doc.filename}</strong>
                  <div style={{ color: '#888', fontSize: '0.85rem' }}>{doc.file_type} · {doc.file_size ? `${Math.round(doc.file_size / 1024)}KB` : ''}</div>
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  style={{ padding: '4px 10px', background: '#fee', color: '#c00', border: '1px solid #fcc', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
