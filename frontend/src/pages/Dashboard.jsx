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
    <div style={{ minHeight: '100vh', background: '#0A0A0B', fontFamily: 'DM Sans, sans-serif' }}>
      <nav style={{ background: '#111114', borderBottom: '1px solid rgba(201,169,110,0.12)', padding: '1.25rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'serif', fontSize: '1.4rem', color: '#C9A96E', letterSpacing: 4 }}>AXIOM</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ color: '#C8C8D8', fontSize: '0.9rem' }}>{user?.name}</span>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid rgba(201,169,110,0.3)', color: '#C9A96E', padding: '8px 20px', cursor: 'pointer', fontSize: '11px', letterSpacing: 2 }}>LOGOUT</button>
        </div>
      </nav>
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 2rem' }}>
        <p style={{ color: '#C9A96E', fontSize: '11px', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Welcome Back</p>
        <h1 style={{ fontFamily: 'serif', fontSize: '3rem', fontWeight: 300, color: '#F4F2EC', marginBottom: 8 }}>
          {user?.name}
        </h1>
        <p style={{ color: '#8A8A9A', marginBottom: '3rem' }}>Your AI intelligence workspace</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'rgba(201,169,110,0.08)', marginBottom: 40 }}>
          {[
            { label: 'Documents', value: '—' },
            { label: 'Conversations', value: '—' },
            { label: 'Knowledge Bases', value: '—' },
            { label: 'Status', value: 'Active' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#111114', padding: '28px 32px' }}>
              <div style={{ fontSize: '10px', letterSpacing: 2, textTransform: 'uppercase', color: '#8A8A9A', marginBottom: 12 }}>{s.label}</div>
              <div style={{ fontFamily: 'serif', fontSize: '2.5rem', fontWeight: 300, color: '#F4F2EC' }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 40 }}>
          {[
            { icon: '📄', title: 'Upload Documents', desc: 'Upload PDF and TXT files to your knowledge base', path: '/upload' },
            { icon: '💬', title: 'Chat with AI', desc: 'Ask questions about your uploaded documents', path: '/chat' },
            { icon: '⚙️', title: 'Admin Panel', desc: 'Manage users and view analytics', path: '/admin' },
          ].map((card, i) => (
            <div key={i} onClick={() => navigate(card.path)}
              style={{ background: '#1A1A1F', border: '1px solid rgba(201,169,110,0.08)', padding: '28px 24px', cursor: 'pointer', transition: 'border-color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,169,110,0.08)'}>
              <div style={{ fontSize: '2rem', marginBottom: 16 }}>{card.icon}</div>
              <div style={{ fontFamily: 'serif', fontSize: '1.3rem', color: '#F4F2EC', marginBottom: 8 }}>{card.title}</div>
              <div style={{ fontSize: '13px', color: '#8A8A9A', marginBottom: 20 }}>{card.desc}</div>
              <div style={{ fontSize: '11px', color: '#C9A96E', letterSpacing: 2 }}>OPEN →</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#1A1A1F', border: '1px solid rgba(201,169,110,0.08)', padding: '28px 32px' }}>
          <div style={{ fontSize: '10px', letterSpacing: 3, textTransform: 'uppercase', color: '#C9A96E', marginBottom: 20 }}>Account Information</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            {[
              ['Name', user?.name],
              ['Email', user?.email],
              ['User ID', user?.id || 'N/A'],
              ['Member Since', user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A']
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: '11px', color: '#8A8A9A', letterSpacing: 1, marginBottom: 4 }}>{k.toUpperCase()}</div>
                <div style={{ color: '#C8C8D8', fontSize: '14px' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
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
    <div style={{ minHeight: '100vh', background: '#0A0A0B' }}>
      <nav style={{ background: '#111114', borderBottom: '1px solid rgba(201,169,110,0.12)', padding: '1.25rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: '#C9A96E', letterSpacing: 4 }}>AXIOM</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ color: '#C8C8D8', fontSize: '0.9rem' }}>{user?.name}</span>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid rgba(201,169,110,0.3)', color: '#C9A96E', padding: '8px 20px', cursor: 'pointer', fontSize: '11px', letterSpacing: 2 }}>LOGOUT</button>
        </div>
      </nav>
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 2rem' }}>
        <p style={{ color: '#C9A96E', fontSize: '11px', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Good Morning</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', fontWeight: 300, color: '#F4F2EC', marginBottom: 8 }}>
          Welcome, <em style={{ color: '#E4C99A' }}>{user?.name}</em>
        </h1>
        <p style={{ color: '#8A8A9A', marginBottom: '3rem' }}>Your intelligence workspace is ready</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {[
            { icon: '📄', title: 'Upload Documents', desc: 'Upload PDF and TXT files', action: () => navigate('/upload') },
            { icon: '💬', title: 'Chat with AI', desc: 'Ask questions about documents', action: () => navigate('/chat') },
            { icon: '⚙️', title: 'Admin Panel', desc: 'Manage users and analytics', action: () => navigate('/admin') },
          ].map((card, i) => (
            <div key={i} onClick={card.action} style={{ background: '#1A1A1F', border: '1px solid rgba(201,169,110,0.08)', padding: '28px 24px', cursor: 'pointer' }}>
              <div style={{ fontSize: '2rem', marginBottom: 16 }}>{card.icon}</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#F4F2EC', marginBottom: 8 }}>{card.title}</div>
              <div style={{ fontSize: '13px', color: '#8A8A9A' }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
// ✅ 1. ALL IMPORTS AT THE TOP (no exceptions)
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
    <div style={{ minHeight: '100vh', background: '#0A0A0B' }}>
      <nav style={{ background: '#111114', borderBottom: '1px solid rgba(201,169,110,0.12)', padding: '1.25rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: '#C9A96E', letterSpacing: 4 }}>AXIOM</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ color: '#C8C8D8', fontSize: '0.9rem' }}>{user?.name}</span>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid rgba(201,169,110,0.3)', color: '#C9A96E', padding: '8px 20px', cursor: 'pointer', fontSize: '11px', letterSpacing: 2 }}>LOGOUT</button>
        </div>
      </nav>
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 2rem' }}>
        <p style={{ color: '#C9A96E', fontSize: '11px', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Good Morning</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', fontWeight: 300, color: '#F4F2EC', marginBottom: 8 }}>
          Welcome, <em style={{ color: '#E4C99A' }}>{user?.name}</em>
        </h1>
        <p style={{ color: '#8A8A9A', marginBottom: '3rem' }}>Your intelligence workspace is ready</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {[
            { icon: '📄', title: 'Upload Documents', desc: 'Upload PDF and TXT files', action: () => navigate('/upload') },
            { icon: '💬', title: 'Chat with AI', desc: 'Ask questions about documents', action: () => navigate('/chat') },
            { icon: '⚙️', title: 'Admin Panel', desc: 'Manage users and analytics', action: () => navigate('/admin') },
          ].map((card, i) => (
            <div key={i} onClick={card.action} style={{ background: '#1A1A1F', border: '1px solid rgba(201,169,110,0.08)', padding: '28px 24px', cursor: 'pointer' }}>
              <div style={{ fontSize: '2rem', marginBottom: 16 }}>{card.icon}</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#F4F2EC', marginBottom: 8 }}>{card.title}</div>
              <div style={{ fontSize: '13px', color: '#8A8A9A' }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Dashboard

        {/* Stats Grid */}
        <div className="grid grid-4 mb-2">
          {stats.map((stat, i) => (
            <div key={i} className="card flex flex-center" style={{ flexDirection: 'column', minHeight: 140 }}>
              <span style={{ fontSize: '2.2rem', marginBottom: 8 }}>{stat.icon}</span>
              <span style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', color: 'var(--color-accent)' }}>{stat.value}</span>
              <span style={{ color: 'var(--color-pearl)', fontSize: '1.1em', opacity: 0.8 }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Knowledge Base Cards */}
        <div className="grid grid-3">
          {kbCards.filter(card => !card.admin || isAdmin).map((card, i) => (
            <div key={i} className="card" style={{ minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ color: 'var(--color-accent)', fontFamily: 'Cormorant Garamond', fontSize: '1.4rem', marginBottom: 8 }}>{card.title}</h3>
                <p style={{ color: 'var(--color-pearl)', opacity: 0.85 }}>{card.desc}</p>
              </div>
              <button className="btn" style={{ marginTop: 18, alignSelf: 'flex-start' }} onClick={card.action}>
                Open
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard
              <p>Manage your account and preferences (Phase 14+)</p>
              <button disabled className="action-btn">
                Coming Soon
              </button>
            </div>
          </div>

          <div className="phase-status">
            <h3>📋 Current Implementation Status</h3>
            <div className="status-list">
              <div className="status-item completed">
                ✅ Phase 1: Project Setup
              </div>
              <div className="status-item completed">
                ✅ Phase 2: Google Authentication
              </div>
              <div className="status-item completed">
                ✅ Phase 3: File Upload + Text Extraction
              </div>
              <div className="status-item completed">
                ✅ Phase 4: Store Documents in Firebase / Firestore
              </div>
              <div className="status-item completed">
                ✅ Phase 5: Basic Chat UI + Mock Replies
              </div>
              <div className="status-item pending">
                ⏳ Phases 6-15: Coming Soon
              </div>
            </div>
          </div>

          <div className="user-info">
            <h3>👤 Your Information</h3>
            <div className="info-box">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>User ID:</strong> {user?.id}</p>
              <p><strong>Joined:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
