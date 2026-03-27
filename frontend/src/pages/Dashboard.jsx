import '../styles/theme.css'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0B', fontFamily: "'DM Sans', sans-serif" }}>
      <nav style={{ background: '#111114', borderBottom: '1px solid rgba(201,169,110,0.12)', padding: '1.25rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: '#C9A96E', letterSpacing: 4 }}>AXIOM</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ color: '#C8C8D8', fontSize: '0.9rem' }}>{user?.name}</span>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid rgba(201,169,110,0.3)', color: '#C9A96E', padding: '8px 20px', cursor: 'pointer', fontSize: '11px', letterSpacing: 2 }}>LOGOUT</button>
        </div>
      </nav>
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 2rem' }}>
        <p style={{ color: '#C9A96E', fontSize: '11px', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Welcome Back</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', fontWeight: 300, color: '#F4F2EC', marginBottom: 8 }}>
          {user?.name || 'Loading...'}
        </h1>
        <p style={{ color: '#8A8A9A', marginBottom: '3rem' }}>Your AI intelligence workspace is ready</p>

        <div style={{ display: 'grid', gridTemplateColumns: user?.role === 'Admin' ? 'repeat(3,1fr)' : 'repeat(2,1fr)', gap: 16, marginBottom: 40 }}>
          {[
            { icon: '📄', title: 'Upload Documents', desc: 'Upload PDF and TXT files to your knowledge base', path: '/upload' },
            { icon: '💬', title: 'Chat with AI', desc: 'Ask questions about your uploaded documents', path: '/chat' },
            ...(user?.role === 'Admin' ? [{ icon: '⚙️', title: 'Admin Panel', desc: 'Manage users and view system analytics', path: '/admin' }] : [])
          ].map((card, i) => (
            <div key={i} onClick={() => navigate(card.path)}
              style={{ background: '#1A1A1F', border: '1px solid rgba(201,169,110,0.08)', padding: '28px 24px', cursor: 'pointer', transition: 'border-color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,169,110,0.35)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,169,110,0.08)'}>
              <div style={{ fontSize: '2rem', marginBottom: 16 }}>{card.icon}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: '#F4F2EC', marginBottom: 8 }}>{card.title}</div>
              <div style={{ fontSize: '13px', color: '#8A8A9A', marginBottom: 20, lineHeight: 1.5 }}>{card.desc}</div>
              <div style={{ fontSize: '11px', color: '#C9A96E', letterSpacing: 2 }}>OPEN →</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#1A1A1F', border: '1px solid rgba(201,169,110,0.08)', padding: '28px 32px' }}>
          <div style={{ fontSize: '10px', letterSpacing: 3, textTransform: 'uppercase', color: '#C9A96E', marginBottom: 20 }}>Account Information</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
            {[
              ['Name', user?.name],
              ['Email', user?.email],
              ['User ID', user?.id || 'N/A'],
              ['Member Since', user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A']
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: '11px', color: '#8A8A9A', letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' }}>{k}</div>
                <div style={{ color: '#C8C8D8', fontSize: '14px' }}>{v || '-'}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard

