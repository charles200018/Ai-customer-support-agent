
import '../styles/theme.css'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      fontFamily: 'DM Sans, Arial, sans-serif',
      color: 'var(--color-pearl)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <nav style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-card-border)',
        padding: '1.5rem 3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'var(--color-accent)', letterSpacing: 4 }}>
          AXIOM
        </span>
        <div style={{ display: 'flex', gap: 16 }}>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'var(--color-accent)',
              color: 'var(--color-bg)',
              border: 'none',
              padding: '10px 28px',
              borderRadius: 6,
              fontFamily: 'DM Sans, Arial, sans-serif',
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: 2,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}>Sign In</button>
          </Link>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'transparent',
              color: 'var(--color-accent)',
              border: '1px solid var(--color-accent)',
              padding: '10px 28px',
              borderRadius: 6,
              fontFamily: 'DM Sans, Arial, sans-serif',
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: 2,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}>Dashboard</button>
          </Link>
        </div>
      </nav>
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
      }}>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '3.2rem',
          color: 'var(--color-accent)',
          fontWeight: 400,
          marginBottom: '1.5rem',
          letterSpacing: 2,
        }}>
          AI Customer Support, Reimagined
        </h1>
        <p style={{
          fontSize: '1.35rem',
          color: 'var(--color-pearl)',
          maxWidth: 540,
          textAlign: 'center',
          marginBottom: '2.5rem',
          opacity: 0.85,
        }}>
          Delight your customers with instant, accurate answers powered by AI and your own knowledge base. Secure, scalable, and beautifully designed for modern support teams.
        </p>
        <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'var(--color-accent)',
              color: 'var(--color-bg)',
              border: 'none',
              padding: '14px 38px',
              borderRadius: 8,
              fontFamily: 'DM Sans, Arial, sans-serif',
              fontWeight: 700,
              fontSize: '1.1rem',
              letterSpacing: 2,
              cursor: 'pointer',
              boxShadow: '0 2px 16px 0 rgba(201,169,110,0.08)',
              transition: 'background 0.2s',
            }}>Get Started</button>
          </Link>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'transparent',
              color: 'var(--color-accent)',
              border: '1.5px solid var(--color-accent)',
              padding: '14px 38px',
              borderRadius: 8,
              fontFamily: 'DM Sans, Arial, sans-serif',
              fontWeight: 700,
              fontSize: '1.1rem',
              letterSpacing: 2,
              cursor: 'pointer',
              boxShadow: '0 2px 16px 0 rgba(201,169,110,0.08)',
              transition: 'background 0.2s',
            }}>Live Demo</button>
          </Link>
        </div>
      </main>
      <footer style={{
        textAlign: 'center',
        color: 'var(--color-pearl)',
        opacity: 0.5,
        fontSize: '0.95rem',
        padding: '1.5rem 0 0.5rem 0',
        fontFamily: 'DM Sans, Arial, sans-serif',
      }}>
        &copy; {new Date().getFullYear()} AXIOM — AI Customer Support Agent
      </footer>
    </div>
  )
}

export default Home
        <ul>
          <li>Google login succeeds</li>
          <li>Dashboard is protected without a token</li>
          <li>Logout clears session and returns to login</li>
        </ul>
      </div>
    </div>
  )
}

export default Home
