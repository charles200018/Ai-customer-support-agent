
import { useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';


function Chat() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [docLoading, setDocLoading] = useState(true);
  const [docError, setDocError] = useState('');
  const [docName, setDocName] = useState('');
  const nextIdRef = useRef(1);
  const { logout, user } = useAuth();
  useEffect(() => {
    // Load documents on mount
    const fetchDocs = async () => {
      setDocLoading(true);
      setDocError('');
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get('/api/documents', {
          headers: { Authorization: `Bearer ${token}` },
        });
  const [typing, setTyping] = useState(false);
        setDocuments(res.data.documents || []);
  const chatEndRef = useRef();
        if (res.data.documents && res.data.documents.length > 0) {
          setSelectedDocId(res.data.documents[0].id);
          setDocName(res.data.documents[0].filename || '');
        }
      } catch (err) {
        setDocError(err?.response?.data?.error || 'Failed to load documents');
      } finally {
        setDocLoading(false);
      }
    };
    fetchDocs();
    setMessages([
      {
        id: 0,
        role: 'assistant',
        text: 'Welcome! Select a document to chat about, then ask your question.',
      },
    ]);
  }, []);

  useEffect(() => {
    // Update docName when selectedDocId changes
    const doc = documents.find((d) => d.id === selectedDocId);
    setDocName(doc?.filename || '');
  }, [selectedDocId, documents]);

  const canSend = useMemo(() => input.trim().length > 0 && !sending && !!selectedDocId, [input, sending, selectedDocId]);

        sources: [],
  const handleSend = async (event) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || sending || !selectedDocId) return;

    const userMessage = { id: nextIdRef.current++, role: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setError('');
    setSending(true);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        '/api/chat',
        { userMessage: text, documentId: selectedDocId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const assistantMessage = {
        id: nextIdRef.current++,
    setTyping(true);
        role: 'assistant',
        text: response.data.answer || response.data.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1>AI Chat</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button type="button" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="doc-select"><strong>Document:</strong></label>{' '}
        {docLoading ? (
          <span>Loading documents...</span>
        ) : docError ? (
          <span style={{ color: '#900' }}>{docError}</span>
        ) : (
          <select
            id="doc-select"
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            style={{ minWidth: 200, marginLeft: 8 }}
          >
            <option value="">-- Select a document --</option>
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>{doc.filename}</option>
            ))}
          </select>
        )}
      </div>

      {!selectedDocId && !docLoading && (
        <div style={{ marginBottom: '1rem', color: '#b36d00', background: '#fffbe6', padding: '0.75rem', borderRadius: 8 }}>
          No document selected. Please upload or select a document to chat.
        </div>
      )}

      {docName && (
        <div style={{ marginBottom: '1rem', color: '#555' }}>
          <strong>Chatting about:</strong> {docName}
        </div>
      )}

      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', minHeight: 360 }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              marginBottom: '0.75rem',
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '75%',
                padding: '0.6rem 0.8rem',
                borderRadius: 8,
                background: message.role === 'user' ? '#007bff' : '#f1f3f5',
                color: message.role === 'user' ? '#fff' : '#222',
                whiteSpace: 'pre-wrap',
              }}
            >
              {message.text}
            </div>
          </div>
        ))}

        {sending ? (
          <div
            style={{
              marginBottom: '0.75rem',
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '75%',
                padding: '0.6rem 0.8rem',
                borderRadius: 8,
                background: '#f1f3f5',
                color: '#222',
                fontStyle: 'italic',
              }}
            >
              AI is typing...
            </div>
          </div>
        ) : null}
      </div>

      {error ? (
        <div style={{ marginTop: '0.75rem', color: '#900', background: '#fee', padding: '0.75rem', borderRadius: 8 }}>
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSend} style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={selectedDocId ? 'Type your message' : 'Select a document to chat'}
          style={{ flex: 1, padding: '0.65rem', border: '1px solid #ccc', borderRadius: 8 }}
          disabled={sending || !selectedDocId}
        />
        <button type="submit" disabled={!canSend}>
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default Chat;
