import { useMemo, useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'

function Chat() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [messages, setMessages] = useState([{ id: 0, role: 'assistant', text: 'Welcome! Select a document and ask a question.' }])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [typing, setTyping] = useState(false)
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
        // nothing here
      }

          {error && (
            <div style={{ padding: '10px 40px', background: 'rgba(180,50,50,0.1)', borderTop: '1px solid rgba(180,50,50,0.2)', color: '#f88', fontSize: '13px' }}>{error}</div>
          )}

          <div style={{ padding: '20px 40px', borderTop: '1px solid rgba(201,169,110,0.08)', background: '#111114' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {['What is the main topic?', 'Summarize this document', 'What are the key points?'].map(q => (
                <button key={q} onClick={() => setInput(q)}
                  style={{ padding: '5px 12px', background: 'transparent', border: '1px solid rgba(201,169,110,0.15)', color: '#8A8A9A', fontSize: '12px', cursor: 'pointer' }}>
                  {q}
                </button>
              ))}
            </div>
            <form onSubmit={handleSend} style={{ display: 'flex', gap: 10 }}>
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e) } }}
                placeholder={selectedDocId ? 'Ask a question about your document...' : 'Select a document first'}
                disabled={sending || !selectedDocId}
                rows={1}
                style={{ flex: 1, background: '#1A1A1F', border: '1px solid rgba(201,169,110,0.15)', color: '#C8C8D8', padding: '13px 16px', fontSize: '14px', resize: 'none', outline: 'none', fontFamily: "'DM Sans', sans-serif", minHeight: 48 }}
              />
              <button type="submit" disabled={!canSend}
                style={{ width: 52, height: 52, background: canSend ? G : 'rgba(201,169,110,0.2)', border: 'none', color: canSend ? '#0A0A0B' : '#8A8A9A', fontSize: '18px', cursor: canSend ? 'pointer' : 'not-allowed', flexShrink: 0, alignSelf: 'flex-end' }}>
                →
              </button>
            </form>
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,60%,100%{transform:translateY(0);opacity:0.4} 30%{transform:translateY(-5px);opacity:1} }`}</style>

export default Chat
