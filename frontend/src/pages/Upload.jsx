
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [documents, setDocuments] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchDocuments()
    // eslint-disable-next-line
  }, [])

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

  const handleUpload = async () => {
    if (!file) return
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
      setSuccess('Document uploaded successfully!')
      fetchDocuments()
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Upload Document</h1>
      <button onClick={() => navigate('/dashboard')}>Dashboard</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <div>
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={e => {
              setFile(e.target.files[0]);
              if (e.target.files[0]) {
                setTimeout(() => handleUpload(), 0);
              }
            }}
            disabled={uploading}
          />
          <button
            disabled
            style={{ opacity: 0.5 }}
          >
            Save to Firebase
        </button>
      </div>
      <h2>Stored Documents</h2>
      <ul>
        {(documents || []).map((doc) => (
          <li key={doc.id}>{doc.filename}</li>
        ))}
      </ul>
    </div>
  )
}
