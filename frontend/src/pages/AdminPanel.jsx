import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats] = useState({ users: 142, documents: 1847, conversations: 4291, apiCalls: 28430 });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const G = '#C9A96E';

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0B', fontFamily: "'DM Sans', sans-serif" }}>
      <nav style={{ background: '#111114', borderBottom: '1px solid rgba(201,169,110,0.12)', padding: '1.25rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: G, letterSpacing: 4 }}>
          AXIOM <span style={{ fontSize: '0.75rem', color: '#8A8A9A', letterSpacing: 2 }}>ADMIN</span>
        </span>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: '1px solid rgba(201,169,110,0.3)', color: G, padding: '8px 20px', cursor: 'pointer', fontSize: '11px', letterSpacing: 2 }}>DASHBOARD</button>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid rgba(201,169,110,0.15)', color: '#8A8A9A', padding: '8px 20px', cursor: 'pointer', fontSize: '11px', letterSpacing: 2 }}>LOGOUT</button>
        </div>
      </nav>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 2rem' }}>
        <p style={{ color: G, fontSize: '11px', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Administration</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 300, color: '#F4F2EC', marginBottom: '2.5rem' }}>System Overview</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'rgba(201,169,110,0.08)', marginBottom: 48 }}>
          {[
            { label: 'Total Users', value: stats.users },
            { label: 'Documents', value: stats.documents.toLocaleString() },
            { label: 'Conversations', value: stats.conversations.toLocaleString() },
            { label: 'API Calls', value: `${Math.round(stats.apiCalls/1000)}k` },
          ].map((s, i) => (
            <div key={i} style={{ background: '#111114', padding: '28px 32px' }}>
              <div style={{ fontSize: '10px', letterSpacing: 2, textTransform: 'uppercase', color: '#8A8A9A', marginBottom: 12 }}>{s.label}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.8rem', fontWeight: 300, color: '#F4F2EC', lineHeight: 1 }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: '10px', letterSpacing: 3, textTransform: 'uppercase', color: G, marginBottom: 20 }}>Recent Users</div>
          <div style={{ background: '#1A1A1F', border: '1px solid rgba(201,169,110,0.08)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['User', 'Email', 'Documents', 'Last Active', 'Role'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: '10px', letterSpacing: 2, textTransform: 'uppercase', color: G, borderBottom: '1px solid rgba(201,169,110,0.1)', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: user?.name || 'You', email: user?.email || '—', docs: '—', active: 'Now', role: 'Admin' },
                  { name: 'Aisha Rahman', email: 'aisha@example.com', docs: 18, active: '2h ago', role: 'User' },
                  { name: 'Marcus Kim', email: 'marcus@example.com', docs: 7, active: 'Yesterday', role: 'User' },
                  { name: 'Priya Larsen', email: 'priya@example.com', docs: 31, active: '3h ago', role: 'User' },
                ].map((u, i) => (
                  <tr key={i}>
                    <td style={{ padding: '14px 20px', color: '#C8C8D8', fontSize: '13px', borderBottom: '1px solid rgba(201,169,110,0.04)' }}>{u.name}</td>
                    <td style={{ padding: '14px 20px', color: '#8A8A9A', fontSize: '13px', borderBottom: '1px solid rgba(201,169,110,0.04)' }}>{u.email}</td>
                    <td style={{ padding: '14px 20px', color: '#C8C8D8', fontSize: '13px', borderBottom: '1px solid rgba(201,169,110,0.04)' }}>{u.docs}</td>
                    <td style={{ padding: '14px 20px', color: '#8A8A9A', fontSize: '13px', borderBottom: '1px solid rgba(201,169,110,0.04)' }}>{u.active}</td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid rgba(201,169,110,0.04)' }}>
                      <span style={{ padding: '3px 10px', fontSize: '10px', letterSpacing: 1.5, background: u.role === 'Admin' ? 'rgba(201,169,110,0.1)' : 'rgba(45,107,74,0.15)', border: `1px solid ${u.role === 'Admin' ? 'rgba(201,169,110,0.25)' : 'rgba(45,107,74,0.3)'}`, color: u.role === 'Admin' ? G : '#2D6B4A' }}>{u.role}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ background: '#1A1A1F', border: '1px solid rgba(201,169,110,0.08)', padding: '28px 32px' }}>
          <div style={{ fontSize: '10px', letterSpacing: 3, textTransform: 'uppercase', color: G, marginBottom: 20 }}>System Health</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {[
              { label: 'API Status', value: 'Operational', ok: true },
              { label: 'Firebase', value: 'Connected', ok: true },
              { label: 'Groq AI', value: 'Active', ok: true },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.ok ? '#2D6B4A' : '#c0392b', flexShrink: 0 }}></div>
                <div>
                  <div style={{ fontSize: '11px', color: '#8A8A9A', letterSpacing: 1 }}>{item.label}</div>
                  <div style={{ fontSize: '13px', color: item.ok ? '#9f9' : '#f88' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminPanel;
