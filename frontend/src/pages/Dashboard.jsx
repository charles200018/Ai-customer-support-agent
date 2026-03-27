
import '../styles/theme.css';
import { useAuth } from '../hooks/useAuthHook';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React from 'react';

function Dashboard() {
  const { user } = useAuth();
  const [docCount, setDocCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get('/api/documents', { headers: { Authorization: `Bearer ${token}` } });
        setDocCount(res.data.documents?.length || 0);
      } catch (err) {
        setDocCount(0); // Always show greeting and layout, even if API fails
      }
    })();
  }, []);

  // Format join date
  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', fontFamily: 'var(--font-body)' }}>
      <main style={{
        flex: 1,
        padding: 'clamp(32px, 6vw, 96px) var(--page-padding)',
        maxWidth: 900,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(40px, 8vw, 80px)',
          color: 'var(--gold-pure)',
          fontWeight: 300,
          marginBottom: 12,
          letterSpacing: 2,
        }}>
          Welcome,
          <br />
          {user?.name || ''}
        </h1>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--text-secondary)', marginBottom: 0 }}>
          Your AI intelligence workspace is ready.
        </div>
        <div style={{ width: 48, height: 1, background: 'var(--gold-pure)', margin: '40px 0' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 48 }}>
          <span
            tabIndex={0}
            role="link"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'color var(--duration-fast)',
              width: 'fit-content',
              outline: 'none',
            }}
            onClick={() => navigate('/chat')}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/chat'); }}
            aria-label="Start a new conversation"
            data-testid="dashboard-new-chat"
            onMouseOver={e => e.currentTarget.style.color = 'var(--gold-bright)'}
            onMouseOut={e => e.currentTarget.style.color = 'var(--text-primary)'}
          >
            → Start a new conversation
          </span>
          <span
            tabIndex={0}
            role="link"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'color var(--duration-fast)',
              width: 'fit-content',
              outline: 'none',
            }}
            onClick={() => navigate('/documents')}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/documents'); }}
            aria-label="Manage your documents"
            data-testid="dashboard-manage-docs"
            onMouseOver={e => e.currentTarget.style.color = 'var(--gold-bright)'}
            onMouseOut={e => e.currentTarget.style.color = 'var(--text-primary)'}
          >
            → Manage your documents
          </span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-tertiary)', marginTop: 32, marginBottom: 0, letterSpacing: 0.01 }}>
          {docCount} documents indexed
          {user?.created_at && (
            <>
              {' '}· Member since {joinDate}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

