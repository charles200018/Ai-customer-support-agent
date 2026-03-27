import '../styles/theme.css';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuthHook';
import React from 'react';

const EXAMPLE_QUESTIONS = [
  'What is the main topic?',
  'Summarize this document',
  'What are the key points?',
  'List all action items',
  'What conclusions are drawn?',
  'Explain the methodology',
];

function Chat() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [messages, setMessages] = useState([{ id: 0, role: 'assistant', text: 'Welcome! Select a document and ask a question.' }]);
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
    setInput('');
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

  // Example chip click: send immediately
  const handleExample = (q) => {
    setInput(q);
    setTimeout(() => {
      document.getElementById('chat-input')?.focus();
      handleSend({ preventDefault: () => {} });
    }, 0);
  };

  // Upload panel logic (placeholder, should use InlineUploadPanel component)
  // ...existing code for upload panel integration...

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 900, width: '100%', margin: '0 auto', padding: '2rem 1rem 0' }}>
        {/* Chat Header: Document selector as glass pill, +Upload button */}
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <label style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Document</label>
          {docLoading ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading documents...</div>
          ) : docError ? (
            <div style={{ color: '#f88', fontSize: '13px' }}>{docError}</div>
          ) : documents.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No documents uploaded yet. <span style={{ color: 'var(--gold)', cursor: 'pointer' }} onClick={() => setShowUpload(true)}>Upload one →</span></div>
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
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 16 }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '75%',
                padding: '14px 20px',
                background: msg.role === 'user' ? 'rgba(201,168,76,0.10)' : 'var(--bg-glass)',
                border: `1.5px solid ${msg.role === 'user' ? 'var(--gold)' : 'var(--border-glass)'}`,
                color: msg.role === 'user' ? 'var(--gold-light)' : 'var(--text-primary)',
                fontSize: 'clamp(1rem,2.5vw,1.125rem)',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                borderRadius: 18,
                fontFamily: 'var(--font-sans)',
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                marginBottom: 2,
              }}>
                {msg.text}
                <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12, marginTop: 6, textAlign: 'right' }}>
                  {/* Timestamp placeholder */}
                </div>
              </div>
            </div>
          ))}
          {sending && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '14px 20px',
                background: 'var(--bg-glass)',
                border: '1.5px solid var(--border-glass)',
                color: 'var(--gold)',
                fontSize: 'clamp(1rem,2.5vw,1.125rem)',
                borderRadius: 18,
                fontFamily: 'var(--font-sans)',
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
          <div style={{ padding: '10px 0', color: '#f88', fontSize: '13px', marginBottom: 8 }}>{error}</div>
        )}

        {/* Example Chips */}
        <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: 16, paddingBottom: 24, flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            {EXAMPLE_QUESTIONS.map((q, i) => (
              <button
                key={q}
                onClick={() => handleExample(q)}
                aria-label={q}
                data-testid={`example-chip-${i}`}
                style={{
                  padding: '7px 18px',
                  background: 'var(--bg-glass)',
                  border: '1.5px solid var(--gold)',
                  color: 'var(--gold)',
                  fontSize: 'clamp(0.95rem,2vw,1.05rem)',
                  borderRadius: 999,
                  fontFamily: 'var(--font-sans)',
                  cursor: 'pointer',
                  marginBottom: 2,
                  transition: 'background 0.18s, border 0.18s',
                }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--bg-glass-hover)'}
                onMouseOut={e => e.currentTarget.style.background = 'var(--bg-glass)'}
              >
                {q}
              </button>
            ))}
          </div>
          {/* Input Bar */}
          <form onSubmit={handleSend} style={{ display: 'flex', gap: 10, alignItems: 'flex-end', background: 'var(--bg-glass)', borderRadius: 999, boxShadow: 'var(--shadow-deep)', padding: '8px 12px', border: '1.5px solid var(--border-glass)' }}>
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
                padding: '13px 16px',
                fontSize: 'clamp(1rem,2.5vw,1.125rem)',
                resize: 'none',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
                minHeight: 48,
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
                width: 52,
                height: 52,
                background: canSend ? 'var(--gold)' : 'rgba(201,168,76,0.13)',
                border: 'none',
                color: canSend ? '#1a1408' : 'var(--text-muted)',
                fontSize: 22,
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
              <span style={{ fontWeight: 700, fontSize: 22 }}>→</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
