import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function AdminPanel() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats] = useState({ users: 142, documents: 1847, conversations: 4291 })

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0B', fontFamily: 'DM Sans, sans-serif' }}>
      <nav style={{ background: '#111114', borderBottom: '1px solid rgba(201,169,110,0.12)', padding: '1.25rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'serif', fontSize: '1.4rem', color: '#C9A96E', letterSpacing: 4 }}>AXIOM <span style={{ fontSize: '0.8rem', color: '#8A8A9A' }}>Admin</span></span>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: '1px solid rgba(201,169,110,0.3)', color: '#C9A96E', padding: '8px 20px', cursor: 'pointer', fontSize: '11px', letterSpacing: 2 }}>DASHBOARD</button>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid rgba(201,169,110,0.2)', color: '#8A8A9A', padding: '8px 20px', cursor: 'pointer', fontSize: '11px', letterSpacing: 2 }}>LOGOUT</button>
        </div>
      </nav>
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 2rem' }}>
        <p style={{ color: '#C9A96E', fontSize: '11px', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Administration</p>
        <h1 style={{ fontFamily: 'serif', fontSize: '2.5rem', fontWeight: 300, color: '#F4F2EC', marginBottom: '2rem' }}>System Overview</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'rgba(201,169,110,0.08)', marginBottom: 40 }}>
          {[
            { label: 'Total Users', value: stats.users },
            { label: 'Documents Indexed', value: stats.documents.toLocaleString() },
            { label: 'Conversations', value: stats.conversations.toLocaleString() },
          ].map((s, i) => (
            <div key={i} style={{ background: '#111114', padding: '32px 40px' }}>
              <div style={{ fontSize: '10px', letterSpacing: 2, textTransform: 'uppercase', color: '#8A8A9A', marginBottom: 12 }}>{s.label}</div>
              <div style={{ fontFamily: 'serif', fontSize: '3rem', fontWeight: 300, color: '#F4F2EC' }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#1A1A1F', border: '1px solid rgba(201,169,110,0.08)' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(201,169,110,0.08)', fontSize: '10px', letterSpacing: 3, textTransform: 'uppercase', color: '#C9A96E' }}>Recent Users</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['User', 'Email', 'Documents', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: '10px', letterSpacing: 2, textTransform: 'uppercase', color: '#C9A96E', borderBottom: '1px solid rgba(201,169,110,0.08)', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: user?.name || 'You', email: user?.email || '—', docs: '—', status: 'Admin' },
                { name: 'Aisha Rahman', email: 'aisha@example.com', docs: 18, status: 'Active' },
                { name: 'Marcus Kim', email: 'marcus@example.com', docs: 7, status: 'Active' },
              ].map((u, i) => (
                <tr key={i}>
                  <td style={{ padding: '14px 20px', color: '#C8C8D8', fontSize: '13px', borderBottom: '1px solid rgba(201,169,110,0.04)' }}>{u.name}</td>
                  <td style={{ padding: '14px 20px', color: '#8A8A9A', fontSize: '13px', borderBottom: '1px solid rgba(201,169,110,0.04)' }}>{u.email}</td>
                  <td style={{ padding: '14px 20px', color: '#C8C8D8', fontSize: '13px', borderBottom: '1px solid rgba(201,169,110,0.04)' }}>{u.docs}</td>
                  <td style={{ padding: '14px 20px', borderBottom: '1px solid rgba(201,169,110,0.04)' }}>
                    <span style={{ padding: '3px 10px', fontSize: '10px', letterSpacing: 1.5, background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.25)', color: '#C9A96E' }}>{u.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default AdminPanel
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate fetching admin stats
    async function fetchStats() {
      try {
        // Replace with real API call in production
        setStats({
          users: 42,
          documents: 123,
          chats: 456,
        });
      } catch (err) {
        setError('Failed to load admin stats');
      }
    }
    fetchStats();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: 8 }}>
      <h1>Admin Panel</h1>
      {error && <div style={{ color: '#900', marginBottom: '1rem' }}>{error}</div>}
      {stats ? (
        <div>
          <div><strong>Total Users:</strong> {stats.users}</div>
          <div><strong>Total Documents:</strong> {stats.documents}</div>
          <div><strong>Total Chats:</strong> {stats.chats}</div>
        </div>
      ) : (
        <div>Loading stats...</div>
      )}
      <button style={{ marginTop: 24 }} onClick={handleLogout}>Logout</button>
      <button style={{ marginLeft: 16 }} onClick={() => navigate('/dashboard')}>Dashboard</button>
    </div>
  );
}

export default AdminPanel;
