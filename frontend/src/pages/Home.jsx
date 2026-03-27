import '../styles/theme.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthHook';
import { useEffect, useRef } from 'react';
import React from 'react';

function Home() {
  const navigate = useNavigate();
  let isAuthenticated = false;
  try {
    // Try to get auth context, fallback to false if not available
    const { user } = useAuth();
    isAuthenticated = !!user;
  } catch {}

  // Animated gold radial glow
  const glowRef = useRef();
  useEffect(() => {
    if (glowRef.current) {
      glowRef.current.animate([
        { opacity: 0.06, filter: 'blur(0px)' },
        { opacity: 0.13, filter: 'blur(2px)' },
        { opacity: 0.06, filter: 'blur(0px)' }
      ], {
        duration: 4000,
        iterations: Infinity,
        direction: 'alternate',
        easing: 'ease-in-out',
      });
    }
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) navigate('/dashboard');
    else navigate('/login');
  };
  const handleSignIn = () => {
    if (isAuthenticated) navigate('/dashboard');
    else navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <nav style={{
        background: 'var(--bg-glass)',
        borderBottom: '1px solid var(--border-glass)',
        padding: '1.5rem 3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-deep)',
      }}>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'var(--gold)', letterSpacing: 4 }}>
          AXIOM
        </span>
        <div style={{ display: 'flex', gap: 16 }}>
          <button
            onClick={handleSignIn}
            style={{
              background: 'var(--gold)',
              color: '#1a1408',
              border: 'none',
              padding: '10px 28px',
              borderRadius: 8,
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: 2,
              cursor: 'pointer',
              transition: 'background 0.2s',
              boxShadow: '0 2px 16px 0 rgba(201,168,76,0.08)',
            }}
            aria-label="Sign In"
            data-testid="landing-sign-in"
          >Sign In</button>
        </div>
      </nav>
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        position: 'relative',
      }}>
        {/* Animated gold radial glow */}
        <div ref={glowRef} aria-hidden="true" style={{
          position: 'absolute',
          left: '50%',
          top: '30%',
          width: 420,
          height: 420,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--gold) 0%, transparent 70%)',
          opacity: 0.06,
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'blur(0px)',
        }} />
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '3.2rem',
          color: 'var(--gold)',
          fontWeight: 400,
          marginBottom: '1.5rem',
          letterSpacing: 2,
          zIndex: 1,
        }}>
          AI Customer Support, Reimagined
        </h1>
        <p style={{
          fontSize: '1.35rem',
          color: 'var(--text-primary)',
          maxWidth: 540,
          textAlign: 'center',
          marginBottom: '2.5rem',
          opacity: 0.85,
          zIndex: 1,
        }}>
          Delight your customers with instant, accurate answers powered by AI and your own knowledge base. Secure, scalable, and beautifully designed for modern support teams.
        </p>
        <div style={{ display: 'flex', gap: 24, marginTop: 24, zIndex: 1 }}>
          <button
            onClick={handleGetStarted}
            style={{
              background: 'var(--gold)',
              color: '#1a1408',
              border: 'none',
              padding: '14px 38px',
              borderRadius: 999,
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: '1.1rem',
              letterSpacing: 2,
              cursor: 'pointer',
              boxShadow: '0 2px 16px 0 rgba(201,168,76,0.08)',
              transition: 'background 0.2s',
            }}
            aria-label="Get Started"
            data-testid="landing-get-started"
          >Get Started</button>
        </div>
      </main>
      <footer style={{
        textAlign: 'center',
        color: 'var(--text-primary)',
        opacity: 0.5,
        fontSize: '0.95rem',
        padding: '1.5rem 0 0.5rem 0',
        fontFamily: 'var(--font-sans)',
      }}>
        &copy; {new Date().getFullYear()} AXIOM — AI Customer Support Agent
      </footer>
    </div>
  );
}

export default Home
