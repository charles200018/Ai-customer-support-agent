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

  // Sidebar menu items
  const menuItems = [
    { label: 'Upload Documents', path: '/upload' },
    { label: 'Chat with AI', path: '/chat' },
    ...(user?.role === 'Admin' ? [{ label: 'Admin Panel', path: '/admin' }] : [])
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0B', fontFamily: "'DM Sans', sans-serif", display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: '#111114', borderRight: '1px solid rgba(201,169,110,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '2rem 1.5rem 2rem 2rem' }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', color: '#C9A96E', letterSpacing: 4, marginBottom: 40 }}>AXIOM</span>
        <nav style={{ width: '100%' }}>
          {menuItems.map((item) => (
            <div key={item.path} onClick={() => navigate(item.path)}
              style={{ color: '#F4F2EC', padding: '12px 0', cursor: 'pointer', fontSize: '1.1rem', borderBottom: '1px solid rgba(201,169,110,0.08)', width: '100%', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
              onMouseLeave={e => e.currentTarget.style.color = '#F4F2EC'}>
              {item.label}
            </div>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', width: '100%' }}>
          <div style={{ color: '#C8C8D8', fontSize: '0.95rem', marginBottom: 12 }}>{user?.name}</div>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid rgba(201,169,110,0.3)', color: '#C9A96E', padding: '8px 20px', cursor: 'pointer', fontSize: '11px', letterSpacing: 2, width: '100%' }}>LOGOUT</button>
        </div>
      </aside>
      {/* Main content */}
      <main style={{ flex: 1, padding: '3rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
        <p style={{ color: '#C9A96E', fontSize: '11px', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Welcome Back</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', fontWeight: 300, color: '#F4F2EC', marginBottom: 8 }}>
          {user?.name || 'Loading...'}
        </h1>
        <p style={{ color: '#8A8A9A', marginBottom: '3rem' }}>Your AI intelligence workspace is ready</p>

        <div style={{ background: '#1A1A1F', border: '1px solid rgba(201,169,110,0.08)', padding: '28px 32px', maxWidth: 600 }}>
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

