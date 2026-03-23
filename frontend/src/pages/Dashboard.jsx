import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="nav-content">
          <h2 className="logo">AI Customer Support Agent</h2>
          <div className="user-menu">
            <span className="user-name">{user?.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="container">
          <div className="welcome-section">
            <h1>Welcome, {user?.name}!</h1>
            <p className="welcome-subtitle">
              Your AI Customer Support Agent is ready to use
            </p>
          </div>

          <div className="dashboard-grid">
            <div className="card">
              <h3>📄 Upload Documents</h3>
              <p>Upload PDF and TXT files (Phase 3)</p>
              <button className="action-btn" onClick={() => navigate('/upload')}>
                Open Upload
              </button>
            </div>

            <div className="card">
              <h3>💬 Chat</h3>
              <p>Ask questions about your documents (Phase 5)</p>
              <button className="action-btn" onClick={() => navigate('/chat')}>
                Open Chat
              </button>
            </div>

            <div className="card">
              <h3>📊 Dashboard</h3>
              <p>View your documents and chat history (Phase 11)</p>
              <button disabled className="action-btn">
                Coming in Phase 11
              </button>
            </div>

            <div className="card">
              <h3>⚙️ Settings</h3>
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
