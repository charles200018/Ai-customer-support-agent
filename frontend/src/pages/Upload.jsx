import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'

function Upload() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loadingDocs, setLoadingDocs] = useState(false)
  const [error, setError] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [result, setResult] = useState(null)
  const [documents, setDocuments] = useState([])
  const [savedDocumentId, setSavedDocumentId] = useState('')

  const fileName = useMemo(() => file?.name || 'No file selected', [file])

  useEffect(() => {
    loadDocuments()
  }, [])

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken')
    return {
      Authorization: `Bearer ${token}`,
    }
  }

  const loadDocuments = async () => {
    try {
      setLoadingDocs(true)
      const response = await axios.get('/api/documents', {
        headers: getAuthHeaders(),
      })
      setDocuments(response.data.documents || [])
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load documents')
    } finally {
      setLoadingDocs(false)
    }
  }

  const handleSelectFile = (event) => {
    setError('')
    setResult(null)

    const selected = event.target.files?.[0]
    if (!selected) {
      setFile(null)
      return
    }

    const allowed = ['application/pdf', 'text/plain']
    if (!allowed.includes(selected.type)) {
      setError('Only PDF and TXT files are allowed')
      setFile(null)
      return
    }

    if (selected.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum size is 10MB')
      setFile(null)
      return
    }

    setFile(selected)
  }

  const handleUpload = async (event) => {
    event.preventDefault()

    if (!file) {
      setError('Please select a file first')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSaveMessage('')
      setSavedDocumentId('')

      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post('/api/upload', formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      })

      setResult(response.data)
    } catch (err) {
      setError(err?.response?.data?.error || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDocument = async () => {
    if (!result?.file?.filename || !result?.extractedText) {
      setError('Upload and extract a document first')
      return
    }

    try {
      setSaving(true)
      setError('')
      setSaveMessage('')

      const response = await axios.post(
        '/api/documents',
        {
          filename: result.file.filename,
          content: result.extractedText,
          fileType: result.file.mimetype,
          fileSize: result.file.size,
        },
        {
          headers: getAuthHeaders(),
        }
      )

      setSavedDocumentId(response.data.document.id)
      setSaveMessage('Document saved to PostgreSQL')
      await loadDocuments()
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to save document')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteDocument = async (id) => {
    try {
      setError('')
      await axios.delete(`/api/documents/${id}`, {
        headers: getAuthHeaders(),
      })
      if (savedDocumentId === id) {
        setSavedDocumentId('')
      }
      await loadDocuments()
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to delete document')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1>Upload Document</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button type="button" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <form onSubmit={handleUpload} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem' }}>
        <p style={{ marginBottom: '0.75rem' }}>Allowed file types: PDF, TXT (max 10MB)</p>
        <input type="file" accept=".pdf,.txt,application/pdf,text/plain" onChange={handleSelectFile} />
        <p style={{ marginTop: '0.5rem', color: '#555' }}>{fileName}</p>
        <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Uploading...' : 'Upload & Extract'}
        </button>
      </form>

      {error ? (
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fee', color: '#900', borderRadius: 8 }}>
          {error}
        </div>
      ) : null}

      {result ? (
        <div style={{ marginTop: '1rem', border: '1px solid #ddd', borderRadius: 8, padding: '1rem' }}>
          <h2>Extraction Result</h2>
          <p><strong>Filename:</strong> {result.file.filename}</p>
          <p><strong>Type:</strong> {result.file.mimetype}</p>
          <p><strong>Size:</strong> {result.file.size} bytes</p>
          <p><strong>Characters extracted:</strong> {result.extractedChars}</p>

          <h3 style={{ marginTop: '1rem' }}>Text Preview</h3>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#fafafa', padding: '0.75rem', borderRadius: 8 }}>
            {result.preview}
          </pre>

          <div style={{ marginTop: '1rem' }}>
            <button type="button" onClick={handleSaveDocument} disabled={saving || savedDocumentId !== ''}>
              {saving ? 'Saving...' : savedDocumentId ? 'Saved' : 'Save to PostgreSQL'}
            </button>
            {saveMessage ? <p style={{ color: '#0a7a0a', marginTop: '0.5rem' }}>{saveMessage}</p> : null}
          </div>
        </div>
      ) : null}

      <div style={{ marginTop: '1rem', border: '1px solid #ddd', borderRadius: 8, padding: '1rem' }}>
        <h2>Stored Documents</h2>
        {loadingDocs ? <p>Loading documents...</p> : null}
        {!loadingDocs && documents.length === 0 ? <p>No stored documents yet.</p> : null}
        {!loadingDocs && documents.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {documents.map((doc) => (
              <li
                key={doc.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.75rem',
                  borderBottom: '1px solid #eee',
                  padding: '0.75rem 0',
                }}
              >
                <div>
                  <strong>{doc.filename}</strong>
                  <div style={{ color: '#555', fontSize: '0.9rem' }}>
                    {doc.file_type || 'unknown'} | {doc.file_size || 0} bytes
                  </div>
                </div>
                <button type="button" onClick={() => handleDeleteDocument(doc.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}

export default Upload
