import '../styles/theme.css';
import { useAuth } from '../hooks/useAuthHook';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React from 'react';

function Dashboard() {
  const { user } = useAuth();
  const [docCount, setDocCount] = useState(0);
  const [chatCount, setChatCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch document count
    (async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get('/api/documents', { headers: { Authorization: `Bearer ${token}` } });
        setDocCount(res.data.documents?.length || 0);
      } catch {}
    })();
    // Fetch chat count (mocked for now)
    (async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get('/api/chat/history', { headers: { Authorization: `Bearer ${token}` } });
        setChatCount(res.data.chats?.length || 0);
      } catch { setChatCount(0); }
    })();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', fontFamily: 'var(--font-sans)' }}>
      <main style={{ flex: 1, padding: '3rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        {/* Welcome Section */}
        <section style={{ marginBottom: 40 }}>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '3.2rem',
            color: 'var(--gold)',
            fontWeight: 400,
            marginBottom: 8,
            letterSpacing: 2,
          }}>
            Welcome, {user?.name || 'Loading...'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: 0 }}>
            Your AI intelligence workspace is ready
          </p>
        </section>

        {/* Stat Tiles */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32, marginBottom: 48 }}>
          <div style={{
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-deep)',
            padding: '2.2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: 0,
          }}>
            <div style={{ color: 'var(--gold)', fontSize: 38, fontWeight: 700, fontFamily: 'var(--font-sans)' }}>{docCount}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 6 }}>Documents Indexed</div>
          </div>
          <div style={{
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-deep)',
            padding: '2.2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: 0,
          }}>
            <div style={{ color: 'var(--gold)', fontSize: 38, fontWeight: 700, fontFamily: 'var(--font-sans)' }}>{chatCount}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 6 }}>Chats Started</div>
          </div>
          <div style={{
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-deep)',
            padding: '2.2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: 0,
          }}>
            <div style={{ color: 'var(--gold)', fontSize: 22, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 6 }}>Member Since</div>
          </div>
        </section>

        {/* Quick Actions */}
        <section style={{ display: 'flex', gap: 24 }}>
          <button
            onClick={() => navigate('/chat')}
            style={{
              background: 'var(--gold)',
              color: '#1a1408',
              border: 'none',
              borderRadius: 999,
              padding: '14px 38px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: '1.1rem',
              letterSpacing: 2,
              cursor: 'pointer',
              boxShadow: '0 2px 16px 0 rgba(201,168,76,0.08)',
              transition: 'background 0.2s',
            }}
            aria-label="New Chat"
            data-testid="dashboard-new-chat"
          >New Chat →</button>
          <button
            onClick={() => navigate('/dashboard?upload=1')}
            style={{
              background: 'var(--bg-glass)',
              color: 'var(--gold)',
              border: '1.5px solid var(--gold)',
              borderRadius: 999,
              padding: '14px 38px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: '1.1rem',
              letterSpacing: 2,
              cursor: 'pointer',
              boxShadow: '0 2px 16px 0 rgba(201,168,76,0.08)',
              transition: 'background 0.2s',
            }}
            aria-label="Upload Document"
            data-testid="dashboard-upload-doc"
          >Upload Document →</button>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;

