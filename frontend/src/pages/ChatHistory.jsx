import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ChatHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get('/api/chat/history', { headers: { Authorization: `Bearer ${token}` } });
        setHistory(res.data.history || []);
      } catch (err) {
        setError('Failed to load chat history');
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <div className="axiom-page" data-testid="chat-history-page" style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: 900, width: '100%', margin: '0 auto', padding: '2.5rem 1.5rem 0' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 52, color: 'var(--gold-pure)', fontWeight: 400, letterSpacing: 2, marginBottom: 18, marginTop: 0 }}>Chat History</h1>
        <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0 0 32px 0' }} />
        {loading ? (
          <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: 15 }}>Loading chat history...</div>
        ) : error ? (
          <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: 15 }}>{error}</div>
        ) : history.length === 0 ? (
          <div style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)', fontSize: 14, marginTop: 32 }}>
            No conversations yet.<br />Start a new chat to begin.
          </div>
        ) : (
          <div>
            {history.map(chat => (
              <div key={chat.id} data-testid="chat-history-row" style={{ padding: '16px 0', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-tertiary)' }}>{chat.date}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-primary)' }}>{chat.title || chat.firstMessage}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-secondary)' }}>{chat.documentName}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--gold-pure)', alignSelf: 'flex-end' }}>→</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
