import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'

function Chat() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [messages, setMessages] = useState([{ id: 0, role: 'assistant', text: 'Welcome! Select a document and ask a question.' }])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [documents, setDocuments] = useState([])
  const [selectedDocId, setSelectedDocId] = useState('')
  const [docLoading, setDocLoading] = useState(true)
  const [docError, setDocError] = useState('')
  const nextIdRef = useRef(1)
  const chatEndRef = useRef()

  useEffect(() => {
    const fetchDocs = async () => {
      setDocLoading(true)
      try {
        const token = localStorage.getItem('authToken')
        const res = await axios.get('/api/documents', { headers: { Authorization: `Bearer ${token}` } })
        const docs = res.data.documents || []
        setDocuments(docs)
        if (docs.length > 0) setSelectedDocId(docs[0].id)
      } catch (err) {
        setDocError(err?.response?.data?.error || 'Failed to load documents')
      } finally {
        setDocLoading(false)
      }
    }
    fetchDocs()
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const canSend = input.trim().length > 0 && !sending && !!selectedDocId

  const handleSend = async (event) => {
    event.preventDefault()
    const text = input.trim()
    if (!text || !selectedDocId) return
    const userMsg = { id: nextIdRef.current++, role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setSending(true)
    setError('')
    try {
      const token = localStorage.getItem('authToken')
      const res = await axios.post('/api/chat', {
        userMessage: text,
        documentId: selectedDocId
      }, { headers: { Authorization: `Bearer ${token}` } })
      const reply = res.data.answer || res.data.reply || 'No response received.'
      setMessages(prev => [...prev, { id: nextIdRef.current++, role: 'assistant', text: reply }])
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0B', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column' }}>
      <nav style={{ background: '#111114', borderBottom: '1px solid rgba(201,169,110,0.12)', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: '#C9A96E', letterSpacing: 4, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>AXIOM</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: '#8A8A9A', fontSize: '13px' }}>{user?.name}</span>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid rgba(201,169,110,0.3)', color: '#C9A96E', padding: '6px 16px', cursor: 'pointer', fontSize: '11px', letterSpacing: 2 }}>LOGOUT</button>
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 900, width: '100%', margin: '0 auto', padding: '2rem 1rem 0' }}>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: '11px', color: '#C9A96E', letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Document</label>
          {docLoading ? (
            <div style={{ color: '#8A8A9A', fontSize: '13px' }}>Loading documents...</div>
          ) : docError ? (
            <div style={{ color: '#f88', fontSize: '13px' }}>{docError}</div>
          ) : documents.length === 0 ? (
            <div style={{ color: '#8A8A9A', fontSize: '13px' }}>No documents uploaded yet. <span style={{ color: '#C9A96E', cursor: 'pointer' }} onClick={() => navigate('/upload')}>Upload one →</span></div>
          ) : (
            <select value={selectedDocId} onChange={e => setSelectedDocId(e.target.value)}
              style={{ background: '#1A1A1F', border: '1px solid rgba(201,169,110,0.2)', color: '#C8C8D8', padding: '10px 14px', fontSize: '14px', outline: 'none', width: '100%', maxWidth: 400 }}>
              {documents.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.filename || doc.name || doc.id}</option>
              ))}
            </select>
          )}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 16 }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '75%',
                padding: '12px 16px',
                background: msg.role === 'user' ? 'rgba(201,169,110,0.15)' : '#1A1A1F',
                border: `1px solid ${msg.role === 'user' ? 'rgba(201,169,110,0.25)' : 'rgba(201,169,110,0.08)'}`,
                color: '#C8C8D8',
                fontSize: '14px',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap'
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {sending && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ padding: '12px 16px', background: '#1A1A1F', border: '1px solid rgba(201,169,110,0.08)', color: '#8A8A9A', fontSize: '13px' }}>
                Thinking...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {error && (
          <div style={{ padding: '10px 0', color: '#f88', fontSize: '13px', marginBottom: 8 }}>{error}</div>
        )}

        <div style={{ borderTop: '1px solid rgba(201,169,110,0.08)', paddingTop: 16, paddingBottom: 24, flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            {['What is the main topic?', 'Summarize this document', 'What are the key points?'].map(q => (
              <button key={q} onClick={() => setInput(q)}
                style={{ padding: '5px 12px', background: 'transparent', border: '1px solid rgba(201,169,110,0.15)', color: '#8A8A9A', fontSize: '12px', cursor: 'pointer' }}>
                {q}
              </button>
            ))}
          </div>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: 10 }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e) } }}
              placeholder={selectedDocId ? 'Ask a question about your document...' : 'Select a document first'}
              disabled={sending || !selectedDocId}
              rows={1}
              style={{ flex: 1, background: '#1A1A1F', border: '1px solid rgba(201,169,110,0.15)', color: '#C8C8D8', padding: '13px 16px', fontSize: '14px', resize: 'none', outline: 'none', fontFamily: "'DM Sans', sans-serif", minHeight: 48 }}
            />
            <button type="submit" disabled={!canSend}
              style={{ width: 52, height: 52, background: canSend ? '#C9A96E' : 'rgba(201,169,110,0.2)', border: 'none', color: canSend ? '#0A0A0B' : '#8A8A9A', fontSize: '18px', cursor: canSend ? 'pointer' : 'not-allowed', flexShrink: 0, alignSelf: 'flex-end' }}>
              →
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chat
