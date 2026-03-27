
import '../styles/theme.css';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuthHook';
import React from 'react';


function Chat() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [docLoading, setDocLoading] = useState(true);
  const [docError, setDocError] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const nextIdRef = useRef(1);
  const chatEndRef = useRef();

  useEffect(() => {
    const fetchDocs = async () => {
      setDocLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get('/api/documents', { headers: { Authorization: `Bearer ${token}` } });
        const docs = res.data.documents || [];
        setDocuments(docs);
        if (docs.length > 0) setSelectedDocId(docs[0].id);
      } catch (err) {
        setDocError(err?.response?.data?.error || 'Failed to load documents');
      } finally {
        setDocLoading(false);
      }
    };
    fetchDocs();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const canSend = input.trim().length > 0 && !sending && !!selectedDocId;

  const handleSend = async (event) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || !selectedDocId) return;
    const userMsg = { id: nextIdRef.current++, role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    setSending(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.post('/api/chat', {
        userMessage: text,
        documentId: selectedDocId
      }, { headers: { Authorization: `Bearer ${token}` } });
      const reply = res.data.answer || res.data.reply || 'No response received.';
      setMessages(prev => [...prev, { id: nextIdRef.current++, role: 'assistant', text: reply }]);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };



  // Upload panel logic (placeholder, should use InlineUploadPanel component)
  // ...existing code for upload panel integration...


  return (
    <div className="axiom-page" data-testid="chat-page" style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 900, width: '100%', margin: '0 auto', padding: '2.5rem 1.5rem 0' }}>
        {/* Luxury Heading */}
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: 'var(--gold)', fontWeight: 400, letterSpacing: 2, marginBottom: 18, marginTop: 0 }}>Chat</h1>
        {/* Document Selector */}
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 18 }}>
          <label style={{ fontSize: '12px', color: 'var(--gold)', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'var(--font-sans)', marginBottom: 0 }}>Document</label>
          {docLoading ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading documents...</div>
          ) : docError ? (
            <div style={{ color: '#f88', fontSize: '14px' }}>{docError}</div>
          ) : documents.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No documents uploaded yet. <span style={{ color: 'var(--gold)', cursor: 'pointer', fontWeight: 500 }} onClick={() => setShowUpload(true)}>Upload one →</span></div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <select
                value={selectedDocId}
                onChange={e => setSelectedDocId(e.target.value)}
                style={{
                  background: 'var(--bg-glass)',
                  border: '1.5px solid var(--gold)',
                  color: 'var(--text-primary)',
                  padding: '10px 22px',
                  fontSize: '15px',
                  borderRadius: 999,
                  outline: 'none',
                  fontFamily: 'var(--font-sans)',
                  minWidth: 180,
                  boxShadow: '0 2px 16px 0 rgba(201,168,76,0.08)',
                  transition: 'border 0.2s',
                }}
                aria-label="Select document"
                data-testid="chat-document-select"
              >
                {documents.map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.filename || doc.name || doc.id}</option>
                ))}
              </select>
              <button
                onClick={() => setShowUpload(true)}
                aria-label="Upload document"
                data-testid="chat-upload-btn"
                style={{
                  background: 'var(--bg-glass)',
                  border: '1.5px solid var(--gold)',
                  color: 'var(--gold)',
                  borderRadius: 999,
                  width: 44,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  cursor: 'pointer',
                  marginLeft: 2,
                  boxShadow: '0 2px 16px 0 rgba(201,168,76,0.08)',
                  transition: 'background 0.2s',
                }}
              >
                +
              </button>
            </div>
          )}
        </div>

        {/* Chat Bubbles */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 18 }} data-testid="chat-bubbles">
          {messages.length === 0 && (
            <div style={{ color: 'var(--text-muted)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', textAlign: 'center', marginTop: 32, opacity: 0.7 }}>
              Start a conversation about your document.
            </div>
          )}
          {messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '75%',
                padding: '16px 22px',
                background: msg.role === 'user' ? 'rgba(201,168,76,0.10)' : 'var(--bg-glass)',
                border: `1.5px solid ${msg.role === 'user' ? 'var(--gold)' : 'var(--border-glass)'}`,
                color: msg.role === 'user' ? 'var(--gold-light)' : 'var(--text-primary)',
                fontSize: 'clamp(1.08rem,2.5vw,1.18rem)',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                borderRadius: 20,
                fontFamily: msg.role === 'user' ? 'var(--font-sans)' : 'Cormorant Garamond, serif',
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                marginBottom: 2,
              }} data-testid={`chat-bubble-${msg.role}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {sending && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '16px 22px',
                background: 'var(--bg-glass)',
                border: '1.5px solid var(--border-glass)',
                color: 'var(--gold)',
                fontSize: 'clamp(1.08rem,2.5vw,1.18rem)',
                borderRadius: 20,
                fontFamily: 'Cormorant Garamond, serif',
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                marginBottom: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', opacity: 0.7, animation: 'pulse 1s infinite alternate' }} />
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', opacity: 0.5, animation: 'pulse 1s 0.2s infinite alternate' }} />
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', opacity: 0.3, animation: 'pulse 1s 0.4s infinite alternate' }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>


        {error && (
          <div style={{ padding: '10px 0', color: '#f88', fontSize: '14px', marginBottom: 10 }}>{error}</div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSend} style={{ display: 'flex', gap: 12, alignItems: 'flex-end', background: 'var(--bg-glass)', borderRadius: 999, boxShadow: 'var(--shadow-deep)', padding: '10px 16px', border: '1.5px solid var(--border-glass)', marginTop: 18 }}>
          <textarea
            id="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
            placeholder={selectedDocId ? 'Ask a question about your document...' : 'Select a document first'}
            disabled={sending || !selectedDocId}
            rows={1}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              padding: '15px 18px',
              fontSize: 'clamp(1.08rem,2.5vw,1.18rem)',
              resize: 'none',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              minHeight: 52,
              borderRadius: 999,
            }}
            aria-label="Chat input"
            data-testid="chat-input"
          />
          <button
            type="submit"
            disabled={!canSend}
            aria-label="Send message"
            data-testid="chat-send"
            style={{
              width: 54,
              height: 54,
              background: canSend ? 'var(--gold)' : 'rgba(201,168,76,0.13)',
              border: 'none',
              color: canSend ? '#1a1408' : 'var(--text-muted)',
              fontSize: 24,
              cursor: canSend ? 'pointer' : 'not-allowed',
              flexShrink: 0,
              alignSelf: 'flex-end',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 16px 0 rgba(201,168,76,0.08)',
              transition: 'background 0.18s',
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 24 }}>→</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;


