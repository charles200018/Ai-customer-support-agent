import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"

function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0B" }}>
      <nav style={{ background: "#111114", borderBottom: "1px solid rgba(201,169,110,0.12)", padding: "1.25rem 3rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "1.4rem", color: "#C9A96E", letterSpacing: 4 }}>AXIOM</span>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ color: "#C8C8D8" }}>{user?.name}</span>
          <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid rgba(201,169,110,0.3)", color: "#C9A96E", padding: "8px 20px", cursor: "pointer" }}>Logout</button>
        </div>
      </nav>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 2rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 300, color: "#F4F2EC", marginBottom: "2rem" }}>Welcome, {user?.name}</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {[
            { icon: "📄", title: "Upload Documents", desc: "Upload PDF and TXT files", path: "/upload" },
            { icon: "💬", title: "Chat with AI", desc: "Ask questions about documents", path: "/chat" },
            { icon: "⚙️", title: "Admin Panel", desc: "Manage users and analytics", path: "/admin" },
          ].map((card, i) => (
            <div key={i} onClick={() => navigate(card.path)} style={{ background: "#1A1A1F", border: "1px solid rgba(201,169,110,0.08)", padding: "28px 24px", cursor: "pointer" }}>
              <div style={{ fontSize: "2rem", marginBottom: 16 }}>{card.icon}</div>
              <div style={{ fontSize: "1.2rem", color: "#F4F2EC", marginBottom: 8 }}>{card.title}</div>
              <div style={{ fontSize: "13px", color: "#8A8A9A" }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"

function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0B" }}>
      <nav style={{ background: "#111114", borderBottom: "1px solid rgba(201,169,110,0.12)", padding: "1.25rem 3rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "1.4rem", color: "#C9A96E", letterSpacing: 4 }}>AXIOM</span>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ color: "#C8C8D8" }}>{user?.name}</span>
          <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid rgba(201,169,110,0.3)", color: "#C9A96E", padding: "8px 20px", cursor: "pointer" }}>Logout</button>
        </div>
      </nav>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 2rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 300, color: "#F4F2EC", marginBottom: "2rem" }}>Welcome, {user?.name}</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {[
            { icon: "📄", title: "Upload Documents", desc: "Upload PDF and TXT files", path: "/upload" },
            { icon: "💬", title: "Chat with AI", desc: "Ask questions about documents", path: "/chat" },
            { icon: "⚙️", title: "Admin Panel", desc: "Manage users and analytics", path: "/admin" },
          ].map((card, i) => (
            <div key={i} onClick={() => navigate(card.path)} style={{ background: "#1A1A1F", border: "1px solid rgba(201,169,110,0.08)", padding: "28px 24px", cursor: "pointer" }}>
              <div style={{ fontSize: "2rem", marginBottom: 16 }}>{card.icon}</div>
              <div style={{ fontSize: "1.2rem", color: "#F4F2EC", marginBottom: 8 }}>{card.title}</div>
              <div style={{ fontSize: "13px", color: "#8A8A9A" }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
